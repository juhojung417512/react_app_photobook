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
import { PHOTOBOOK_LIST ,SORT_LIST, ORDER_LIST} from '../common/constants'
import {HistoryManager, elem2canvas} from '../common/utils'
import Preview from './preview.comp'

import {
    SetTemaplteIdx,
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
    CallPreview
} from "../common/actions"
import { timingSafeEqual } from 'crypto';

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
        photoList : state.photobook.photoList
    }
}

let mapDispatchToProps = (dispatch) => {
    return {
        SetTemaplteIdx : (idx) => dispatch(SetTemaplteIdx(idx)),
        GetLoginData: () => dispatch(GetLoginData()),
        CreatePhotobook : ()=> dispatch(CreatePhotobook()),
        SortSlot : (type) => dispatch(SortSlot(type)),
        OrderSlot : (type) => dispatch(OrderSlot(type)),
        GetPhotos : ()=>dispatch(GetPhotos()),
        CreateSticker : (idx)=> dispatch(CreateSticker(idx)),
        GetStickers : ()=> dispatch(GetStickers()),
        UndoHistory : ()=>dispatch(UndoHistory()),
        RedoHistory : ()=>dispatch(RedoHistory()),
        CreateTextBox : ()=>dispatch(CreateTextBox()),
        CallPreview : ()=>dispatch(CallPreview())
    }
}
/* 2018-10-17 wed photobook manage delete.
<div className="menu-dropdown right-border click" onClick={this.showMenu}>
    포토북 관리
    <div className="dropdown-list zindex-2" style={this.state.dropdownMenuStyle}>
        {PHOTOBOOK_LIST.map((item,idx)=>{
            return(<div onClick={this.onClickDropdownItem.bind(this,item.type)} key={idx}>{item.title}</div>)
        })}
    </div>
</div>
*/

@hot(module)
@connect(mapStateToProps, mapDispatchToProps)
export default class extends Component {
    constructor() {
        super();
        this.state = {
            showMenu : false,
            dropdownMenuStyle : {display:"none"},
            dropdownSortStyle : {display:"none"},
            dropdownOrderStyle : {display:"none"},
            popupStyle : {display:"none"},
            photoList : [],
            addPhotoList : [],
            templateIds : [],
            nowTemplateId : null,
            sticker_count : null,
            dividerState : 'Template',
            templates : [],
            templateIndex : 0,
            isPreview : false,
            previewCanvas : [],
        };
    }

    componentDidMount() {
        if (!window.getCookie('isLogin'))
            history.replace('/')
        this.setState({
            templates : [true,true],
            templateIds : [null,null],
        })

        this.props.SetTemaplteIdx(0)
        this.props.GetStickers() // sticker api need
        this.props.GetPhotos()
    }

    componentWillReceiveProps(nProps){
        if(this.props.photoList !== nProps.photoList || this.state.addPhotoList.length < nProps.photoList.length){
            console.log(this.state.addPhotoList)
            this.setState({
                addPhotoList : [...nProps.photoList, ...this.state.addPhotoList]
            })
        } else if(this.state.sticker_count !== nProps.stickerList.length + 1){
            this.setState({
                sticker_count : nProps.stickerList.length + 1
            })
        }
    }

