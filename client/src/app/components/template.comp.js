import React, { Component } from 'react';
import ReactDOM  from 'react-dom'
import { hot } from 'react-hot-loader'
import { connect } from 'react-redux';

import {html2zip} from '../common/utils'
import Slot from './slot.comp'
import {HISTORYS, ORDER_LIST_TYPE, SORT_LIST_TYPE} from '../common/constants'

import { 
    GetTemplateInfo,
    ResetTemplateInfo,
    UploadPhotobook,
    ActiveSlot,
    DeactiveSlot,
    DeletePhoto,
    ResetPhotoState,
    DragPhoto,
    ResizePhoto,
    ResetStickerState,
    ResetTextBoxState,
    DeleteSticker,
    DeleteTextBox,
    DragSticker,
    DragTextBox,
    ResizeSticker,
    ResizeTextBox,
    CreateHistory
} from "../common/actions"

let mapStateToProps = (state)=>{
    return {
        templateList : state.photobook.templateList,
        template : state.photobook.template,
        isCreate  :state.photobook.isCreate,
        isPhoto : state.photobook.isPhoto,
        photoSrc : state.photobook.photoSrc,
        isSticker : state.photobook.isSticker,
        stickerId : state.photobook.stickerId,
        isTextBox : state.photobook.isTextBox,
        undo : state.photobook.undo,
        redo : state.photobook.redo,
        pivot : state.photobook.pivot,
        selectedSlot : state.photobook.selectedSlot,
        selectedType : state.photobook.selectedType,
        sortStyle : state.photobook.sortStyle,
        orderStyle : state.photobook.orderStyle
	}
}

