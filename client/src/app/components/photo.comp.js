import React, { Component } from 'react';
import { DragSource } from 'react-dnd';
import PropTypes from 'prop-types';
import { ItemTypes } from '../common/constants';

const photoSource = {
    beginDrag(props) {
        return {
            id : props.id,
            img_src : props.img_src,
            size : props.size
        };
    }
};
function collect(connect, monitor){
    return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging()
    }
}
@DragSource(ItemTypes.PHOTO, photoSource, collect)
export default class extends Component {
    static propTypes = {
        connectDragSource: PropTypes.func.isRequired,
        isDragging: PropTypes.bool.isRequired
    };

    render() {
        const { id, img_src, size, connectDragSource, isDragging } = this.props;
        if(isDragging === true && this.props.targetId !== id)
            this.props.setTarget(id,size)
        return connectDragSource(
            <div style={{
                opacity: isDragging ? 0.5 : 1,
                cursor: 'move'
            }}>
                <img draggable={false} className="folder" alt="photos" src={img_src}></img>
            </div>
        );
    }
}