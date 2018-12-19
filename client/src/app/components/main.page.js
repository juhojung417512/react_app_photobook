import React, {
    Component
} from 'react';
import ReactDOM from 'react-dom'
import {
    hot
} from 'react-hot-loader'
import {
    connect
} from 'react-redux';

import history from '../common/history'
import Photozone from './photozone.comp'
import Templatezone from './templatezone.comp'
import Template from './template.comp'
import Sticker from './sticker.comp'
import Divider from './divider.comp'
import { PHOTOBOOK_LIST ,SORT_LIST, ORDER_LIST, PreviewDivideValue} from '../common/constants'
import {HistoryManager, elem2canvas, sleep} from '../common/utils'
import Preview from './preview.comp'
import TemplateSelectComp from './templateselect.comp'
import NewPhotobookComp from './newphotobook.comp'
import LoadPhotobookComp from './loadphotobook.comp'

import {
    SetTemaplteIdx,
    GetTemplateInfo,
    ResetTemplateInfo,
    GetLoginData,
    CreatePhotobook,
    SortSlot,
    OrderSlot,
    GetPhotos,
    CreateSticker,
    GetStickers,
    UndoHistory,
    RedoHistory,
    CreateTextBox,
    CallPreview,
    NewPhotobook,
    LoadPhotobook,
    SavePhotobook,
    RefreshAllData,
    GetAllData,
    SelectTemplate,
} from "../common/actions"
import { timingSafeEqual } from 'crypto';
import { runInThisContext } from 'vm';

let mapStateToProps = (state) => {
    return {
        user: state.user,
        isLogin: state.user.isLogin,
        stickerList : state.photobook.stickerList,
        selectedSlot : state.photobook.selectedSlot,
        isCreate  :state.photobook.isCreate,
        isPhoto : state.photobook.isPhoto,
        isSticker : state.photobook.isSticker,
        isTextBox : state.photobook.isTextBox,
        redo : state.photobook.redo,
        undo : state.photobook.undo,
        pivot : state.photobook.pivot,
        photoList : state.photobook.photoList,
        preview : state.photobook.preview,
        template : state.photobook.template,
        allData : state.photobook.allData,
        templateCategoryId : state.photobook.templateCategoryId
    }
}

let mapDispatchToProps = (dispatch) => {
    return {
        NewPhotobook : (data) => dispatch(NewPhotobook(data)),
        LoadPhotobook : (id) => dispatch(LoadPhotobook(id)),
        SavePhotobook : (id,data) => dispatch(SavePhotobook(id,data)),
        SetTemaplteIdx : (idx) => dispatch(SetTemaplteIdx(idx)),
        GetTemplateInfo:(id)=>dispatch(GetTemplateInfo(id)),
        ResetTemplateInfo : ()=>dispatch(ResetTemplateInfo()),
        GetLoginData: () => dispatch(GetLoginData()),
        CreatePhotobook : ()=> dispatch(CreatePhotobook()),
        SortSlot : (type) => dispatch(SortSlot(type)),
        OrderSlot : (type) => dispatch(OrderSlot(type)),
        GetPhotos : ()=>dispatch(GetPhotos()),
        CreateSticker : (id,idx)=> dispatch(CreateSticker(id,idx)),
        GetStickers : ()=> dispatch(GetStickers()),
        UndoHistory : ()=>dispatch(UndoHistory()),
        RedoHistory : ()=>dispatch(RedoHistory()),
        CreateTextBox : ()=>dispatch(CreateTextBox()),
        CallPreview : ()=>dispatch(CallPreview()),
        RefreshAllData : ()=>dispatch(RefreshAllData()),
        GetAllData : ()=>dispatch(GetAllData()),
        SelectTemplate : (id)=>dispatch(SelectTemplate(id)),
    }
}

