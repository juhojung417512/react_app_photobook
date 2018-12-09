import React, { Component } from 'react';
import ReactDOM  from 'react-dom'
import { hot } from 'react-hot-loader'
import { connect } from 'react-redux';

import {html2zip, elem2canvas} from '../common/utils'
import Slot from './slot.comp'
import {HISTORYS, ORDER_LIST_TYPE, SORT_LIST_TYPE, PreviewDivideValue} from '../common/constants'

import { 
    UploadPhotobook,
    ActiveSlot,
    DeactiveSlot,
    DeletePhoto,
    DragPhoto,
    ResizePhoto,
    DeleteSticker,
    DeleteTextBox,
    DragSticker,
    DragTextBox,
    ResizeSticker,
    ResizeTextBox,
    CreateHistory,
    SetPreview,
    CreatePhoto,
    CreateSticker,
    CreateTextBox,
    SortSlot,
    ChangeColorTextBox,
    DragForceSlot,
    DragStartSlot,
    ResizeForceSlot,
    ResizeStartSlot
} from "../common/actions"

let mapStateToProps = (state)=>{
    return {
        templateList : state.photobook.templateList,
        stickerList : state.photobook.stickerList,
        isPreview : state.photobook.isPreview,
        isCreate  :state.photobook.isCreate,
        photoData : state.photobook.photoData,
        stickerId : state.photobook.stickerId,
        undo : state.photobook.undo,
        redo : state.photobook.redo,
        pivot : state.photobook.pivot,
        selectedSlot : state.photobook.selectedSlot,
        selectedType : state.photobook.selectedType,
        sortStyle : state.photobook.sortStyle,
        photos : state.photobook.photos,
        photosForceDragPos : state.photobook.photosForceDragPos,
        photosResize : state.photobook.photosResize,
        photosOrder : state.photobook.photosOrder,
        stickers : state.photobook.stickers,
        stickersForceDragPos : state.photobook.stickersForceDragPos,
        stickersResize : state.photobook.stickersResize,
        stickersOrder : state.photobook.stickersOrder,
        textboxes : state.photobook.textboxes,
        textColor : state.photobook.textColor,
        textboxesForceDragPos : state.photobook.textboxesForceDragPos,
        textboxesResize : state.photobook.textboxesResize,
        textboxesOrder : state.photobook.textboxesOrder
	}
}

let mapDispatchToProps = (dispatch) => {
    return {
        UploadPhotobook : (zip)=>dispatch(UploadPhotobook(zip)),
        ActiveSlot : (type,idx)=>dispatch(ActiveSlot(type,idx)),
        DeactiveSlot : (type,idx)=>dispatch(DeactiveSlot(type,idx)),
        DeletePhoto : (idx, hFlag)=>dispatch(DeletePhoto(idx, hFlag)),
        DeleteSticker : (idx,hFlag)=>dispatch(DeleteSticker(idx,hFlag)),
        DeleteTextBox : (txt,color,idx,hFlag)=>dispatch(DeleteTextBox(txt,color,idx,hFlag)),
        DragPhoto : (idx,prev,next)=>dispatch(DragPhoto(idx,prev,next)),
        DragSticker : (idx,prev,next)=>dispatch(DragSticker(idx,prev,next)),
        DragTextBox : (idx,prev,next)=>dispatch(DragTextBox(idx,prev,next)),
        ResizePhoto : (idx,prev,next)=>dispatch(ResizePhoto(idx,prev,next)),
        ResizeSticker : (idx,prev,next)=>dispatch(ResizeSticker(idx,prev,next)),
        ResizeTextBox : (idx,prev,next)=>dispatch(ResizeTextBox(idx,prev,next)),
        CreateHistory : (type, id, idx)=>dispatch(CreateHistory(type,id,idx)),
        SetPreview : (preview,idx)=>dispatch(SetPreview(preview,idx)),
        CreatePhoto : (src,size,idx)=>dispatch(CreatePhoto(src,size,idx)),
        CreateSticker : (id,idx) => dispatch(CreateSticker(id,idx)),
        CreateTextBox : (data) => dispatch(CreateTextBox(data)),
        SortSlot : (type,x,y) => dispatch(SortSlot(type,x,y)) ,
        ChangeColorTextBox : (idx,color) => dispatch(ChangeColorTextBox(idx,color)),
        DragForceSlot : (type,idx,pos) => dispatch(DragForceSlot(type,idx,pos)),
        DragStartSlot : (type,idx) => dispatch(DragStartSlot(type,idx)),
        ResizeForceSlot : (type,idx,size) => dispatch(ResizeForceSlot(type,idx,size)),
        ResizeStartSlot : (type,idx) => dispatch(ResizeStartSlot(type,idx))
    }
}
@hot(module)
@connect(mapStateToProps, mapDispatchToProps)
export default class extends Component {
    constructor() {
        super();
        this.state = {
            isCreate : false,
            isPreview : false,
            photos : [],
            stickers: [],
            textboxes : [],
            textColor : [],
            undo : null,
            redo : null,
            pivot : 0,
            photosForceDragPos : [],
            stickersForceDragPos : [],
            textboxesForceDragPos : [],
            stickersResize : [],
            photosResize : [],
            textboxesResize : [],
            photosOrder : [],
            stickersOrder : [],
            textboxesOrder : [],
            maxOrder : 2, // array 순서 때문에 있는 버그 있음
            sortStyle : null,
            frameStyle : null,
            previewTime : true
        }
        this.board_count = 100
    }