let mapDispatchToProps = (dispatch) => {
    return {
        GetTemplateInfo:(id)=>dispatch(GetTemplateInfo(id)),
        ResetTemplateInfo : ()=>dispatch(ResetTemplateInfo()),
        UploadPhotobook : (zip)=>dispatch(UploadPhotobook(zip)),
        ActiveSlot : (type,idx)=>dispatch(ActiveSlot(type,idx)),
        DeactiveSlot : (type,idx)=>dispatch(DeactiveSlot(type,idx)),
        ResetPhotoState : ()=>dispatch(ResetPhotoState()),
        ResetStickerState : ()=>dispatch(ResetStickerState()),
        ResetTextBoxState : ()=>dispatch(ResetTextBoxState()),
        DeletePhoto : (src,idx)=>dispatch(DeletePhoto(src,idx)),
        DeleteSticker : (id,idx)=>dispatch(DeleteSticker(id,idx)),
        DeleteTextBox : (txt,color,idx)=>dispatch(DeleteTextBox(txt,color,idx)),
        DragPhoto : (idx,prev,next)=>dispatch(DragPhoto(idx,prev,next)),
        DragSticker : (idx,prev,next)=>dispatch(DragSticker(idx,prev,next)),
        DragTextBox : (idx,prev,next)=>dispatch(DragTextBox(idx,prev,next)),
        ResizePhoto : (idx,prev,next)=>dispatch(ResizePhoto(idx,prev,next)),
        ResizeSticker : (idx,prev,next)=>dispatch(ResizeSticker(idx,prev,next)),
        ResizeTextBox : (idx,prev,next)=>dispatch(ResizeTextBox(idx,prev,next)),
        CreateHistory : (type, id, idx)=>dispatch(CreateHistory(type,id,idx))
    }
}
@hot(module)
@connect(mapStateToProps, mapDispatchToProps)
export default class extends Component {
    constructor() {
        super();
        this.state = {
            templateId : null,
            isCreate : false,
            isSticker : false,
            isTextBox : false,
            isPhoto : false,
            photos : [],
            stickers: [],
            textboxes : [],
            textColor : [],
            undo : null,
            redo : null,
            pivot : 0,
            photosDragPos : [],
            stickersDragPos : [],
            textboxesDragPos : [],
            stickersResize : [],
            photosResize : [],
            textboxesResize : [],
            orderStyle : null,
            sortStyle : null,
            frameStyle : null
        }
        this.board_count = 100
    }
    componentWillReceiveProps(nProps) {
        if(nProps.templateId !== this.state.templateId){
            nProps.templateId === null ? this.props.ResetTemplateInfo() : this.props.GetTemplateInfo(nProps.templateId)
            this.setState({
                templateId : nProps.templateId
            })
        }
        if(nProps.isCreate !== this.state.isCreate){
            nProps.UploadPhotobook(this.CreatePhotobook())
            this.setState({
                isCreate : nProps.isCreate
            })
        }
        if(nProps.isPhoto !== this.state.isPhoto) {
            if(nProps.isPhoto)
                this.CreatePhoto(nProps.photoSrc,null)
            nProps.ResetPhotoState()
            this.setState({
                isPhoto : nProps.isPhoto
            })
        }
        if(nProps.isSticker !== this.state.isSticker){
            if(nProps.isSticker)
                this.CreateSticker(nProps.stickerId,null)
            nProps.ResetStickerState()
            this.setState({
                isSticker : nProps.isSticker
            })
        }
        if(nProps.isTextBox !== this.state.isTextBox){
            if(nProps.isTextBox)
                this.CreateTextbox()
            nProps.ResetTextBoxState()
            this.setState({
                isTextBox: nProps.isTextBox
            })
        }

        if(nProps.orderStyle !== this.state.orderStyle){
            switch(nProps.orderStyle){
                case ORDER_LIST_TYPE.P : 
                    
                    break
                case ORDER_LIST_TYPE.M : 

                    break
                default :
                    break
            }
            this.setState({
                orderStyle : nProps.orderStyle
            })
        }

        if(nProps.sortStyle !== this.state.sortStyle){
            let justify = this.state.frameStyle !== null ? this.state.frameStyle.justifyContent : null
            let align = this.state.frameStyle !== null ? this.state.frameStyle.alignItems : null
            switch(nProps.sortStyle){
                case SORT_LIST_TYPE.L : 
                    justify = 'flex-start'
                    break
                case SORT_LIST_TYPE.R : 
                    justify = 'flex-end'
                    break
                case SORT_LIST_TYPE.C_X : 
                    justify = 'center'
                    break
                case SORT_LIST_TYPE.T : 
                    align = 'flex-start'
                    break
                case SORT_LIST_TYPE.B : 
                    align = 'flex-end'
                    break
                case SORT_LIST_TYPE.C_Y : 
                    align = 'center'
                    break
                default :
                    break
            }
            this.setState({
                sortStyle : nProps.sortStyle,
                frameStyle : {justifyContent : justify, alignItems : align}
            }, ()=>{
                for(let i=0;i<=this.props.selectedSlot.length; i++){
                    switch(this.props.selectedType[i]){
                        case "Photo" :
                            this.DragForceSlot(HISTORYS.DRAG_P,this.props.selectedSlot[i], {x: -1, y: -1})
                            break
                        case "Sticker": 
                            this.DragForceSlot(HISTORYS.DRAG_S,this.props.selectedSlot[i], {x: -1, y: -1})
                            break
                        case "Textbox":
                            this.DragForceSlot(HISTORYS.DRAG_T,this.props.selectedSlot[i], {x: -1, y: -1})
                            break
                        default : 
                            break
                    }
                    
                }
            })
        }

        if(nProps.undo !== this.state.undo || this.state.pivot-1 === nProps.pivot){
            this.setState({
                ...this.state,
                undo : nProps.undo,
                pivot : nProps.pivot
            })
            let data = nProps.undo[Object.keys(nProps.undo)[0]]
            switch(Object.keys(nProps.undo)[0]){
                case HISTORYS.C_P:
                    this.DeletePhoto(null, data['idx'])
                    break
                case HISTORYS.C_S : 
                    this.DeleteSticker(null,data['idx'])
                    break
                case HISTORYS.C_T : 
                    this.DeleteTextbox(null,data['idx'])
                    break
                case HISTORYS.D_P:
                    this.CreatePhoto(data['src'],data['idx'])
                    break
                case HISTORYS.D_S:
                    this.CreateSticker(data['id'],data['idx'])
                    break
                case HISTORYS.D_T:
                    this.CreateTextbox(data)
                    break
                case HISTORYS.DRAG_P:
                case HISTORYS.DRAG_S : 
                case HISTORYS.DRAG_T:
                    this.DragForceSlot(Object.keys(nProps.undo)[0],data['idx'],data['prev'])
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
                    this.CreatePhoto(data['src'],data['idx'])
                    break
                case HISTORYS.C_S :
                    this.CreateSticker(data['id'],data['idx'])
                    break
                case HISTORYS.C_T : 
                    this.CreateTextbox(data)
                    break
                case HISTORYS.D_P:
                    this.DeletePhoto(null,data['idx'])
                    break
                case HISTORYS.D_S :
                    this.DeleteSticker(null,data['idx'])
                    break
                case HISTORYS.D_T:
                    this.DeleteTextbox(null,data['idx'])
                    break
                case HISTORYS.DRAG_P:
                case HISTORYS.DRAG_S:
                case HISTORYS.DRAG_T:
                    this.DragForceSlot(Object.keys(nProps.redo)[0],data['idx'],data['next'])
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

    CreatePhotobook = async () =>{
        let contents = this.refs.template
        return await html2zip(contents,this.props)
    }

    CreatePhoto = (data,idx)=>{
        if(data !== undefined && data !== null){
            console.log(data,idx)
            if(idx === null){
                this.setState({
                    photos: [...this.state.photos,{src: data.src,display : true}],
                    photosDragPos : [...this.state.photosDragPos,null],
                    photosResize : [...this.state.photosResize,null]
                },()=>{
                    this.props.CreateHistory(HISTORYS.C_P,data.src,this.state.photos.length - 1)
                })

            } else {
                this.state.photos[idx].display = true
                this.setState({
                    photos : this.state.photos
                })
            }
        }
    }

    DeletePhoto = (src,idx)=>{
        if(src !== null){
            this.props.DeletePhoto(src,idx)
        }
        this.state.photos[idx === undefined ? this.state.photos.length-1 : idx].display = false
        this.setState({
            photos : this.state.photos
        })
    }

    CreateSticker = (id,idx) =>{
        if(id !== undefined && id !== null){
            // id -> sticker api need
            if(idx === null){
                this.setState({
                    stickers : [...this.state.stickers, {id : id, src:"/photos/sticker1.png",display:true}],
                    stickersDragPos : [...this.state.stickersDragPos, null],
                    stickersResize : [...this.state.stickersResize, null]
                },()=>{
                    this.props.CreateHistory(HISTORYS.C_S,id,this.state.stickers.length-1)
                })
            } else {
                this.state.stickers[idx].display = true
                this.setState({
                    stickers : this.state.stickers
                })
            }            
        }
    }

    DeleteSticker = (sticker_id,idx) =>{
        if(sticker_id !== null){
            this.props.DeleteSticker(sticker_id,idx)
        }

        this.state.stickers[idx === undefined ? this.state.stickers.length-1 : idx].display = false
        this.setState({
            stickers : [...this.state.stickers],
        })
    }

    CreateTextbox = (data)=>{
        if(data !== undefined){
            this.state.textboxes[data['idx']] = true
        } else {
            this.setState({
                textboxes : [...this.state.textboxes, null],
                textColor : [...this.state.textColor, 'black'],
                textboxesDragPos : [...this.state.textboxesDragPos, null],
                textboxesResize : [...this.state.textboxesResize, null]
            },()=>{
                this.props.CreateHistory(HISTORYS.C_T,null,this.state.textboxes.length-1)
            })
        }
    }

    DeleteTextbox = (flag,idx) =>{
        if(flag !== null){
            this.props.DeleteTextBox(this.refs['textbox'+idx].textContent,this.state.textColor[idx],idx)
        }
        
        this.state.textboxes[idx === undefined ? this.state.textboxes.length -1 : idx] = false
        this.setState({
            textboxes : [...this.state.textboxes],
        })
    }

    ChangeTextColor = (idx,color) =>{
        let temp = this.state.textColor
        temp[idx] = color
        this.setState({
            textColor : temp
        })
    }

    DragForceSlot = (type,idx,pos)=>{
        console.log(type,idx,pos)
        switch(type){
            case HISTORYS.DRAG_P:
                if(this.state.photos[idx].display === false)
                    idx = this.state.photos.length -1
                this.state.photosDragPos[idx] = pos
                this.setState({
                    photosDragPos : this.state.photosDragPos
                })
                break
            case HISTORYS.DRAG_S: 
                if(this.state.stickers[idx].display === false)
                    idx = this.state.stickers.length -1
                this.state.stickersDragPos[idx] = pos
                this.setState({
                    stickersDragPos : this.state.stickersDragPos
                })
                break
            case HISTORYS.DRAG_T : 
                if(this.state.textboxes[idx].display === false)
                    idx = this.state.textboxes.length -1
                this.state.textboxesDragPos[idx] = pos
                this.setState({
                    textboxesDragPos : this.state.textboxesDragPos
                })
                break
            default : 
                break
        }
    }
    
    onDragStart = (type,idx)=>{
        switch(type){
            case HISTORYS.DRAG_P:
                this.state.photosDragPos[idx] = null
                this.setState({
                    photosDragPos : this.state.photosDragPos
                })
                break
            case HISTORYS.DRAG_S: 
                this.state.stickersDragPos[idx] = null
                this.setState({
                    stickersDragPos : this.state.stickersDragPos
                })
                break
            case HISTORYS.DRAG_T : 
                this.state.textboxesDragPos[idx] = null
                this.setState({
                    textboxesDragPos : this.state.textboxesDragPos
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
        switch(type){
            case HISTORYS.R_P:
                this.state.photosResize[idx] = size
                this.setState({
                    photosResize : this.state.photosResize
                })
                break
            case HISTORYS.R_S: 
                this.state.stickersResize[idx] = size
                this.setState({
                    stickersResize : this.state.stickersResize
                })
                break
            case HISTORYS.R_T : 
                this.state.textboxesResize[idx] = size
                this.setState({
                    textboxesResize : this.state.textboxesResize
                })
                break
            default : 
                break
        }
    }

    onResizeStart = (type,idx)=>{
        this.setState({
            frameStyle : null
        })
        switch(type){
            case HISTORYS.R_P:
                this.state.photosResize[idx] = null
                this.setState({
                    photosResize : this.state.photosResize
                })
                break
            case HISTORYS.R_S: 
                this.state.stickersResize[idx] = null
                this.setState({
                    stickersResize : this.state.stickersResize
                })
                break
            case HISTORYS.R_T : 
                this.state.textboxesResize[idx] = null
                this.setState({
                    textboxesResize : this.state.textboxesResize
                })
                break
            default : 
                break
        }
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
        if(this.props.template !== null)
            return (
                <div className="template-frame" >
                    <div className="frame-button"><img alt="frame-button" src={require('../resources/blue_left.png')}/></div>
                    <div className="frame" ref="template" style={{
                            border: this.props.template.style_border,
                            justifyContent : this.state.frameStyle !== null ? this.state.frameStyle.justifyContent : 'center',
                            alignItems: this.state.frameStyle !== null ? this.state.frameStyle.alignItems : 'center',
                        }}>
                        {this.state.photos.map((item,idx)=>{
                            console.log(item)
                            if(item.display === false)
                                return
                            return(
                                <Slot key={idx} DeleteSlot={()=>{this.DeletePhoto(item.id,idx)}}
                                    dragForcePos={this.state.photosDragPos[idx]} onDragStart={()=>{this.onDragStart(HISTORYS.DRAG_P,idx)}}
                                    onDragStop={(prev,next)=>{this.onDragStop(HISTORYS.DRAG_P,idx,prev,next)}}
                                    resizeForceSize={this.state.photosResize[idx]} onResizeStart={()=>{this.onResizeStart(HISTORYS.R_P,idx)}} 
                                    onResizeStop={(prev,next)=>{this.onResizeStop(HISTORYS.R_P,idx,prev,next)}}
                                    onClickActive={()=>{this.props.ActiveSlot('Photo',idx)}} onClickDeactive={()=>{this.props.DeactiveSlot('Photo',idx)}}
                                    isSort={this.state.frameStyle !== null && this.props.selectedSlot.indexOf(idx) !== -1 && this.props.selectedType.indexOf('Photo') !== -1}>

                                    <img style={this.props.isCreate ? {} : {border: "1px dashed black"}} 
                                        draggable={false} alt="photo_img" src={item.src}/>
                                </Slot>)
                        })}
                        {this.state.stickers.map((item,idx)=>{
                            if(item.display === false)
                                return 
                            return (
                                <Slot key={idx} DeleteSlot={()=>{this.DeleteSticker(item.id,idx)}}
                                    dragForcePos={this.state.stickersDragPos[idx]} onDragStart={()=>{this.onDragStart(HISTORYS.DRAG_S,idx)}}
                                    onDragStop={(prev,next)=>{this.onDragStop(HISTORYS.DRAG_S,idx,prev,next)}}
                                    resizeForceSize={this.state.stickersResize[idx]} onResizeStart={()=>{this.onResizeStart(HISTORYS.R_S,idx)}} 
                                    onResizeStop={(prev,next)=>{this.onResizeStop(HISTORYS.R_S,idx,prev,next)}}
                                    onClickActive={()=>{this.props.ActiveSlot('Sticker',idx)}} onClickDeactive={()=>{this.props.DeactiveSlot('Sticker', idx)}}
                                    isSort={this.state.frameStyle !== null && this.props.selectedSlot.indexOf(idx) !== -1 && this.props.selectedType.indexOf('Sticker') !== -1}>
                                    
                                    <img style={this.props.isCreate ? {} : {border: "1px dashed black"}} 
                                        draggable={false} alt="sticker" src={item.src}/>
                                </Slot>)
                        })}
                        {this.state.textboxes.map((item,idx)=>{
                            if(item === false)
                                return
                            return (
                                <Slot key={idx} defaultWidth={100} defaultHeight={100} isTextBox={true} ChangeTextColor={(color)=>{this.ChangeTextColor(idx,color)}}
                                    DeleteSlot={()=>{this.DeleteTextbox(true,idx)}} 
                                    dragForcePos={this.state.textboxesDragPos[idx]} onDragStart={()=>{this.onDragStart(HISTORYS.DRAG_T,idx)}}
                                    onDragStop={(prev,next)=>{this.onDragStop(HISTORYS.DRAG_T,idx,prev,next)}}
                                    resizeForceSize={this.state.textboxesResize[idx]} onResizeStart={()=>{this.onResizeStart(HISTORYS.R_T,idx)}} 
                                    onResizeStop={(prev,next)=>{this.onResizeStop(HISTORYS.R_T,idx,prev,next)}}
                                    onClickActive={()=>{this.props.ActiveSlot('Textbox', idx)}} onClickDeactive={()=>{this.props.DeactiveSlot('Textbox', idx)}}
                                    isSort={this.state.frameStyle !== null && this.props.selectedSlot.indexOf(idx) !== -1 && this.props.selectedType.indexOf('Textbox') !== -1}>

                                    <div className="text-box" style={this.props.isCreate ? {} : {border: "1px dashed black",color: this.state.textColor[idx]}}
                                    contentEditable={true} ref={'textbox'+idx}>
                                    {item === null ? "" : item}
                                    </div>
                                </Slot>)
                        })}
                        <img draggable={false} className="frame-img" alt="frame" src={this.props.template.frame}/>
                        {this.props.children}
                    </div>
                    <div className="frame-button"><img alt="frame-button" src={require('../resources/blue_right.png')}/></div>
                </div>
            );
        else 
            return(
                <div className="template-frame">
                <div className="frame-button"><img alt="frame-button" src={require('../resources/blue_left.png')}/></div>
                    <div className="frame"></div>
                    <div className="frame-button"><img alt="frame-button" src={require('../resources/blue_right.png')}/></div>
                </div>
            );
    }
}