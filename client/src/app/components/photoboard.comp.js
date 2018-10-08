import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DropTarget } from 'react-dnd';

import Square from './square.comp';
import p_system from '../common/PhotoSystem';
import { ItemTypes } from '../common/constants';

const squareTarget = {
    drop(props) {
        p_system.init().moveFolder(props.x, props.y)
    }
};

function collect(connect, monitor) {
    return {
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver()
    };
}

@DropTarget(ItemTypes.PHOTO, squareTarget, collect)
export default class Board extends Component {
    static propTypes = {
        x: PropTypes.number.isRequired,
        y: PropTypes.number.isRequired,
        connectDropTarget: PropTypes.func.isRequired,
        isOver: PropTypes.bool.isRequired
    };

    render() {
        const { x, y, connectDropTarget, isOver } = this.props;
        if(this.props.isTemplate){
            return connectDropTarget(
                <div className="board">
                    <Square>
                        {this.props.children}
                    </Square>
                    {isOver &&
                        <div className="isOver"/>}
                </div>
            );
        } else{
            return(
                <div className="board">
                    <Square>
                        {this.props.children}
                    </Square>
                </div>
            );
        }
        
    }
}