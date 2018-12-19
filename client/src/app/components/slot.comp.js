import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { hot } from 'react-hot-loader'
import Draggable from 'react-draggable';
import Resizable from 're-resizable';
import { GithubPicker } from 'react-color';
import { transform2pos } from '../common/utils'
import { timingSafeEqual } from 'crypto';

@hot(module)
export default class extends Component {
    constructor() {
        super();
        this.state = {
            dragable : true,
            isClick : false,
            isCanvas : false,
            colorBoxState : false,
            prevPos : null,
            dragForcePos : null,
            visiblePos : null,
            prev_size : null,
            isResize : false,
            isVisible : true,
            size : null
        };
        this.dragHandlers = {onStart: this.onDragStart, onDrag: this.onDragging, onStop: this.onDragStop};
    }

    componentDidMount() {
        
    }

    componentWillReceiveProps(nProps){
        if(this.state.isCanvas !== nProps.isCanvas){
            if(nProps.isCanvas === true)
                this.offClickSlot()
            this.setState({
                isCanvas : nProps.isCanvas
            })
        } else if(this.state.isVisible !== nProps.isVisible && this.refs.DragContainer !== undefined){
            this.setState({
                isVisible : nProps.isVisible
            })
        } else if(this.state.dragForcePos !== nProps.dragForcePos){
            this.setState({
                dragForcePos : nProps.dragForcePos
            })
        } else if(this.state.isClick !== nProps.isPreview){
            if(nProps.isPreview)
                this.setState({
                    isClick : !nProps.isPreview
                })
        }
    }

    onDragStart = () =>{
        this.props.onDragStart()
        let pos = transform2pos(ReactDOM.findDOMNode(this.refs.DragContainer).style.transform)
        this.setState({
            prevPos : pos,
        })
    }

    onDragging = ()=>{
    }

    onDragStop = () =>{
        let pos = transform2pos(ReactDOM.findDOMNode(this.refs.DragContainer).style.transform)
        this.props.onDragStop(this.state.prevPos,pos)
        this.setState({
            prevPos : null,
        })
    }

    onClickSlot = () =>{
        if(!this.state.isClick){
            this.props.onClickActive()
            this.setState({
                isClick : true
            })
        }
    }

    offClickSlot = ()=>{
        this.props.onClickDeactive()
        this.setState({
            isClick : false,
            colorBoxState : false
        })
    }
    
    onChangeTextColor = (color)=>{
        this.props.ChangeTextColor(color.hex)
    }

    onClickColorOpen = () =>{
        this.setState({
            colorBoxState : true
        })
    }

    onClickColorClose = () =>{
        this.setState({
            colorBoxState : false
        })
    }

    onClickDeleteSlot = () =>{
        this.props.DeleteSlot()
    }

    onResizeStart = (w,h)=>{
        this.props.onResizeStart()
        this.setState({
            prev_size: {width: w, height: h},
            isResize : true
        })
    }

    onResizeStop = (w,h)=>{
        this.props.onResizeStop(this.state.prev_size,{width: w, height: h})
        this.setState({
            size : {width: w, height: h},
            prev_size: null,
            isResize : false
        })
    }

    render() {  
        return (
            <Draggable bounds="body" handle='.handle' {...this.dragHandlers} position={this.state.dragForcePos} disabled={this.state.isResize}>
                <div ref="DragContainer" className='slot' onClick={this.onClickSlot} 
                    style={{zIndex: this.props.orderIndex === undefined || this.props.orderIndex === null ? 1 : this.props.orderIndex}}>
                    {this.state.isClick ? 
                        <div className="slot-box">
                            <div className={this.props.type ==="Textbox" ? "text-div left-top2 handle" : "text-div left-top handle"}>
                                <i className="fas fa-arrows-alt"></i>
                            </div>
                            {this.props.isTextBox ? 
                                <div className="text-toolbox">
                                    {this.state.colorBoxState ? 
                                        <div className="color-opener">
                                            <div className="text-div right-bottom3" onClick={this.onClickColorClose}><i className="fas fa-times" style={{fontSize:15}}></i></div>
                                            <div className="color-picker"><GithubPicker triangle='hide' onChangeComplete={this.onChangeTextColor} width={'100px'} height={50}/></div>
                                        </div>
                                        :
                                        <div className="color-opener text-div right-bottom3" onClick={this.onClickColorOpen}><i className="fas fa-palette" style={{fontSize:15}}></i></div>}
                                </div> : <div/>}
                            <div className="exit-div text-div right-bottom" onClick={this.offClickSlot}>
                                <div><i className="fas fa-times" style={{fontSize:15}}></i></div>
                            </div>
                            <div className="text-div right-bottom2" onClick={this.onClickDeleteSlot}>
                                <div><i className="fas fa-trash-alt" style={{fontSize:15}}></i></div>
                            </div>
                        </div> : <div/>}
                    <Resizable
                        style={{
                            display: 'flex',
                        }}
                        defaultSize={{
                            width: this.props.defaultWidth ? this.props.defaultWidth : 200,
                            height: this.props.defaultHeight ? this.props.defaultHeight : 200,
                        }}
                        onResizeStart={(e,direction,ref,d)=>{this.onResizeStart(ref.clientWidth,ref.clientHeight)}}
                        onResizeStop={(e,direction,ref,d)=>{this.onResizeStop(ref.clientWidth,ref.clientHeight)}}
                        size={this.props.resizeForceSize}>
                        {this.props.children}
                    </Resizable>
                </div>
            </Draggable>
        );
    }
}