@hot(module)
@connect(mapStateToProps, mapDispatchToProps)
export default class extends Component {
    constructor() {
        super();
        this.state = {
            isLoading : false,
            showMenu : false,
            dropdownMenuStyle : {display:"none"},
            dropdownSortStyle : {display:"none"},
            dropdownOrderStyle : {display:"none"},
            popupStyle : {display:"none"},
            photoList : [],
            addPhotoList : [],
            templateIds : [],
            sticker_count : null,
            dividerState : 'Template',
            templates : [],
            templateIndex : 0,
            isPreview : false,
            previewCanvas : [],
            previewWidth : null,
            isTemplateView : false, // template preview flag
            isTemplateSelect : true, // template select flag
            isNewPhotobook : false, // new photo book flag
            isLoadPhotobook : false, // new load book flag
            templateCategoryId : null, 
            templateCategoryData : null,
            allData : null,
            isGetAllData : false,
            isCreatePhotobook : false,
            userId : null,
            photobookId : null
        };
    }

    componentDidMount() {
        window.timeoutList = []
        if (!window.getCookie('isLogin'))
            history.replace('/')
        this.setState({
            templates : [null],
            templateIds : [null],
            userId : window.getCookie('userId')
        })
        this.props.GetLoginData()
        this.props.SetTemaplteIdx(0)
        this.props.GetStickers() // sticker api need
        this.props.GetPhotos()
    }

    componentWillReceiveProps(nProps){
        if(this.props.photoList !== nProps.photoList || this.state.addPhotoList.length < nProps.photoList.length){
            this.setState({
                addPhotoList : [...nProps.photoList, ...this.state.addPhotoList]
            })
        } 
        if(nProps.stickerList !== null && this.state.sticker_count !== nProps.stickerList.length + 1){
            this.setState({
                sticker_count : nProps.stickerList.length + 1
            })
        }
        if(this.state.templates[this.state.templateIndex] !== nProps.template){
            this.state.templates[this.state.templateIndex] = nProps.template
            this.setState({
                templates : this.state.templates
            })
        }
        if(this.state.allData !== nProps.allData){
            this.setState({
                allData : nProps.allData
            },()=>{
                if(nProps.allData !== null){
                    if(this.state.isGetAllData){
                        this.setState({
                            isGetAllData : false,
                            isLoading : false
                        })
                        this.onClickSave(nProps.allData)
                    } else {
                        this.setPhotobook(nProps.allData)
                    }
                    this.props.RefreshAllData()
                }
            })
        }
        if(this.state.templateCategoryId !== nProps.templateCategoryId){
            this.setState({
                templateCategoryId : nProps.templateCategoryId
            })
        }
    }

    setPhotobook = async(data)=>{
        this.props.RefreshAllData()
        await this.setState({
            isLoading : true
        })
        for(let i=0;i<Object.keys(data).length;i++)
        {
            this.state.templates[i] = data[i].template
            this.state.templateIds[i] = data[i].template.id
        }
        await this.setState({
            templates : this.state.templates,
            templateIds : this.state.templateIds,
        })
        // load all template
        for(let i=0;i<Object.keys(data).length;i++){
            await this.setState({
                templateIndex : i
            })
            await sleep(500)
        }
        this.props.GetStickers()
        this.props.GetPhotos()
        await sleep(500)
        this.setState({
            isLoading : false,
            templateIndex : 0,
            dividerState : 'Template',
            isNewPhotobook : false,
            isLoadPhotobook : false
        })
    }

    showMenu = (e)=> {
        e.preventDefault();

        this.setState({ showMenu: true, dropdownMenuStyle : {display:"flex"}}, () => {
            document.addEventListener('click', this.closeMenu);
        });
    }

    closeMenu = (e)=> {
        if (this.state.showMenu)
            this.setState({ showMenu : false, dropdownMenuStyle : {display:"none"}}, () => {
                document.removeEventListener('click', this.closeMenu);
            });
    }

    showOrder = (e)=>{
        e.preventDefault();

        this.setState({ showOrder: true, dropdownOrderStyle : {display:"flex"}}, () => {
            document.addEventListener('click', this.closeOrder);
        });
    }

    closeOrder = (e)=>{
        if (this.state.showOrder)
            this.setState({ showOrder : false, dropdownOrderStyle : {display:"none"}}, () => {
                document.removeEventListener('click', this.closeOrder);
            });
    }

    showSort = (e)=>{
        e.preventDefault();

        this.setState({ showSort: true, dropdownSortStyle : {display:"flex"}}, () => {
            document.addEventListener('click', this.closeSort);
        });
    }

