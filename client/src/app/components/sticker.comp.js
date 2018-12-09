import React, { Component } from 'react';
import { hot } from 'react-hot-loader'
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import PropTypes from 'prop-types';

import f_system from '../common/FileSystem'
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
            frameBox : undefined,
        };
    }

    observer = (x,y)=>{
        this.setState({
            folderPosition : [x,y]
        })
    }
    componentWillReceiveProps(nProps){
        if(this.state.frameBox !== nProps.frameBox){
            this.setState({
                frameBox : nProps.frameBox
            })
        }
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
        const x = i % this.props.count;
        const y = Math.floor(i / this.props.count);
        if(this.props.count-1 === i && this.props.isTemplate && this.state.frameBox !== undefined)
        {
            let rect = this.state.frameBox.getBoundingClientRect()
            let style = {
                position : 'absolute',
                top : `${rect.top}px`,
                left : `${rect.left}px`,
                width : `${rect.width}px`,
                height : `${rect.height}px`,
                zIndex : 1
            }
            return (
                <div key={i} className={"folder-background"} style={style}>
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
            return this.props.createSticker(this.state.targetId,null)
        }
        else if(i !== this.props.count-1)
            return <Folder id={this.props.stickerList[i].id} img_src={this.props.stickerList[i].src} targetId={this.state.targetId} 
                setTargetId={(targetId)=>{this.setState({targetId : targetId})}}/>;        
    }

    render() {
        const squares1 = [];
        const squares2 = [];
        for (let i = 0; i < this.props.count; i++) {
            if(i % 2 === 0)
                squares1.push(this.renderSquare(i));
            else
                squares2.push(this.renderSquare(i));
        }

        return (
            <div className="filedir">
                <div className="div-divider">
                    {squares1}
                </div>
                <div className="div-divider">
                    {squares2}
                </div>
            </div>
        );
    }
}