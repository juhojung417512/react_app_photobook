import React, { Component } from 'react';
import { hot } from 'react-hot-loader'
import { connect } from 'react-redux';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import PropTypes from 'prop-types';

import Game from '../common/fileSystem'
import Network from '../common/Network'
import history from '../common/history';
import Folder from './folder.comp'
import Board from './board.comp'

import { 
} from "../common/actions"

let mapStateToProps = (state)=>{
    return {
	}
}

let mapDispatchToProps = (dispatch) => {
    return {
    }
}

@hot(module)
@connect(mapStateToProps, mapDispatchToProps )
@DragDropContext(HTML5Backend)
export default class extends Component {
    constructor(){
        super();
        this.state={
            folderPosition : [0,0]
        };
    }

    observer = (x,y)=>{
        this.setState({
            folderPosition : [x,y]
        })
    }
    
    componentDidMount() {
        Game.init().setObserver(this.observer)
    }

    static propTypes = {
        folderPosition: PropTypes.arrayOf(
            PropTypes.number.isRequired
        ).isRequired
    };

    renderSquare(i) {
        const x = i % 8;
        const y = Math.floor(i / 8);
        return (
            <div key={i} className="folder-background">
                <Board x={x} y={y}>
                    {this.renderPiece(x, y)}
                </Board>
            </div>
        );
    }

    renderPiece(x, y) {
        const [folderX, folderY] = this.state.folderPosition;
        if (x === folderX && y === folderY) {
            return <Folder />;
        }
    }

    render() {
        const squares = [];
        for (let i = 0; i < 4; i++) {
            squares.push(this.renderSquare(i));
        }

        return (
            <div className="filedir">
                {squares}
            </div>
        );
    }
}