    closeSort = (e)=>{
        if (this.state.showSort)
            this.setState({ showSort : false, dropdownSortStyle : {display:"none"}}, () => {
                document.removeEventListener('click', this.closeSort);
            });
    }

    onClickUndo = ()=>{
        this.props.UndoHistory()
    }

    onClickRedo = ()=>{
        this.props.RedoHistory()
    }

    onClickTextBox = ()=>{
        this.props.CreateTextBox()
    }

    onClickSort = (type)=>{
        this.props.SortSlot(type)
    }

    onClickOrder = (type)=>{
        this.props.OrderSlot(type)
    }

    changeTemplate = async (idx)=>{
        for(let t of window.timeoutList)
            clearTimeout(t)
        this.props.SetTemaplteIdx(idx)
        this.props.GetStickers() // sticker api need
        this.props.GetPhotos()
        if(idx >= this.state.templates.length){
            await this.newTemplate()
        }

        this.setState({
            ...this.state,
            templateIndex : idx,
            dividerState  : 'Template',
            previewCanvas : this.state.previewCanvas
        })
    }

    onClickTemplateMove = (type) =>{
        let idx = this.state.templateIndex
        if(type === 'prev' && idx - 1 >= 0){
            this.changeTemplate(idx - 1)
        }
        else if(type === 'next' && this.state.templates[this.state.templateIndex] !== null){
            this.changeTemplate(idx + 1)
        }
    }

    setTemplateId = (id)=>{
        this.state.templateIds[this.state.templateIndex] = id
        this.props.GetTemplateInfo(id)
        this.setState({
            templateIds : this.state.templateIds,
        })
    }

    newTemplate = async ()=>{
        await this.setState({
            templates : [...this.state.templates,null],
            templateIds : [...this.state.templateIds,null],
            templateIndex : this.state.templateIndex + 1,
            dividerState  : null
        })
    }

    onClickPreview = async()=>{
        this.props.CallPreview()
        await sleep(1000)
        this.setState({
            isPreview : true
        })
    }

    onClickClosePreview = ()=>{
        this.setState({
            isPreview : false
        })
    }

    updatePreview = (template,idx,style) =>{
        if(template === undefined || this.refs.previewBox0 === undefined || this.state.templateIndex !== idx)
            return
        
        let clone = template.cloneNode(true)
        
        let child = eval('this.refs.previewBox'+idx+'.appendChild(clone)')
        if(this.state.previewCanvas[idx] !== undefined){
            eval('this.refs.previewBox'+idx+'.removeChild(this.refs.previewBox'+idx+'.children[0])')
            child.classList.add('preview-frame')
            child.children[0].style.transform = `${style} scale(${PreviewDivideValue})`
            child.addEventListener('click',()=>{
                this.onClickCanvas(idx)
            })
            this.state.previewCanvas[idx] = child
            this.setState({
                previewCanvas : this.state.previewCanvas,
            })
        } else{
            child.classList.add('preview-frame')
            child.addEventListener('click',()=>{
                this.onClickCanvas(idx)
            })
            this.setState({
                previewCanvas : [...this.state.previewCanvas, child],
            })
        }
        this.setState({
            previewWidth : this.refs.frameBox.clientWidth * PreviewDivideValue
        })
    }

    onClickCanvas = (idx) =>{
        if(this.state.templateIndex !== idx)
            this.changeTemplate(idx)
    }
    
    onClickTSComp = (flag,data)=>{
        if(!flag){
            this.setState({
                isTemplateSelect : false
            })
            return
        }
        if(data === null || data === undefined){
            alert("템플릿을 선택해주세요.")
            return
        }
        this.props.SelectTemplate(data.id)
        this.setState({
            isTemplateSelect : false,
            isNewPhotobook : true,
            templateCategoryData : data.templates
        })
    }

    onClickNPComp = async (flag,data) =>{
        if(flag){
            await this.setState({
                photobookId : data.id,
                isNewPhotobook : false
            })
            console.log(data)
            if(data.templateCategoryId !== undefined)
                this.props.NewPhotobook(data)
            else
                this.onClickSave(null)
        } else{
            this.setState({
                isNewPhotobook : false
            })
        }
    }

