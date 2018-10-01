import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { hot } from 'react-hot-loader'
import Draggable from 'react-draggable';
import Resizable from 're-resizable';
import { GithubPicker } from 'react-color';
import { transform2pos } from '../common/utils'

@hot(module)
export default class extends Component {
    constructor() {
        super();
        this.state = {
            dragable : true,
            isClick : false,
            colorBoxState : false,
            prev_pos : null
        };
        this.dragHandlers = {onStart: this.onDragStart, onDrag: this.onDrag, onStop: this.onDragStop};
    }

    componentDidMount() {
        if(this.props.prevText !== undefined && this.props.prevText !== null){

        }
    }

    onDragStart = () =>{
        this.props.onDragStart()
        let pos = transform2pos(ReactDOM.findDOMNode(this.refs.DragContainer).style.transform)
        this.setState({
            prev_pos : pos
        })
    }

    onDragStop = () =>{
        let pos = transform2pos(ReactDOM.findDOMNode(this.refs.DragContainer).style.transform)
        this.props.onDragStop(this.state.prev_pos,pos)
        this.setState({
            prev_pos : null
        })
    }

    onClickSlot = () =>{
        if(!this.state.isClick)
            this.setState({
                isClick : true
            })
    }

    offClickSlot = ()=>{
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

    dragForcePos = (x,y)=>{
        this.setState({
            dragForcePos: {x:x,y:y}
        })
    }

    render() {
        return (
            <Draggable bounds="body" handle=".handle" {...this.dragHandlers} position={this.props.dragForcePos}>
                <div ref="DragContainer" className="slot zindex-1" onClick={this.onClickSlot}>
                    {this.state.isClick ? 
                        <div className="slot-box">
                            <div className="handle text-div">드래그</div>
                            {this.props.isTextBox ? 
                                <div className="text-toolbox">
                                    {this.state.colorBoxState ? 
                                        <div>
                                            <div className="text-div" onClick={this.onClickColorClose}>글자 색상 닫기</div>
                                            <GithubPicker onChangeComplete={this.onChangeTextColor} width={'100px'} height={50}/>
                                        </div>
                                        : 
                                        <div className="color-opener text-div" onClick={this.onClickColorOpen}>글자 색상</div>}
                                </div> : <div/>}
                            <div className="exit-div text-div" onClick={this.offClickSlot}>닫기</div>
                            <div className="text-div" onClick={this.onClickDeleteSlot}>삭제</div>
                        </div> : <div/>}
                    <Resizable
                        style={{
                            display: 'flex',
                            border: 'solid 1px #ddd',
                            backgroundColor: '',
                        }}
                        defaultSize={{
                            width: this.props.defaultWidth ? this.props.defaultWidth : 200,
                            height: this.props.defaultHeight ? this.props.defaultHeight : 200,
                        }}>
                        {this.props.children}
                    </Resizable>
                </div>
            </Draggable>
        );
    }
}