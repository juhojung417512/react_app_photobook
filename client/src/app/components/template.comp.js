import React, { Component } from 'react';
import { hot } from 'react-hot-loader'
import { connect } from 'react-redux';

import {html2zip} from '../common/utils'
import Slot from './slot.comp'
import {HISTORYS} from '../common/constants'

import { 
    GetTemplateInfo,
    ResetTemplateInfo,
    UploadPhotobook,
    ResetStickerState,
    ResetTextBoxState,
    DeleteSticker,
    DeleteTextBox,
    DragSticker,
    DragTextBox
} from "../common/actions"

let mapStateToProps = (state)=>{
    return {
        templateList : state.photobook.templateList,
        template : state.photobook.template,
        isCreate  :state.photobook.isCreate,
        isSticker : state.photobook.isSticker,
        stickerId : state.photobook.stickerId,
        isTextBox : state.photobook.isTextBox,
        undo : state.photobook.undo,
        redo : state.photobook.redo,
        pivot : state.photobook.pivot
	}
}

let mapDispatchToProps = (dispatch) => {
    return {
        GetTemplateInfo:(id)=>dispatch(GetTemplateInfo(id)),
        ResetTemplateInfo : ()=>dispatch(ResetTemplateInfo()),
        UploadPhotobook : (zip)=>dispatch(UploadPhotobook(zip)),
        ResetStickerState : ()=>dispatch(ResetStickerState()),
        ResetTextBoxState : ()=>dispatch(ResetTextBoxState()),
        DeleteSticker : (id)=>dispatch(DeleteSticker(id)),
        DeleteTextBox : (txt,color)=>dispatch(DeleteTextBox(txt,color)),
        DragSticker : (idx,prev_pos,next_props)=>dispatch(DragSticker(idx,prev_pos,next_props)),
        DragTextBox : (idx,prev_pos,next_props)=>dispatch(DragTextBox(idx,prev_pos,next_props))
    }
}//resize redo undo need
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
            stickers: [],
            textboxes : [],
            textColor : [],
            undo : null,
            redo : null,
            pivot : 0,
            stickerDragPos : [],
            textboxDragPos : []
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
        if(nProps.isSticker !== this.state.isSticker){
            if(nProps.isSticker)
                this.CreateSticker(nProps.stickerId)
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

        if(nProps.undo !== this.state.undo || this.state.pivot-1 === nProps.pivot){
            this.setState({
                ...this.state,
                undo : nProps.undo,
                pivot : nProps.pivot
            })
            let data = nProps.undo[Object.keys(nProps.undo)[0]]
            switch(Object.keys(nProps.undo)[0]){
                case HISTORYS.C_S : 
                    //sticker delete
                    this.DeleteSticker()
                    break
                case HISTORYS.C_T : 
                    this.DeleteTextbox()
                    break
                case HISTORYS.D_S:
                    this.CreateSticker(data)
                    break
                case HISTORYS.D_T:
                    this.CreateTextbox(data)
                    break
                case HISTORYS.DRAG_S : 
                    this.DragForceSlot('sticker',data['idx'],data['prev_pos'])
                    break
                case HISTORYS.DRAG_T:
                    this.DragForceSlot('textbox',data['idx'],data['prev_pos'])
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
                case HISTORYS.C_S :
                    //sticker create 
                    this.CreateSticker(data)
                    break
                case HISTORYS.C_T : 
                    this.CreateTextbox(data)
                    break
                case HISTORYS.D_S :
                    this.DeleteSticker()
                    break
                case HISTORYS.D_T:
                    this.DeleteTextbox()
                    break
                case HISTORYS.DRAG_S:
                    this.DragForceSlot('sticker',data['idx'],data['next_pos'])
                    break
                case HISTORYS.DRAG_T:
                    this.DragForceSlot('textbox',data['idx'],data['next_pos'])
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

    CreateSticker = (id) =>{
        if(id !== undefined && id !== null){
            // id -> sticker api need
            this.setState({
                stickers : [...this.state.stickers, {id : id, src:"/photos/sticker1.png"}],
                stickerDragPos : [...this.state.stickerDragPos, null]
            })
        }
    }

    DeleteSticker = (sticker_id,idx) =>{
        if(sticker_id === undefined){
            idx = this.state.stickers.length - 1
        } else {
            this.props.DeleteSticker(sticker_id)
        }
        this.state.stickers.splice(idx,1)
        this.setState({
            stickers : [...this.state.stickers]
        })
    }

    CreateTextbox = (data)=>{
        this.setState({
            textboxes : [...this.state.textboxes, data === undefined ? null : data['txt']],
            textColor : [...this.state.textColor, data === undefined ? 'black' : data['color']],
            textboxDragPos : [...this.state.textboxDragPos, null]
        })
    }

    DeleteTextbox = (idx) =>{
        if(idx === undefined){
            idx = this.state.textboxes.length - 1
        } else {
            this.props.DeleteTextBox(this.refs['textbox'+idx].textContent,this.state.textColor[idx])
        }
        
        this.state.textboxes.splice(idx,1)
        this.state.textColor.splice(idx,1)
        this.setState({
            textboxes : [...this.state.textboxes],
            textColor : [...this.state.textColor]
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
        if(type === 'sticker'){
            this.state.stickerDragPos[idx] = pos
            this.setState({
                stickerDragPos : this.state.stickerDragPos
            })
        } else if(type === 'textbox'){
            this.state.textboxDragPos[idx] = pos
            this.setState({
                textboxDragPos : this.state.textboxDragPos
            })
        }
    }
    
    onDragStop = (type,idx,prev_pos,next_pos)=>{
        if(type === 'sticker'){
            this.props.DragSticker(idx,prev_pos,next_pos)
        } else if(type ==='textbox'){
            this.props.DragTextBox(idx,prev_pos,next_pos)
        }
    }

    onDragStart = (type,idx)=>{
        if(type === 'sticker'){
            this.state.stickerDragPos[idx] = null
            this.setState({
                stickerDragPos : this.state.stickerDragPos
            })
        } else if(type === 'textbox'){
            this.state.textboxDragPos[idx] = null
            this.setState({
                textboxDragPos : this.state.textboxDragPos
            })
        }
    }

    render() {
        if(this.props.template !== null)
            return (
                <div className="frame" style={{border: this.props.template.style_border}} ref="template">
                    {this.state.stickers.map((item,idx)=>{
                        return (
                            <Slot key={idx} DeleteSlot={()=>{this.DeleteSticker(item.id,idx)}} onDragStop={(prev,next)=>{this.onDragStop('sticker',idx,prev,next)}}
                                dragForcePos={this.state.stickerDragPos[idx]} onDragStart={()=>{this.onDragStart('sticker',idx)}}>
                                <img style={this.props.isCreate ? {} : {border: "1px dashed black"}} 
                                    draggable={false} alt="sticker" src={item.src}/>
                            </Slot>)
                    })}
                    {this.state.textboxes.map((item,idx)=>{
                        return (
                            <Slot key={idx} defaultWidth={100} defaultHeight={100} isTextBox={true} ChangeTextColor={(color)=>{this.ChangeTextColor(idx,color)}}
                                DeleteSlot={()=>{this.DeleteTextbox(idx)}} onDragStop={(prev,next)=>{this.onDragStop('textbox',idx,prev,next)}}
                                dragForcePos={this.state.textboxDragPos[idx]} onDragStart={()=>{this.onDragStart('textbox',idx)}}>
                                <div className="text-box" style={this.props.isCreate ? {} : {border: "1px dashed black",color: this.state.textColor[idx]}}
                                contentEditable={true} ref={'textbox'+idx}>
                                {item === null ? "" : item}
                                </div>
                            </Slot>)
                    })}
                    <img draggable={false} className="frame-img" alt="frame" src={this.props.template.frame}/>
                    {this.props.children}
                </div>
            );
        else 
            return(
                <div className="frame">
                </div>
            );
    }
}