    onClickLPComp = (flag) =>{
        if(flag){
            this.props.NewPhotobook()
        } else{
            this.setState({
                isLoadPhotobook : false
            })
        }
    }

    onClickNew = ()=>{
        if(!this.state.isTemplateSelect)
            this.setState({
                isTemplateSelect : true
            })
    }

    onClickLoad = ()=>{
        if(!this.state.isLoadPhotobook)
            this.setState({
                isLoadPhotobook : true
            })
    }

    onClickSave = (data)=>{
        console.log(data,this.state.photobookId)
        if(data === null){
            if(this.state.photobookId === null){
                // first save photobook
                this.setState({
                    isNewPhotobook : true,
                    templateCategoryData : [...this.state.templates]
                })
            } else {
                // template select and save OR first save photobook-> next in
                this.props.GetAllData()
                this.setState({
                    isNewPhotobook : false,
                    isGetAllData : true,
                    isLoading : true
                })
            }
        } else {
            // server save photobook
            this.props.SavePhotobook(this.state.photobookId,data)
            this.setState({
                isLoading : false
            })
        }
    }

    render() {
        let undoStyle = HistoryManager.init().CheckUndo() === true ? "menu-txt right-border click" : "menu-txt right-border"
        let redoStyle = HistoryManager.init().CheckRedo() === true ? "menu-txt right-border click" : "menu-txt right-border"
        let isSlotStyle = this.props.selectedSlot.length > 0 ? "menu-txt right-border click" : "menu-txt right-border"
        return ( <div className="main-page transition-item">
            {(this.state.userId === null || this.state.isLoading) &&
                <div className="modal-container main-loading-square"> 
                    <div className="loading-square">
                        <div className="loading-spin"></div>
                        <div className="loading-txt">잠시만 기다려주세요...</div>
                    </div>
                </div>
            }
            {this.state.isTemplateSelect &&
                <TemplateSelectComp
                    onConfirm={(id)=>this.onClickTSComp(true,id)} 
                    onQuit={()=>this.onClickTSComp(false)}
                />}
            {this.state.isNewPhotobook && 
                <NewPhotobookComp 
                    userId={this.props.userId}
                    templateCategoryData={this.state.templateCategoryData}
                    templateCategoryId={this.state.templateCategoryId}
                    onConfirm={(data)=>this.onClickNPComp(true,data)} 
                    onQuit={()=>this.onClickNPComp(false)}
                />}
            {this.state.isLoadPhotobook &&
                <LoadPhotobookComp
                    userId={this.props.userId}
                    onConfirm={(id)=>this.props.LoadPhotobook(id)}
                    onQuit={()=>this.onClickLPComp(false)}
                />}

            <div className="top-bar">
                <div className="menu-txt right-border click" onClick={this.onClickNew}>
                    <img alt="top_img" src={require('../resources/top_newphotobook.png')}/>새 포토북
                </div>
                <div className="menu-txt right-border click" onClick={this.state.templates[0] !== null ? this.onClickSave.bind(this,null) : null}>
                    <img alt="top_img" src={require('../resources/top_save.png')}/>저장
                </div>
                <div className="menu-txt right-border click" onClick={this.onClickLoad}>
                    <img alt="top_img" src={require('../resources/top_load.png')}/>불러오기
                </div>
                <div className={undoStyle} onClick={HistoryManager.init().CheckUndo() === true ? this.onClickUndo : null}>
                    <img alt="top_img" src={require('../resources/top_undo.png')}/>실행취소
                </div>
                <div className={redoStyle} onClick={HistoryManager.init().CheckRedo() === true ? this.onClickRedo : null}>
                    <img alt="top_img" src={require('../resources/top_redo.png')}/>다시실행
                </div>
                <div className="menu-txt right-border click" onClick={this.onClickTextBox}>
                    <img alt="top_img" src={require('../resources/top_text.png')}/>글상자
                </div>
                <div className={isSlotStyle} onClick={this.props.selectedSlot.length > 0 ? this.showSort : null}>
                    <img alt="top_img" src={require('../resources/top_layer.png')}/>정렬
                    <div className="dropdown-list zindex-2" style={this.state.dropdownSortStyle}>
                        {SORT_LIST.map((item,idx)=>{
                            return(<div onClick={this.onClickSort.bind(this,item.type)} key={idx}>{item.title}</div>)
                        })}
                    </div>
                </div>
                <div className={isSlotStyle} onClick={this.props.selectedSlot.length > 0 ? this.showOrder : null}>
                    <img alt="top_img" src={require('../resources/top_sort.png')}/>순서
                    <div className="dropdown-list zindex-2" style={this.state.dropdownOrderStyle}>
                        {ORDER_LIST.map((item,idx)=>{
                            return(<div onClick={this.onClickOrder.bind(this,item.type)} key={idx}>{item.title}</div>)
                        })}
                    </div>
                </div>
                <div className="menu-txt"></div>
                <div className="menu-txt"></div>
                <div className="menu-txt"></div>
                <div className="menu-txt left-border click" onClick={this.onClickPreview}>
                    <img alt="top_img" src={require('../resources/top_preview.png')}/>미리보기
                </div>
            </div>

            <div className="contents">
                {this.state.isPreview ? <Preview onExit={this.onClickClosePreview} preview={this.props.preview}
                    CreatePhotobook={this.props.CreatePhotobook.bind(this)}/> : <div></div>}
                <Divider 
                    templateIndex = {this.state.templateIndex}
                    state={this.state.dividerState} setType={(type)=>{this.setState({dividerState: type})}}>
                    
                    {this.state.dividerState === 'Template' ? 
                        <Templatezone 
                            setTemplate={(templateId)=>{this.setTemplateId(templateId)}} 
                            templateIndex={this.state.templateIndex}
                        />
                    : this.state.dividerState === 'Photo' ? 
                        <Photozone 
                            photoList={this.state.addPhotoList} 
                            setPhoto={(photo)=>{this.setState({photoList : [...this.state.photoList, photo]})}}
                            addPhoto={(photo)=>{this.setState({addPhotoList : [...this.state.addPhotoList, photo]})}} 
                            isTemplate={this.state.templates[this.state.templateIndex] !== null}
                            frameBox={this.refs.frameBox}
                            />
                    : this.state.dividerState === 'Sticker' ? 
                        <Sticker 
                            count={this.state.sticker_count} 
                            createSticker={(id,idx)=>{this.props.CreateSticker(id,idx)}} 
                            stickerList={this.props.stickerList} 
                            isTemplate={this.state.templates[this.state.templateIndex] !== null}
                            frameBox={this.refs.frameBox}
                            /> 
                    : null }
                </Divider>
                <div className="template-page">
                    <div className="template-frame">
                        <div className="frame-button" onClick={this.onClickTemplateMove.bind(this,'prev')}>
                            <img alt="frame-button" src={require('../resources/blue_left.png')}/>
                        </div>
                        <div className="frame-box" ref="frameBox">
                            {this.state.templates.map((raw,idx)=>{
                                return(<Template 
                                        key={idx} 
                                        GetTemplateInfo={this.props.GetTemplateInfo.bind(this)}
                                        templateIdx={idx}
                                        isVisible={idx === this.state.templateIndex}
                                        photoList={this.state.photoList} 
                                        updatePreview={(template,style)=>{this.updatePreview(template,idx,style)}} 
                                        template={this.state.templates[idx]}
                                    />)
                            })}
                        </div>
                        <div className="frame-button" onClick={this.onClickTemplateMove.bind(this,'next')}>
                            <img alt="frame-button" src={require('../resources/blue_right.png')}/>
                        </div>
                    </div>
                    <div className="paging">
                        <div className="paging-button"><img draggable={false} alt="paging-button" src={require('../resources/bottom_left.png')}/></div>
                        {this.state.isTemplateView ? <div className="template-pages">???</div> : 
                        <div ref="templatePreviews" className="template-pages">
                            {this.state.templates.map((raw,idx)=>{
                                return(<div key={idx} ref={`previewBox${idx}`} className="preview-box" style={{flex: `0 0 ${this.state.previewWidth}px`}}></div>)
                            })}
                        </div>
                        }
                        <div className="paging-button"><img draggable={false} alt="paging-button" src={require('../resources/bottom_right.png')}/></div>
                    </div>
                </div>
                
            </div>
        </div>);
    }
}