    componentDidMount(){
    }

    componentWillReceiveProps(nProps) {
        let stateStore = {}
        //Create & Delete
        if(this.props.photos !== nProps.photos && nProps.photos !== undefined){
            stateStore.photos = nProps.photos
            stateStore.photosForceDragPos = nProps.photosForceDragPos
            stateStore.photosResize = nProps.photosResize
            stateStore.photosOrder = nProps.photosOrder
        }
        else if(this.props.stickers !== nProps.stickers && nProps.stickers !== undefined){
            stateStore.stickers = nProps.stickers
            stateStore.stickersForceDragPos = nProps.stickersForceDragPos
            stateStore.stickersResize = nProps.stickersResize
            stateStore.stickersOrder = nProps.stickersOrde
        }
        else if(this.props.textboxes !== nProps.textboxes && nProps.textboxes !== undefined){
            stateStore.textboxes = nProps.textboxes
            stateStore.textColor = nProps.textColor
            stateStore.textboxesForceDragPos = nProps.textboxesForceDragPos
            stateStore.textboxesResize = nProps.textboxesResize
            stateStore.textboxesOrder = nProps.textboxesOrde
        }
        
        if(this.props.textColor !== nProps.textColor && nProps.textColor !== undefined){
            stateStore.textColor = nProps.textColor
        }
        //order
        if(this.props.photosOrder !== nProps.photosOrder){
            stateStore.photosOrder = nProps.photosOrder
            stateStore.maxOrder = nProps.maxOrder < this.state.maxOrder ? this.state.maxOrder : nProps.maxOrder
        }
        else if(this.props.stickersOrder !== nProps.stickersOrder){
            stateStore.stickersOrder = nProps.stickersOrder
            stateStore.maxOrder = nProps.maxOrder < this.state.maxOrder ? this.state.maxOrder : nProps.maxOrder
        }
        else if(this.props.textboxesOrder !== nProps.textboxesOrder){
            stateStore.textboxesOrder = nProps.textboxesOrder
            stateStore.maxOrder = nProps.maxOrder < this.state.maxOrder ? this.state.maxOrder : nProps.maxOrder
        }
        //force drag 
        if(this.props.photosForceDragPos !== nProps.photosForceDragPos && this.state.photosForceDragPos !== nProps.photosForceDragPos){
            stateStore.photosForceDragPos = nProps.photosForceDragPos
            stateStore.textboxesForceDragPos = nProps.textboxesForceDragPos
        }
        else if(this.props.stickersForceDragPos !== nProps.stickersForceDragPos && this.state.stickersForceDragPos !== nProps.stickersForceDragPos){
            stateStore.stickersForceDragPos = nProps.stickersForceDragPos
        }
        else if(this.props.textboxesForceDragPos !== nProps.textboxesForceDragPos && this.state.textboxesForceDragPos !== nProps.textboxesForceDragPos){
            stateStore.textboxesForceDragPos = nProps.textboxesForceDragPos
        }
        // resize
        if(this.props.photosResize !== nProps.photosResize && this.state.photosResize !== nProps.photosResize){
            stateStore.photosResize = nProps.photosResize
            stateStore.textboxesForceDragPos = nProps.textboxesForceDragPos
        }
        else if(this.props.stickersResize !== nProps.stickersResize && this.state.stickersResize !== nProps.stickersResize){
            stateStore.stickersResize = nProps.stickersResize
        }
        else if(this.props.textboxesResize !== nProps.textboxesResize && this.state.textboxesResize !== nProps.textboxesResize){
            stateStore.textboxesResize = nProps.textboxesResize
        }

        if(Object.keys(stateStore).length !== 0)
            this.setState({
                ...this.state,
                ...stateStore
            })
        
        if(nProps.isCreate !== this.state.isCreate){
            nProps.UploadPhotobook(this.CreatePhotobook())
            this.setState({
                isCreate : nProps.isCreate
            })
        }
        else if(nProps.isPreview !== this.state.isPreview){
            this.setState({
                isPreview : nProps.isPreview
            })
            if(!nProps.isPreview)
                return
            setTimeout(()=>{
                let res = this.CreatePreview()
                if(res === undefined)
                    return
                nProps.SetPreview(res,this.props.templateIdx)
            },50)
        }
        else if(this.props.isVisible === false){
            return
        }
        
        else if(nProps.sortStyle !== this.state.sortStyle && this.refs.templateImg !== undefined){
            this.setState({
                sortStyle : nProps.sortStyle
            })
            if(nProps.sortStyle === null)
                return
            let x = null
            let y = null
            switch(nProps.sortStyle){
                case SORT_LIST_TYPE.L : 
                    x = 0
                    break
                case SORT_LIST_TYPE.R : 
                    x = this.refs.templateImg.clientWidth
                    break
                case SORT_LIST_TYPE.C_X : 
                    x = this.refs.templateImg.clientWidth / 2
                    break
                case SORT_LIST_TYPE.T : 
                    y = 0
                    break
                case SORT_LIST_TYPE.B : 
                    y = this.refs.templateImg.clientHeight
                    break
                case SORT_LIST_TYPE.C_Y : 
                    y = this.refs.templateImg.clientHeight / 2
                    break
                default :
                    break
            }
            this.props.SortSlot(nProps.sortStyle, x, y)
        }

        else if(nProps.undo !== this.state.undo || this.state.pivot-1 === nProps.pivot){
            this.setState({
                ...this.state,
                undo : nProps.undo,
                pivot : nProps.pivot
            })
            let data = nProps.undo[Object.keys(nProps.undo)[0]]
            switch(Object.keys(nProps.undo)[0]){
                case HISTORYS.C_P:
                    this.DeletePhoto(data['idx'],false)
                    break
                case HISTORYS.C_S : 
                    this.DeleteSticker(data['idx'],false)
                    break
                case HISTORYS.C_T : 
                    this.DeleteTextbox(false,data['idx'])
                    break
                case HISTORYS.D_P:
                    this.props.CreatePhoto(null,null,data['idx'])
                    break
                case HISTORYS.D_S:
                    this.props.CreateSticker(data['id'],data['idx'])
                    break
                case HISTORYS.D_T:
                    this.props.CreateTextBox(data)
                    break
                case HISTORYS.DRAG_P:
                case HISTORYS.DRAG_S : 
                case HISTORYS.DRAG_T:
                    this.props.DragForceSlot(Object.keys(nProps.undo)[0],data['idx'],data['prev'])
                    break
                case HISTORYS.R_P:
                case HISTORYS.R_S : 
                case HISTORYS.R_T :
                    this.ResizeForceSlot(Object.keys(nProps.undo)[0],data['idx'],data['prev'])
                    break
                default:
                    break
            }
        }
        else if(nProps.redo !== this.state.redo || this.state.pivot+1 === nProps.pivot){
            this.setState({
                ...this.state,
                redo : nProps.redo,
                pivot : nProps.pivot
            })
            let data = nProps.redo[Object.keys(nProps.redo)[0]]
            switch(Object.keys(nProps.redo)[0]){
                case HISTORYS.C_P:
                    this.props.CreatePhoto(null,null,data['idx'])
                    break
                case HISTORYS.C_S :
                    this.props.CreateSticker(data['id'],data['idx'])
                    break
                case HISTORYS.C_T : 
                    this.props.CreateTextBox(data)
                    break
                case HISTORYS.D_P:
                    this.DeletePhoto(data['idx'],false)
                    break
                case HISTORYS.D_S :
                    this.DeleteSticker(data['idx'],false)
                    break
                case HISTORYS.D_T:
                    this.DeleteTextbox(false,data['idx'])
                    break
                case HISTORYS.DRAG_P:
                case HISTORYS.DRAG_S:
                case HISTORYS.DRAG_T:
                    this.props.DragForceSlot(Object.keys(nProps.redo)[0],data['idx'],data['next'])
                    break
                case HISTORYS.R_P :
                case HISTORYS.R_S : 
                case HISTORYS.R_T :
                    this.ResizeForceSlot(Object.keys(nProps.redo)[0],data['idx'],data['next'])
                    break
                default:
                    break
            }
        }
    }

