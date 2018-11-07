import React, { Component } from 'react';
import { hot } from 'react-hot-loader'
import { connect } from 'react-redux';

import Network from '../common/Network'
import history from '../common/history';
import Alert from './alert.comp'
import {elem2canvas} from '../common/utils'

import { 
    CallPreview
} from "../common/actions"

let mapStateToProps = (state)=>{
    return {
        isPreview : state.photobook.isPreview
	}
}

let mapDispatchToProps = (dispatch) => {
    return {
        CallPreview : ()=>dispatch(CallPreview())
    }
}
@hot(module)
@connect(mapStateToProps, mapDispatchToProps)
export default class extends Component {
    constructor() {
        super();
        this.state = {
            preview : [],
            previewList : [],
            previewIdx : 0,
            alert : false,
            alertMsg : null
        };
    }

    componentDidMount(){
        if(this.props.preview !== undefined && this.props.preview !== null && this.props.preview !== this.state.preview){
            this.setState({
                preview : this.props.preview,
            })
        }
    }

    componentWillReceiveProps(nProps){
    }

    onClickSend = ()=>{
        this.props.CreatePhotobook()
        this.setState({
            alert : true,
            alertMsg : '전송을 완료하였습니다.'
        })
    }

    onClickPreviewMove = (type)=>{
        if(type === 'left' && this.state.previewIdx > 0){
            this.setState({
                previewIdx : this.state.previewIdx - 1
            })
        } else if(type ==='right' && this.state.previewIdx < this.state.preview.length - 1){
            this.setState({
                previewIdx : this.state.previewIdx + 1
            })
        }
    }

    render() {
        if(eval('this.refs.content'+this.state.previewIdx) !== undefined && eval('this.refs.content'+this.state.previewIdx).children.length === 0){
            eval('this.refs.content'+this.state.previewIdx+'.appendChild(this.state.preview['+this.state.previewIdx+'])')
        }
        return (
            <div className="modal-container preview-modal">
                {this.state.alert ? <Alert msg={this.state.alertMsg} closeAlert={()=>{this.setState({alert:false,alkertMsg: null})}}/> : null}

                <div className="preview-div">
                    <div className="title">미리보기</div>
                    <div className="preview-button">
                        <img alt="button-send" onClick={this.onClickSend} src={require('../resources/preview_submit.png')}/>
                        <img alt="button-exit" onClick={this.props.onExit} src={require('../resources/preview_exit.png')}/>
                    </div>
                    <div className="content-div">
                        <div className="paging-button"><img alt="paging-button" src={require('../resources/blue_left.png')} 
                            onClick={this.onClickPreviewMove.bind(this,'left')}/></div>
                        {this.props.preview.map((raw,idx)=>{
                            return(<div className="content" style={{display: this.state.previewIdx === idx ? 'flex' : 'none'}} key={idx} ref={`content${idx}`}>
                            </div>)
                        })}
                        <div className="paging-button"><img alt="paging-button" src={require('../resources/blue_right.png')}
                            onClick={this.onClickPreviewMove.bind(this,'right')}/></div>
                    </div>
                </div>
            </div>
        );
    }
}