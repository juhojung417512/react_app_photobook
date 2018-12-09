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
            selectId : null
        };
    }

    componentDidMount(){
    }

    componentWillReceiveProps(nProps){
    }

    onClickItem = (id)=>{
        if(this.state.selectId !== id){
            this.setState({
                selectId : id
            })
        }
    }

    //photobook list , path select need
    render() {
        if(this.props.photobookList === undefined)
            return(
                <div className="modal-container load-photobook-container">
                    <div className="loading-square">
                        <div className="loading-spin"></div>
                        <div className="loading-txt">잠시만 기다려주세요...</div>
                    </div>
                </div>
            )
        return (
            <div className="modal-container load-photobook-container">
                <div className="container">
                    <div className="title">불러오기</div>
                    <div className="content-container">
                        <div className="photobook-container" ref="pb_con">
                            <div><div className="item selected" onClick={this.onClickItem.bind(this,0)}>asdasdasd</div></div>
                            {this.props.photobookList !== null && this.props.photobookList.map((raw,idx)=>{
                                if(idx % 6 === 0){
                                    return(
                                        <div className="item-box" key={`photobook-item${idx}`} >
                                            <div className={`item ${this.state.selectId === raw.id ? 'selected' : ''}`} 
                                                
                                                onClick={this.onClickItem.bind(this,raw.id)}>{raw}
                                            </div>
                                            <div className="line-break"></div>
                                        </div>
                                    )
                                }
                                return(
                                    <div className="item-box" key={`photobook-item${idx}`} >
                                        <div className={`item ${this.state.selectId === raw.id ? 'selected' : ''}`} 
                                            
                                            onClick={this.onClickItem.bind(this,raw.id)}>{raw}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                        <div className="newpb-btns">
                            <div className="confirm-box" onClick={this.props.onConfirm.bind(this,this.state.selectId)}>
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