    componentDidUpdate = (props, state)=>{
        if(this.state.previewTime === true && eval("this.refs.template"+ this.props.templateIdx) !== undefined){
            this.setState({
                previewTime : false
            })
            let t = eval("this.refs.template"+ this.props.templateIdx)
            this.props.updatePreview(eval("this.refs.template"+ this.props.templateIdx),`translate(0, -${this.refs.templateImg.clientHeight / 2 * PreviewDivideValue}px)`)
            setTimeout(()=>{
                this.setState({
                    previewTime : true
                })
            },500)
        }
    }

    CreatePreview = ()=>{
        if(eval("this.refs.template"+ this.props.templateIdx) !== undefined){
            let preview = eval("this.refs.template"+ this.props.templateIdx+ ".cloneNode(true)")
            preview.style = 'display : flex;'
            preview.classList.add('preview-frame')
            preview.children[0].style.transform = ''
            preview.children[1].style.width = `${this.refs.templateImg.clientWidth}px`
            preview.children[1].style.height = `${this.refs.templateImg.clientHeight}px`
            return preview
        } else {
            return undefined
        }
    }

    CreatePhotobook = async () =>{
        let contents = eval("this.refs.template"+ this.props.templateIdx)
        if(contents === undefined)
            return
        return await html2zip(contents,this.props)
    }

