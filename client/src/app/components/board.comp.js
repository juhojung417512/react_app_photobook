import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DropTarget } from 'react-dnd';

import Square from './square.comp';
import Game from '../common/fileSystem';
import { ItemTypes } from '../common/constants';

const squareTarget = {
    drop(props) {
        Game.init().moveFolder(props.x, props.y)
    }
};

function collect(connect, monitor) {
    return {
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver()
    };
}

@DropTarget(ItemTypes.FOLDER, squareTarget, collect)
export default class Board extends Component {
    static propTypes = {
        x: PropTypes.number.isRequired,
        y: PropTypes.number.isRequired,
        connectDropTarget: PropTypes.func.isRequired,
        isOver: PropTypes.bool.isRequired
    };

    render() {
        const { x, y, connectDropTarget, isOver } = this.props;
        const black = (x + y) % 2 === 1;

        return connectDropTarget(
            <div className="board">
                <Square black={black}>
                    {this.props.children}
                </Square>
                {isOver &&
                    <div className="isOver"/>}
            </div>
        );
    }
}