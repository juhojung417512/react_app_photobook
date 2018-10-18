import React, { Component } from 'react';
import { hot } from 'react-hot-loader'
import { connect } from 'react-redux';

import Network from '../common/Network'
import history from '../common/history';

import { 
    CreatePhotobook
} from "../common/actions"

let mapStateToProps = (state)=>{
    return {
        preview : state.photobook.preview        
	}
}

let mapDispatchToProps = (dispatch) => {
    return {
        CreatePhotobook : ()=>dispatch(CreatePhotobook())
    }
}
@hot(module)
@connect(mapStateToProps, mapDispatchToProps)
export default class extends Component {
    constructor() {
        super();
        this.state = {
            preview : null
        };
    }

    componentDidMount() {
        console.log(this.props.preview, this.refs.content)
        if(this.props.preview !== undefined && this.props.preview !== null 
                && this.props.preview !== this.state.preview && this.refs.content !== undefined){
            this.refs.content.appendChild(this.props.preview)
            this.setState({
                preview : this.props.preview
            })            
        }
    }

    componentWillReceiveProps(nProps){
        
    }

    render() {
        return (
            <div className="modal-container preview-modal">
                    <div className="preview-div">
                        <div className="title">미리보기</div>
                        <div className="preview-button">
                            <img alt="button-send" onClick={this.props.CreatePhotobook} src={require('../resources/preview_submit.png')}/>
                            <img alt="button-send" onClick={this.props.onExit} src={require('../resources/preview_exit.png')}/>
                        </div>
                        <div className="content" ref="content">
                        </div>
                    </div>
            </div>
        );
    }
}