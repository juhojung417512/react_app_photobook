import React, { Component } from 'react';
import { DragSource } from 'react-dnd';
import PropTypes from 'prop-types';
import { ItemTypes } from '../common/constants';

const folderSource = {
    beginDrag(props) {
        return {
            id : props.id,
            img_src : props.img_src
        };
    }
};
function collect(connect, monitor){
    return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging()
    }
}
@DragSource(ItemTypes.FOLDER, folderSource, collect)
export default class extends Component {
    static propTypes = {
        connectDragSource: PropTypes.func.isRequired,
        isDragging: PropTypes.bool.isRequired
    };

    render() {
        const { id, img_src, connectDragSource, isDragging } = this.props;
        if(isDragging === true && this.props.targetId !== id)
            this.props.setTargetId(id)
        return connectDragSource(
            <div style={{
                opacity: isDragging ? 0.5 : 1,
                cursor: 'move'
            }}>
                <img draggable={false} className="folder" alt="sticker" src={img_src}></img>
            </div>
        );
    }
}