    DeletePhoto = (idx , flag)=>{
        this.props.DeletePhoto(idx, flag)
    }

    DeleteSticker = (sticker_id,idx) =>{
        this.props.DeleteSticker(sticker_id,idx)
    }

    DeleteTextbox = (hFlag,idx) =>{
        this.props.DeleteTextBox(this.refs['textbox'+idx].textContent,this.state.textColor[idx],idx,hFlag)
    }

    ChangeTextColor = (idx,color) =>{
        this.props.ChangeColorTextBox(idx,color)
    }

    onDragStart = (type,idx)=>{
        if(type === HISTORYS.DRAG_P && this.state.photosForceDragPos[idx] === null){
            return
        }
        switch(type){
            case HISTORYS.DRAG_P:
                if(this.state.photosForceDragPos[idx] === null)
                    return
                this.state.photosForceDragPos[idx] = null
                this.setState({
                    photosForceDragPos : this.state.photosForceDragPos
                })
                break
            case HISTORYS.DRAG_S: 
                if(this.state.stickersForceDragPos[idx] === null)
                    return
                this.state.stickersForceDragPos[idx] = null
                this.setState({
                    stickersForceDragPos : this.state.stickersForceDragPos
                })
                break
            case HISTORYS.DRAG_T : 
                if(this.state.textboxesForceDragPos[idx] === null)
                    return
                this.state.textboxesForceDragPos[idx] = null
                this.setState({
                    textboxesForceDragPos : this.state.textboxesForceDragPos
                })
                break
            default : 
                break
        }
        if(this.state.frameStyle !== null)
            this.setState({
                frameStyle : null
            })

    }

