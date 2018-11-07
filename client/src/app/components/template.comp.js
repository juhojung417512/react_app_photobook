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
    CreateHistory,
    SetPreview
} from "../common/actions"

let mapStateToProps = (state)=>{
    return {
        templateList : state.photobook.templateList,
        stickerList : state.photobook.stickerList,
        isPreview : state.photobook.isPreview,
        isCreate  :state.photobook.isCreate,
        isPhoto : state.photobook.isPhoto,
        photoData : state.photobook.photoData,
        isSticker : state.photobook.isSticker,
        stickerId : state.photobook.stickerId,
        isTextBox : state.photobook.isTextBox,
        undo : state.photobook.undo,
        redo : state.photobook.redo,
        pivot : state.photobook.pivot,
        selectedSlot : state.photobook.selectedSlot,
        selectedType : state.photobook.selectedType,
        sortStyle : state.photobook.sortStyle,
        orderStyle : state.photobook.orderStyle,
	}
}

let mapDispatchToProps = (dispatch) => {
    return {
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
        CreateHistory : (type, id, idx)=>dispatch(CreateHistory(type,id,idx)),
        SetPreview : (preview,idx)=>dispatch(SetPreview(preview,idx))
    }
}
@hot(module)
@connect(mapStateToProps, mapDispatchToProps)
export default class extends Component {
    constructor() {
        super();
        this.state = {
            isCreate : false,
            isSticker : false,
            isTextBox : false,
            isPhoto : false,
            isPreview : false,
            photos : [],
            stickers: [],
            textboxes : [],
            textColor : [],
            undo : null,
            redo : null,
            pivot : 0,
            photosNowDragPos : [],
            photosForceDragPos : [],
            stickersNowDragPos : [],
            stickersForceDragPos : [],
            textboxesNowDragPos : [],
            textboxesForceDragPos : [],
            stickersResize : [],
            photosResize : [],
            textboxesResize : [],
            photosOrder : [],
            stickersOrder : [],
            textboxesOrder : [],
            maxOrder : 2, // array 순서 때문에 있는 버그 있음
            orderStyle : null,
            sortStyle : null,
            frameStyle : null,
            previewTime : true
        }
        this.board_count = 100
    }

    componentDidMount(){
    }

