import React, { Component } from 'react';
import { hot } from 'react-hot-loader'
import { connect } from 'react-redux';

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
            isNameCheck : false,
            path : ''
        };
    }

    componentDidMount(){
    }

    componentWillReceiveProps(nProps){
    }

    onClickNameCheck = ()=>{
        this.setState({
            isNameCheck : true
        })
    }

    onClickPathSelect = () =>{
        console.log('path select')
    }
    //photobook list , path select need
    render() {
        if(this.props.photobookList === undefined)
            return(
                <div className="modal-container new-photobook-container">
                    <div className="loading-square">
                        <div className="loading-spin"></div>
                        <div className="loading-txt">잠시만 기다려주세요...</div>
                    </div>
                </div>
            )
        return (
            <div className="modal-container new-photobook-container">
                <div className="container">
                    <div className="title">새 포토북</div>
                    <div className="content-container">
                        <div className="name-container">
                            <div className="text">포토북 이름</div>
                            <input alt="name-input" className={`input ${this.state.isNameCheck ? 'gray' : ''}`}/>
                            <div className="confirm-btn" onClick={this.onClickNameCheck}>확인</div>
                        </div>
                        <div className="path-container">
                            <div className="text">경로 지정</div>
                            <div className="path">{this.state.path}</div>
                            <div className="confirm-btn" onClick={this.onClickPathSelect}>선택</div>
                        </div>
                        <div className="photobook-container">
                            {this.props.photobookList !== null && this.props.photobookList.map((raw,idx)=>{
                                return(
                                    <div className="item" key={`photobook-item${idx}`}>{raw}</div>
                                )
                            })}
                        </div>
                        <div className="newpb-btns">
                            <div className="confirm-box" onClick={this.props.onConfirm}>
                                <img alt="confirm" src={require('../resources/preview_submit.png')} />
                            </div>
                            <div className="cancel-box" onClick={this.props.onQuit}>
                                <img alt="cancel" src={require('../resources/preview_submit.png')} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}