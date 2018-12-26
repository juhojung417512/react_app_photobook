import React, { Component } from 'react';
import { hot } from 'react-hot-loader'
import { connect } from 'react-redux';
import {sleep} from '../common/utils'

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
@connect(mapStateToProps, mapDispatchToProps)
export default class extends Component {
    constructor() {
        super();
        this.state = {
            isLoading : false
        };
    }

    componentDidMount(){
    }

    componentWillReceiveProps(nProps){
    }

    render() {
        if(this.props.templateCategoryData === null && this.props.templateCategoryData === null)
            return(
                <div className="modal-container preview-template-container">
                    <div className="loading-square">
                        <div className="loading-spin"></div>
                        <div className="loading-txt">잠시만 기다려주세요...</div>
                    </div>
                </div>
            )
        return (
            <div className="modal-container preview-template-container">
                <div className="container">
                    <div className="title">템플릿 미리보기</div>
                    <div className="content-container">
                        <div className="template-container">
                            {this.props.templateCategoryData !== null && this.props.templateCategoryData.map((raw,idx)=>{
                                return(
                                    <div className="item" key={`template-preview-item${idx}`}>
                                        <img alt="템플릿 이미지" src={raw.frame}/>
                                    </div>
                                )
                            })}
                        </div>
                        <div className="newpb-btns">
                            <div className="confirm-box" onClick={this.props.onConfirm}>
                                <img alt="confirm" src={require('../resources/icon_newpb_select.png')} />
                            </div>
                            <div className="cancel-box" onClick={this.props.onQuit}>
                                <img alt="cancel" src={require('../resources/icon_newpb_cancel.png')} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}