    showMenu = (e)=> {
        e.preventDefault();

        this.setState({ showMenu: true, dropdownMenuStyle : {display:"block"}}, () => {
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

        this.setState({ showOrder: true, dropdownOrderStyle : {display:"block"}}, () => {
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

        this.setState({ showSort: true, dropdownSortStyle : {display:"block"}}, () => {
            document.addEventListener('click', this.closeSort);
        });
    }

    closeSort = (e)=>{
        if (this.state.showSort)
            this.setState({ showSort : false, dropdownSortStyle : {display:"none"}}, () => {
                document.removeEventListener('click', this.closeSort);
            });
    }

    onClickDropdownItem = (type)=>{
        //popup display on
        switch(type){
            case "send" :
                this.props.CreatePhotobook()
                break
            case "delete":
            case "rename":
            case "move":
            default : 
                break
        }
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

    changeTemplate = (idx)=>{
        this.props.SetTemaplteIdx(idx)
        this.props.GetStickers() // sticker api need
        this.props.GetPhotos()
        if(idx >= this.state.templates.length){
            this.setState({
                ...this.state,
                templates : [...this.state.templates,true],
                templateIds : [...this.state.templateIds,null]
            })    
        }

        this.setState({
            ...this.state,
            templateIndex : idx,
            nowTemplateId : this.state.templateIds[idx],
            dividerState  : 'Template',
            previewCanvas : this.state.previewCanvas
        })
    }

    onClickTemplateMove = (type) =>{
        let idx = this.state.templateIndex
        if(type === 'prev' && idx - 1 >= 0){
            this.changeTemplate(idx - 1)
        }
        else if(type === 'next'){
            this.changeTemplate(idx + 1)
        }
    }

    setTemplateId = (id)=>{
        this.state.templateIds[this.state.templateIndex] = id
        this.setState({
            templateIds : this.state.templateIds,
            nowTemplateId : id
        })
    }

    newTemplate = ()=>{
        this.setState({
            templateIndex : this.state.templateIndex + 1,
            nowTemplateId : null,
            dividerState  : null
        })
    }

    onClickPreview = ()=>{
        this.setState({
            isPreview : true
        })
    }

    onClickClosePreview = ()=>{
        this.setState({
            isPreview : false
        })
    }

    updatePreview = (template,idx) =>{
        if(template === undefined || this.refs.previewBox0 === undefined || this.state.templateIndex !== idx)
            return

        let clone = template.cloneNode(true)
        
        let child = eval('this.refs.previewBox'+idx+'.appendChild(clone)')
        if(this.state.previewCanvas[idx] !== undefined){
            eval('this.refs.previewBox'+idx+'.removeChild(this.refs.previewBox'+idx+'.children[0])')
            child.classList.add('preview-frame')
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
        
    }
    //     elem2canvas(template).then((canvas)=>{
    //         if(this.state.previewCanvas[idx] !== undefined){
    //             let img = new Image();
    //             let ctx = this.state.previewCanvas[idx]
    //             img.src = canvas.toDataURL()
    //             img.onload = ()=>{
    //                 ctx.getContext('2d').drawImage(img,ctx.width / 2 - img.width / 2, ctx.height / 2 - img.height / 2)
    //                 this.state.previewCanvas[idx] = ctx
    //                 this.setState({
    //                     previewCanvas : this.state.previewCanvas
    //                 })
    //             }
    //         } else{
    //             let child = this.refs.templatePreviews.appendChild(canvas)
    //             child.addEventListener('click',()=>{
    //                 this.onClickCanvas(idx)
    //             })
    //             this.setState({
    //                 previewCanvas : [...this.state.previewCanvas, child]
    //             })
    //         }
    //     })
    // }

    onClickCanvas = (idx) =>{
        if(this.state.templateIndex !== idx)
            this.changeTemplate(idx)
    }

    render() {
        // template is not open
        let undoStyle = HistoryManager.init().CheckUndo() === true ? "menu-txt right-border click" : "menu-txt right-border"
        let redoStyle = HistoryManager.init().CheckRedo() === true ? "menu-txt right-border click" : "menu-txt right-border"
        let isSlotStyle = this.props.selectedSlot.length > 0 ? "menu-txt right-border click" : "menu-txt right-border"

        return ( <div className="main-page transition-item">
            <div className="top-bar">
                <div className="menu-txt right-border click">
                    <img alt="top_img" src={require('../resources/top_newphotobook.png')}/>새 포토북
                </div>
                <div className="menu-txt right-border click">
                    <img alt="top_img" src={require('../resources/top_save.png')}/>저장
                </div>
                <div className="menu-txt right-border click">
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
                    <img alt="top_img" src={require('../resources/top_layer.png')}/>사진정렬
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
                {this.state.isPreview ? <Preview onExit={this.onClickClosePreview} preview={this.state.previewCanvas} /> : <div></div>}
                <Divider 
                    templateIndex = {this.state.templateIndex}
                    state={this.state.dividerState} setType={(type)=>{this.setState({dividerState: type})}}>
                    
                    {this.state.dividerState === 'Template' ? <Templatezone setTemplate={(templateId)=>{this.setTemplateId(templateId)}} templateIndex={this.state.templateIndex}/>
                    : this.state.dividerState === 'Photo' ? <Photozone photoList={this.state.addPhotoList} setPhoto={(photo)=>{this.setState({photoList : [...this.state.photoList, photo]})}}
                    addPhoto={(photo)=>{this.setState({addPhotoList : [...this.state.addPhotoList, photo]})}}/> 
                    : this.state.dividerState === 'Sticker' ? <Sticker count={this.state.sticker_count} createSticker={(idx)=>{this.props.CreateSticker(idx)}} 
                    stickerList={this.props.stickerList}/> 
                    : null }
                </Divider>
                <div className="template-page">
                    <div className="template-frame" ref="templateFrame" >
                        <div className="frame-button" onClick={this.onClickTemplateMove.bind(this,'prev')}><img alt="frame-button" src={require('../resources/blue_left.png')}/></div>
                        {this.state.templates.map((raw,idx)=>{
                            return(<Template key={idx} templateIdx={idx} templateId={this.state.nowTemplateId} isVisible={idx === this.state.templateIndex} 
                                    photoList={this.state.photoList} updatePreview={(template)=>{this.updatePreview(template,idx)}}/>)
                        })}
                        <div className="frame-button" onClick={this.onClickTemplateMove.bind(this,'next')}><img alt="frame-button" src={require('../resources/blue_right.png')}/></div>
                    </div>
                    <div className="paging">
                            <div className="paging-button"><img draggable={false} alt="paging-button" src={require('../resources/bottom_left.png')}/></div>
                            <div ref="templatePreviews" className="template-pages">
                                {this.state.templates.map((raw,idx)=>{
                                    return(<div key={idx} ref={`previewBox${idx}`} className="preview-box"></div>)
                                })}
                            </div>
                            <div className="paging-button"><img draggable={false} alt="paging-button" src={require('../resources/bottom_right.png')}/></div>
                    </div>
                </div>
                
            </div>
        </div>);
    }
}