    onDragStop = (type,idx,prev,next)=>{
        switch(type){
            case HISTORYS.DRAG_P:
                this.props.DragPhoto(idx,prev,next)
                break
            case HISTORYS.DRAG_S: 
                this.props.DragSticker(idx,prev,next)
                break
            case HISTORYS.DRAG_T : 
                this.props.DragTextBox(idx,prev,next)
                break
            default : 
                break
        }
    }

    ResizeForceSlot = (type,idx,size)=>{
        this.props.ResizeForceSlot(type,idx,size)
    }

    onResizeStart = (type,idx)=>{
        this.setState({
            frameStyle : null
        })
        this.props.ResizeStartSlot(type,idx)
    }

    onResizeStop = (type,idx,prev,next) =>{
        switch(type){
            case HISTORYS.R_P:
                this.props.ResizePhoto(idx,prev,next)
                break
            case HISTORYS.R_S: 
                this.props.ResizeSticker(idx,prev,next)
                break
            case HISTORYS.R_T : 
                this.props.ResizeTextBox(idx,prev,next)
                break
            default : 
                break
        }
    }

    render() {
        let slotBorderFlag = this.props.isCreate || this.props.isPreview
        if(this.props.template !== null)
            return (
                <div className="frame" ref={`template${this.props.templateIdx}`} style={{
                        border: this.props.template.style_border,
                        justifyContent : this.state.frameStyle !== null ? this.state.frameStyle.justifyContent : 'center',
                        alignItems: this.state.frameStyle !== null ? this.state.frameStyle.alignItems : 'center',
                        display: this.props.isVisible === false && this.props.isPreview === false ? 'none' : 'flex'
                    }}>
                    <div className="slots" style={this.refs.templateImg !== undefined ? {transform : `translate(0, -${this.refs.templateImg.clientHeight / 2}px)`} : null}>
                        {this.state.photos.map((item,idx)=>{
                            if(item.display === false)
                                return
                            return(
                                <Slot 
                                    key={idx} 
                                    DeleteSlot={()=>{this.DeletePhoto(idx,true)}}
                                    dragForcePos={this.state.photosForceDragPos[idx]} 
                                    onDragStart={()=>{this.onDragStart(HISTORYS.DRAG_P,idx)}}
                                    onForceDrag={(pos)=>{this.props.DragForceSlot(HISTORYS.DRAG_P,idx,pos)}}
                                    onDragStop={(prev,next)=>{this.onDragStop(HISTORYS.DRAG_P,idx,prev,next)}}
                                    onForceResize={(size)=>{this.ResizeForceSlot(HISTORYS.R_P,idx,size)}}
                                    resizeForceSize={this.state.photosResize[idx]} 
                                    onResizeStart={()=>{this.onResizeStart(HISTORYS.R_P,idx)}} 
                                    onResizeStop={(prev,next)=>{this.onResizeStop(HISTORYS.R_P,idx,prev,next)}}
                                    onClickActive={()=>{this.props.ActiveSlot('Photo',idx)}} 
                                    onClickDeactive={()=>{this.props.DeactiveSlot('Photo',idx)}}
                                    isSort={this.state.frameStyle !== null && this.props.selectedSlot.indexOf(idx) !== -1 && this.props.selectedType.indexOf('Photo') !== -1}
                                    orderIndex={this.state.photosOrder[idx]} 
                                    isCanvas={this.props.isCreate || this.state.isPreview ? true : false}
                                    isVisible={this.props.isVisible} 
                                    isPreview={this.props.isPreview} type='Photo'
                                    >

                                    <img style={slotBorderFlag || this.props.selectedSlot.indexOf(idx) === -1 ? {} : {border: "1px dashed black"}} 
                                        draggable={false} alt="photo_img" src={item.src}/>
                                </Slot>)
                        })}
                        {this.state.stickers.map((item,idx)=>{
                            if(item.display === false)
                                return 
                            return (
                                <Slot 
                                    key={idx} 
                                    type='Sticker'
                                    DeleteSlot={()=>{this.DeleteSticker(item.id,idx)}}
                                    dragForcePos={this.state.stickersForceDragPos[idx]} 
                                    onDragStart={()=>{this.onDragStart(HISTORYS.DRAG_S,idx)}}
                                    onForceDrag={(pos)=>{this.props.DragForceSlot(HISTORYS.DRAG_S,idx,pos)}}
                                    onDragStop={(prev,next)=>{this.onDragStop(HISTORYS.DRAG_S,idx,prev,next)}}
                                    onForceResize={(size)=>{this.ResizeForceSlot(HISTORYS.R_S,idx,size)}}
                                    resizeForceSize={this.state.stickersResize[idx]} 
                                    onResizeStart={()=>{this.onResizeStart(HISTORYS.R_S,idx)}} 
                                    onResizeStop={(prev,next)=>{this.onResizeStop(HISTORYS.R_S,idx,prev,next)}}
                                    onClickActive={()=>{this.props.ActiveSlot('Sticker',idx)}} 
                                    onClickDeactive={()=>{this.props.DeactiveSlot('Sticker', idx)}}
                                    isSort={this.state.frameStyle !== null && this.props.selectedSlot.indexOf(idx) !== -1 && this.props.selectedType.indexOf('Sticker') !== -1}
                                    orderIndex={this.state.stickersOrder[idx]} 
                                    isCanvas={this.props.isCreate || this.state.isPreview ? true : false}
                                    isVisible={this.props.isVisible} 
                                    isPreview={this.props.isPreview}
                                    >
                                    
                                    <img style={slotBorderFlag || this.props.selectedSlot.indexOf(idx) === -1 ? {} : {border: "1px dashed black"}} 
                                        draggable={false} alt="sticker" src={item.src}/>
                                </Slot>)
                        })}
                        {this.state.textboxes.map((item,idx)=>{
                            if(item.display === false)
                                return
                            return (
                                <Slot 
                                    key={idx} 
                                    type='Textbox'
                                    defaultWidth={100} 
                                    defaultHeight={100} 
                                    isTextBox={true} 
                                    ChangeTextColor={(color)=>{this.ChangeTextColor(idx,color)}}
                                    DeleteSlot={()=>{this.DeleteTextbox(true,idx)}} 
                                    dragForcePos={this.state.textboxesForceDragPos[idx]} 
                                    onDragStart={()=>{this.onDragStart(HISTORYS.DRAG_T,idx)}}
                                    onForceDrag={(pos)=>{this.props.DragForceSlot(HISTORYS.DRAG_T,idx,pos)}}
                                    onDragStop={(prev,next)=>{this.onDragStop(HISTORYS.DRAG_T,idx,prev,next)}}
                                    onForceResize={(size)=>{this.ResizeForceSlot(HISTORYS.R_T,idx,size)}}
                                    resizeForceSize={this.state.textboxesResize[idx]} 
                                    onResizeStart={()=>{this.onResizeStart(HISTORYS.R_T,idx)}} 
                                    onResizeStop={(prev,next)=>{this.onResizeStop(HISTORYS.R_T,idx,prev,next)}}
                                    onClickActive={()=>{this.props.ActiveSlot('Textbox', idx)}} 
                                    onClickDeactive={()=>{this.props.DeactiveSlot('Textbox', idx)}}
                                    isSort={this.state.frameStyle !== null && this.props.selectedSlot.indexOf(idx) !== -1 && this.props.selectedType.indexOf('Textbox') !== -1}
                                    orderIndex={this.state.textboxesOrder[idx]} 
                                    isCanvas={this.props.isCreate || this.state.isPreview ? true : false}
                                    isVisible={this.props.isVisible} 
                                    isPreview={this.props.isPreview} 
                                    >

                                    <div className="text-box" style={slotBorderFlag || this.props.selectedSlot.indexOf(idx) === -1 ? {} : {border: "1px dashed black",color: this.state.textColor[idx]}}
                                        contentEditable={this.state.isPreview ? false : true} suppressContentEditableWarning="true" ref={'textbox'+idx}>
                                    {item.text === null ? "" : item.text}
                                    </div>
                                </Slot>)
                        })}
                    </div>
                    <img draggable={false} ref="templateImg" className="frame-img zindex-0" alt="frame" src={this.props.template.frame}/>
                    {this.props.children}
                </div>
            );
        else 
            return(
                <div className="frame" ref="template" style={{display: this.props.isVisible === false && this.props.isPreview === false ? 'none' : 'flex'}}>
                </div>
            );
    }
}