    componentWillReceiveProps(nProps) {
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
        else if(nProps.isPhoto !== this.state.isPhoto) {
            if(nProps.isPhoto)
                this.CreatePhoto(nProps.photoData,null)
            nProps.ResetPhotoState()
            this.setState({
                isPhoto : nProps.isPhoto
            })
        }
        else if(nProps.isSticker !== this.state.isSticker){
            if(nProps.isSticker)
                this.CreateSticker(nProps.stickerId,null)
            nProps.ResetStickerState()
            this.setState({
                isSticker : nProps.isSticker
            })
        }
        else if(nProps.isTextBox !== this.state.isTextBox){
            if(nProps.isTextBox)
                this.CreateTextbox()
            nProps.ResetTextBoxState()
            this.setState({
                isTextBox: nProps.isTextBox
            })
        }
        else if(nProps.orderStyle !== this.state.orderStyle){
            let maxOrder = this.state.maxOrder
            for(var i=0;i<this.props.selectedSlot.length;i++){
                let idx = this.props.selectedSlot[i]
                switch(nProps.orderStyle){
                    case ORDER_LIST_TYPE.P : 
                        switch(this.props.selectedType[i]){
                            case 'Photo':
                                this.state.photosOrder[idx] += 1
                                if(maxOrder < this.state.photosOrder[idx])
                                    maxOrder = this.state.photosOrder
                                break
                            case 'Sticker' :
                                this.state.stickersOrder[idx] += 1
                                if(maxOrder < this.state.photosOrder[idx])
                                    maxOrder = this.state.photosOrder
                                break
                            case 'Textbox' :
                                this.state.textboxesOrder[idx] += 1
                                if(maxOrder < this.state.photosOrder[idx])
                                    maxOrder = this.state.photosOrder
                                break
                            default : 
                                break
                        }
                        break
                    case ORDER_LIST_TYPE.M : 
                        switch(this.props.selectedType[i]){
                            case 'Photo':
                                if(this.state.photosOrder[idx] === 1)
                                    continue
                                this.state.photosOrder[idx] -= 1
                                break
                            case 'Sticker' :
                                if(this.state.stickersOrder[idx] === 1)
                                    continue
                                this.state.stickersOrder[idx] -= 1
                                break
                            case 'Textbox' :
                                if(this.state.textboxesOrder[idx] === 1)
                                    continue 
                                this.state.textboxesOrder[idx] -= 1
                                break
                            default : 
                                break
                        }
                        break
                    case ORDER_LIST_TYPE.F : 
                        switch(this.props.selectedType[i]){
                            case 'Photo':
                                this.state.photosOrder[idx] = maxOrder + 1
                                break
                            case 'Sticker' :
                                this.state.stickersOrder[idx] = maxOrder + 1
                                break
                            case 'Textbox' : 
                                this.state.textboxesOrder[idx] = maxOrder + 1
                                break
                            default : 
                                break
                        }
                        break
                    case ORDER_LIST_TYPE.B : 
                        switch(this.props.selectedType[i]){
                            case 'Photo':
                                this.state.photosOrder[idx] = 1
                                break
                            case 'Sticker' :
                                this.state.stickersOrder[idx] = 1
                                break
                            case 'Textbox' : 
                                this.state.textboxesOrder[idx] = 1
                                break
                            default : 
                                break
                        }
                        break
                    default :
                        break
                }
            }
            this.setState({
                photosOrder : this.state.photosOrder,
                stickersOrder : this.state.stickersOrder,
                textboxesOrder : this.state.textboxesOrder,
                orderStyle : nProps.orderStyle,
                maxOrder : this.state.maxOrder < maxOrder ? maxOrder : this.state.maxOrder
            })
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
            
            for(let i=0;i<=this.props.selectedSlot.length; i++){
                let posX = null
                let posY = null
                let slotPos = null
                let slotSize = null
                switch(this.props.selectedType[i]){
                    case "Photo" :
                        slotPos = this.state.photosNowDragPos[this.props.selectedSlot[i]]
                        slotSize = this.state.photosResize[this.props.selectedSlot[i]]
                        posX = x === null ? slotPos.x : x === 0 ? x : x - slotSize.width
                        posY = y === null ? slotPos.y : y === 0 ? y : y - slotSize.height
                        this.DragForceSlot(HISTORYS.DRAG_P,this.props.selectedSlot[i], {x: posX, y: posY})
                        break
                    case "Sticker": 
                        slotPos = this.state.stickersNowDragPos[this.props.selectedSlot[i]]
                        slotSize = this.state.stickersResize[this.props.selectedSlot[i]]
                        posX = x === null ? slotPos.x : x === 0 ? x : x - slotSize.width
                        posY = y === null ? slotPos.y : y === 0 ? y : y - slotSize.height
                        this.DragForceSlot(HISTORYS.DRAG_S,this.props.selectedSlot[i], {x: posX, y: posY})
                        break
                    case "Textbox":
                        slotPos = this.state.textboxesNowDragPos[this.props.selectedSlot[i]]
                        slotSize = this.state.textboxesResize[this.props.selectedSlot[i]]
                        posX = x === null ? slotPos.x : x === 0 ? x : x - slotSize.width
                        posY = y === null ? slotPos.y : y === 0 ? y : y - slotSize.height
                        this.DragForceSlot(HISTORYS.DRAG_T,this.props.selectedSlot[i], {x: posX, y: posY})
                        break
                    default : 
                        break
                }
            }
            this.setState({
                sortStyle : nProps.sortStyle
            })
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

    CreatePhoto = (data,idx)=>{
        //api - size, src need
        if(data !== undefined && data !== null){
            if(idx === null){
                this.setState({
                    photos: [...this.state.photos,{src: data.src ,display : true}],
                    photosForceDragPos : [...this.state.photosForceDragPos,null],
                    photosNowDragPos : [...this.state.photosNowDragPos, {x : 0, y : 0}],
                    photosResize : [...this.state.photosResize, data.size ? data.size : null],
                    photosOrder : [...this.state.photosOrder,1]
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
            id = id.id
            if(idx === null){
                this.setState({
                    stickers : [...this.state.stickers, {id : id, src:this.props.stickerList[id-1].src,display:true}],
                    stickersForceDragPos : [...this.state.stickersForceDragPos, null],
                    stickersNowDragPos : [...this.state.stickersNowDragPos, {x : 0, y : 0}],
                    stickersResize : [...this.state.stickersResize, {width: 100, height: 100 }],
                    stickersOrder : [...this.state.stickersOrder,1]
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
            this.state.textboxes[data['idx']].display = true
            this.state.textboxes[data['idx']].text = data['txt']
            this.setState({
                textboxes : this.state.textboxes
            })
            this.props.ActiveSlot('Textbox',data['idx'])
        } else {
            this.setState({
                textboxes : [...this.state.textboxes, {display:true,text : null}],
                textColor : [...this.state.textColor, 'black'],
                textboxesForceDragPos : [...this.state.textboxesForceDragPos, null],
                textboxesNowDragPos : [...this.state.textboxesNowDragPos, {x: 0, y : 0}],
                textboxesResize : [...this.state.textboxesResize, {width : 100, height: 100}],
                textboxesOrder : [...this.state.textboxesOrder,1]
            },()=>{
                this.props.CreateHistory(HISTORYS.C_T,null,this.state.textboxes.length-1)
                this.props.ActiveSlot('Textbox',this.state.textboxes.length-1)
            })
        }
    }

    DeleteTextbox = (flag,idx) =>{
        if(flag !== null){
            this.props.DeleteTextBox(this.refs['textbox'+idx].textContent,this.state.textColor[idx],idx)
        }
        
        this.state.textboxes[idx === undefined ? this.state.textboxes.length -1 : idx].display = false
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
        switch(type){
            case HISTORYS.DRAG_P:
                if(this.state.photos[idx].display === false)
                    idx = this.state.photos.length -1
                this.state.photosForceDragPos[idx] = pos
                this.state.photosNowDragPos[idx] = pos
                this.setState({
                    photosForceDragPos : this.state.photosForceDragPos,
                    photosNowDragPos : this.state.photosNowDragPos
                })
                break
            case HISTORYS.DRAG_S: 
                if(this.state.stickers[idx].display === false)
                    idx = this.state.stickers.length -1
                this.state.stickersForceDragPos[idx] = pos
                this.state.stickersNowDragPos[idx] = pos
                this.setState({
                    stickersForceDragPos : this.state.stickersForceDragPos,
                    stickersNowDragPos : this.state.stickersNowDragPos
                })
                break
            case HISTORYS.DRAG_T : 
                if(this.state.textboxes[idx].display === false)
                    idx = this.state.textboxes.length -1
                this.state.textboxesForceDragPos[idx] = pos
                this.state.textboxesNowDragPos[idx] = pos
                this.setState({
                    textboxesForceDragPos : this.state.textboxesForceDragPos,
                    textboxesNowDragPos : this.state.textboxesNowDragPos
                })
                break
            default : 
                break
        }
    }
    
    onDragStart = (type,idx)=>{
        switch(type){
            case HISTORYS.DRAG_P:
                this.state.photosForceDragPos[idx] = null
                this.setState({
                    photosForceDragPos : this.state.photosForceDragPos
                })
                break
            case HISTORYS.DRAG_S: 
                this.state.stickersForceDragPos[idx] = null
                this.setState({
                    stickersForceDragPos : this.state.stickersForceDragPos
                })
                break
            case HISTORYS.DRAG_T : 
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
                this.state.photosNowDragPos[idx] = next
                this.setState({
                    photosNowDragPos : this.state.photosNowDragPos
                })
                this.props.DragPhoto(idx,prev,next)
                break
            case HISTORYS.DRAG_S: 
                this.state.stickersNowDragPos[idx] = next
                this.setState({
                    stickersNowDragPos : this.state.stickersNowDragPos
                })
                this.props.DragSticker(idx,prev,next)
                break
            case HISTORYS.DRAG_T : 
                this.state.textboxesNowDragPos[idx] = next
                this.setState({
                    textboxesNowDragPos : this.state.textboxesNowDragPos
                })
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
                this.state.photosResize[idx] = next
                this.setState({
                    photosResize : this.state.photosResize
                })
                break
            case HISTORYS.R_S: 
                this.props.ResizeSticker(idx,prev,next)
                this.state.stickersResize[idx] = next
                this.setState({
                    stickersResize : this.state.stickersResize
                })
                break
            case HISTORYS.R_T : 
                this.props.ResizeTextBox(idx,prev,next)
                this.state.textboxesResize[idx] = next
                this.setState({
                    textboxesResize : this.state.textboxesResize
                })
                break
            default : 
                break
        }
    }

    render() {
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
                                <Slot key={idx} DeleteSlot={()=>{this.DeletePhoto(item.id,idx)}}
                                    dragForcePos={this.state.photosForceDragPos[idx]} onDragStart={()=>{this.onDragStart(HISTORYS.DRAG_P,idx)}}
                                    onForceDrag={(pos)=>{this.DragForceSlot(HISTORYS.DRAG_P,idx,pos)}}
                                    onDragStop={(prev,next)=>{this.onDragStop(HISTORYS.DRAG_P,idx,prev,next)}}
                                    onForceResize={(size)=>{this.ResizeForceSlot(HISTORYS.R_P,idx,size)}}
                                    resizeForceSize={this.state.photosResize[idx]} onResizeStart={()=>{this.onResizeStart(HISTORYS.R_P,idx)}} 
                                    onResizeStop={(prev,next)=>{this.onResizeStop(HISTORYS.R_P,idx,prev,next)}}
                                    onClickActive={()=>{this.props.ActiveSlot('Photo',idx)}} onClickDeactive={()=>{this.props.DeactiveSlot('Photo',idx)}}
                                    isSort={this.state.frameStyle !== null && this.props.selectedSlot.indexOf(idx) !== -1 && this.props.selectedType.indexOf('Photo') !== -1}
                                    orderIndex={this.state.photosOrder[idx]} isCanvas={this.props.isCreate || this.state.isPreview ? true : false}
                                    isVisible={this.props.isVisible} isPreview={this.props.isPreview} type='Photo'>

                                    <img style={this.props.isCreate || this.props.isPreview || this.props.selectedSlot.indexOf(idx) === -1 ? {} : {border: "1px dashed black"}} 
                                        draggable={false} alt="photo_img" src={item.src}/>
                                </Slot>)
                        })}
                        {this.state.stickers.map((item,idx)=>{
                            if(item.display === false)
                                return 
                            return (
                                <Slot key={idx} DeleteSlot={()=>{this.DeleteSticker(item.id,idx)}}
                                    dragForcePos={this.state.stickersForceDragPos[idx]} onDragStart={()=>{this.onDragStart(HISTORYS.DRAG_S,idx)}}
                                    onForceDrag={(pos)=>{this.DragForceSlot(HISTORYS.DRAG_S,idx,pos)}}
                                    onDragStop={(prev,next)=>{this.onDragStop(HISTORYS.DRAG_S,idx,prev,next)}}
                                    onForceResize={(size)=>{this.ResizeForceSlot(HISTORYS.R_S,idx,size)}}
                                    resizeForceSize={this.state.stickersResize[idx]} onResizeStart={()=>{this.onResizeStart(HISTORYS.R_S,idx)}} 
                                    onResizeStop={(prev,next)=>{this.onResizeStop(HISTORYS.R_S,idx,prev,next)}}
                                    onClickActive={()=>{this.props.ActiveSlot('Sticker',idx)}} onClickDeactive={()=>{this.props.DeactiveSlot('Sticker', idx)}}
                                    isSort={this.state.frameStyle !== null && this.props.selectedSlot.indexOf(idx) !== -1 && this.props.selectedType.indexOf('Sticker') !== -1}
                                    orderIndex={this.state.stickersOrder[idx]} isCanvas={this.props.isCreate || this.state.isPreview ? true : false}
                                    isVisible={this.props.isVisible} isPreview={this.props.isPreview} type='Sticker'>
                                    
                                    <img style={this.props.isCreate || this.props.isPreview || this.props.selectedSlot.indexOf(idx) === -1 ? {} : {border: "1px dashed black"}} 
                                        draggable={false} alt="sticker" src={item.src}/>
                                </Slot>)
                        })}
                        {this.state.textboxes.map((item,idx)=>{
                            if(item.display === false)
                                return
                            return (
                                <Slot key={idx} defaultWidth={100} defaultHeight={100} isTextBox={true} ChangeTextColor={(color)=>{this.ChangeTextColor(idx,color)}}
                                    DeleteSlot={()=>{this.DeleteTextbox(true,idx)}} 
                                    dragForcePos={this.state.textboxesForceDragPos[idx]} onDragStart={()=>{this.onDragStart(HISTORYS.DRAG_T,idx)}}
                                    onForceDrag={(pos)=>{this.DragForceSlot(HISTORYS.DRAG_T,idx,pos)}}
                                    onDragStop={(prev,next)=>{this.onDragStop(HISTORYS.DRAG_T,idx,prev,next)}}
                                    onForceResize={(size)=>{this.ResizeForceSlot(HISTORYS.R_T,idx,size)}}
                                    resizeForceSize={this.state.textboxesResize[idx]} onResizeStart={()=>{this.onResizeStart(HISTORYS.R_T,idx)}} 
                                    onResizeStop={(prev,next)=>{this.onResizeStop(HISTORYS.R_T,idx,prev,next)}}
                                    onClickActive={()=>{this.props.ActiveSlot('Textbox', idx)}} onClickDeactive={()=>{this.props.DeactiveSlot('Textbox', idx)}}
                                    isSort={this.state.frameStyle !== null && this.props.selectedSlot.indexOf(idx) !== -1 && this.props.selectedType.indexOf('Textbox') !== -1}
                                    orderIndex={this.state.textboxesOrder[idx]} isCanvas={this.props.isCreate || this.state.isPreview ? true : false}
                                    isVisible={this.props.isVisible} isPreview={this.props.isPreview} type='Textbox'>

                                    <div className="text-box" style={this.props.isCreate || this.props.isPreview || this.props.selectedSlot.indexOf(idx) === -1 ? {} : {border: "1px dashed black",color: this.state.textColor[idx]}}
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