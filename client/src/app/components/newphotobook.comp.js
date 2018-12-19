import React, { Component } from 'react';
import { hot } from 'react-hot-loader'
import { connect } from 'react-redux';
import {sleep} from '../common/utils'

import { 
    GetPhotobookList,
    SetPathNewPhotobook
} from "../common/actions"

let mapStateToProps = (state)=>{
    return {
        photobookList : state.photobook.photobookList,
        photobookId : state.photobook.photobookId,
        photobookPath : state.photobook.photobookPath
	}
}

let mapDispatchToProps = (dispatch) => {
    return {
        GetPhotobookList : (userId)=>dispatch(GetPhotobookList(userId)),
        SetPathNewPhotobook : (path)=>dispatch(SetPathNewPhotobook(path))
    }
}
@hot(module)
@connect(mapStateToProps, mapDispatchToProps)
export default class extends Component {
    constructor() {
        super();
        this.state = {
            isNameCheck : false,
            name : '',
            path : '',
            isPathSelect : false,
            photobookList : [],
            photobookId : null,
            isLoading : false
        };
    }

    componentDidMount(){
        this.props.GetPhotobookList(this.props.userId)
    }

    componentWillReceiveProps(nProps){
        let checkList = ['photobookList','photobookId']
        for(let c of checkList){
            if(this.state[c] !== nProps[c]){
                this.setState({
                    [c] : nProps[c],
                    isLoading : false
                })
            }
        }
    }

    onClickNameCheck = ()=>{
        if(this.state.name !== ''){
            this.setState({
                isNameCheck : true
            })
        }
        else{
            alert("올바른 포토북 이름을 입력해주세요.")
        }
    }

    onClickPathSelect = () =>{
        if(!this.state.isPathSelect){
            this.setState({
                isPathSelect : true
            })
        }
    }

    onClickPath = async(flag)=>{
        if(flag){
            this.props.SetPathNewPhotobook('/1/1')
            this.setState({
                isLoading : true
            })
            await sleep(1000)
        }
        this.setState({
            isPathSelect : false
        })
    }
    onChangeName = (e)=>{
        this.setState({
            name : e.target.value
        })
    }
    onConfirm = ()=>{
        if(this.state.photobookId === null){
            return alert("경로를 지정해주세요.")
        }
        if(this.props.templateCategoryId === null){
            this.props.onConfirm({
                name : this.state.name,
                id : this.state.photobookId,
                userId : this.props.userId,
                templateCategoryData : this.props.templateCategoryData
            })
        } else{
            this.props.onConfirm({
                name : this.state.name,
                id : this.state.photobookId,
                templateCategoryId : this.props.templateCategoryId,
                userId : this.props.userId
            })
        }
    }
    //photobook list , path select need
    render() {
        if(this.props.templateCategoryId === null && this.props.templateCategoryData === null)
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
                {this.state.isLoading &&
                    <div className="loading-square">
                        <div className="loading-spin"></div>
                        <div className="loading-txt">잠시만 기다려주세요...</div>
                    </div>
                }
                {this.state.isPathSelect && 
                    <div className="modal-on-modal">
                        <div className="container">
                            <div className="title">이것은 경로 선택 팝업입니다.</div>
                            <div className="select-btn" onClick={this.onClickPath.bind(this,true)}>
                                <img alt="select-btn" src={require('../resources/icon_newpb_select.png')}/>
                            </div>
                            <div className="cancel-btn" onClick={this.onClickPath.bind(this,false)}>
                                <img alt="cancel" src={require('../resources/icon_newpb_cancel.png')}/>
                            </div>
                        </div>
                    </div>
                }
                
                <div className="container">
                    <div className="title">새 포토북</div>
                    <div className="content-container">
                        <div className="name-container">
                            <div className="text">포토북 이름</div>
                            <input alt="name-input" disabled={this.state.isNameCheck} onChange={this.onChangeName} className={`input ${this.state.isNameCheck ? 'gray' : ''}`}/>
                            <div className="confirm-btn" onClick={this.onClickNameCheck}>확인</div>
                        </div>
                        <div className="path-container">
                            <div className="text">경로 지정</div>
                            <div className="path">{this.state.path}</div>
                            <div className="confirm-btn" onClick={this.onClickPathSelect}>선택</div>
                        </div>
                        <div className="photobook-container">
                            {this.props.templateCategoryData !== null && this.props.templateCategoryData.map((raw,idx)=>{
                                return(
                                    <div className="item" key={`new-photobook-item${idx}`}>
                                        <img alt="photobook-img" src={raw.frame}/>
                                    </div>
                                )
                            })}
                        </div>
                        <div className="newpb-btns">
                            <div className="confirm-box" onClick={this.onConfirm}>
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