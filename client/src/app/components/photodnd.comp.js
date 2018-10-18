import React, { Component } from 'react';
import { hot } from 'react-hot-loader'
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import PropTypes from 'prop-types';

import p_system from '../common/PhotoSystem'
import history from '../common/history';
import Photo from './photo.comp'
import PhotoBoard from './photoboard.comp'

@hot(module)
@DragDropContext(HTML5Backend)
export default class extends Component {
    constructor(){
        super();
        this.state={
            folderPosition : [0,0],
            targetId : null,
        };
    }

    observer = (x,y)=>{
        this.setState({
            folderPosition : [x,y]
        })
    }
    
    componentDidMount() {
        p_system.init().setObserver(this.observer)
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
                <div key={i} className={"folder-background"} style={{position:"absolute",right:132,bottom:173,width:"57%",height:"62%", zIndex:1}}>
                    <PhotoBoard x={x} y={y} isTemplate={true}>
                        {this.renderPiece(x, y, i)}
                    </PhotoBoard>
                </div>
            );
        } else{
            return (
                <div key={i} className={"folder-background"}>
                    <PhotoBoard x={x} y={y} isTemplate={false}>
                        {this.renderPiece(x, y, i)}
                    </PhotoBoard>
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
            return this.props.createPhoto(this.state.targetId)
        }
        else if(i !== this.props.count-1)
            return <Photo id={this.props.photoList[i]} img_src={this.props.photoList[i]} targetId={this.state.targetId} 
                setTargetId={(targetId)=>{this.setState({targetId : targetId})}}/>;        
    }

    render() {
        //this.props.stickerList API NEED
        const squares = [];
        if(this.props.count === 1)
            return(<div></div>)

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