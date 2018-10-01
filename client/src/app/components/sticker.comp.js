import React, { Component } from 'react';
import { hot } from 'react-hot-loader'
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import PropTypes from 'prop-types';

import f_system from '../common/fileSystem'
import history from '../common/history';
import Folder from './folder.comp'
import Board from './board.comp'

@hot(module)
@DragDropContext(HTML5Backend)
export default class extends Component {
    constructor(){
        super();
        this.state={
            folderPosition : [0,0],
            targetId : null,
            stickerSrc : "/photos/sticker1.png"
        };
    }

    observer = (x,y)=>{
        this.setState({
            folderPosition : [x,y]
        })
    }
    
    componentDidMount() {
        f_system.init().setObserver(this.observer)
    }

    static propTypes = {
        folderPosition: PropTypes.arrayOf(
            PropTypes.number.isRequired
        ).isRequired
    };

    renderSquare(i) {
        const x = i % 8;
        const y = Math.floor(i / 8);
        if(this.props.count-1 === i)
        {
            return (
                <div key={i} className={"folder-background"} style={{position:"absolute",right:8,bottom:10,width:"66%",height:"92%", zIndex:1}}>
                    <Board x={x} y={y} isTemplate={true}>
                        {this.renderPiece(x, y, i)}
                    </Board>
                </div>
            );
        } else{
            return (
                <div key={i} className={"folder-background"}>
                    <Board x={x} y={y} isTemplate={false}>
                        {this.renderPiece(x, y, i)}
                    </Board>
                </div>
            );
        }
        
    }

    renderPiece(x, y, i) {
        const [folderX, folderY] = this.state.folderPosition;
        if(i === this.props.count-1 && x === folderX && y === folderY){
            this.setState({
                folderPosition : [0,0]
            })
            return this.props.createSticker(this.state.targetId)
        }
        else if(i !== this.props.count-1)
            return <Folder id={i} img_src={this.state.stickerSrc} targetId={this.state.targetId} 
                setTargetId={(targetId)=>{this.setState({targetId : targetId})}}/>;        
    }

    render() {
        //this.props.stickerList API NEED
        const squares = [];
        for (let i = 0; i < this.props.count; i++) {
            squares.push(this.renderSquare(i));
        }

        return (
            <div className="filedir">
                {squares}
            </div>
        );
    }
}