import React, { Component } from 'react';
import { hot } from 'react-hot-loader'
import { connect } from 'react-redux';

import { 
    GetTemplates
} from "../common/actions"

let mapStateToProps = (state)=>{
    return {
        templateList : state.photobook.templateList
	}
}

let mapDispatchToProps = (dispatch) => {
    return {
        GetTemplates : ()=>dispatch(GetTemplates())
    }
}
@hot(module)
@connect(mapStateToProps, mapDispatchToProps)
export default class extends Component {
    constructor() {
        super();
        this.state = {
            templateId : null,
            templates_length : null,
            mainTemplates : [],
            subTemplates : {},
            hoverId : null
        };
    }

    componentDidMount(){
        this.props.GetTemplates()
    }

    componentWillReceiveProps(nProps){
        if(nProps.templateList !== undefined && nProps.templateList !== null && this.state.templates_length !== nProps.templateList.length && nProps.templateList.length > 0){
            console.log(nProps.templateList)
            let mains = []
            let subs = {}
            for(let t of nProps.templateList){
                if(t.isMain){
                    mains.push(t)
                } else{
                    if(subs[t.category_id] === undefined){
                        subs[t.category_id] = t
                    } else {
                        subs[t.category_id] = [...subs[t.category_id],t]
                    }
                }
            }
            this.setState({
                templates_length : nProps.templateList.length,
                mainTemplates : mains,
                subTemplates : subs
            })
        }    
    }

    onClickTemplate = (id)=>{
        this.setState({
            templateId: id
        })
    }

    onHoverTemplate = (id)=>{
        this.setState({
            hoverId : id
        })
    }

    outHoverTemplate =()=>{
        this.setState({
            hoverId : null
        })
    }
    
    render() {
        let templates_length = this.state.templates_length
        let mainTemplates = this.state.mainTemplates
        let subTemplates = this.state.subTemplates
        if(mainTemplates === null || templates_length === null || templates_length <= 0)
            return(
                <div className="modal-container template-select-container">
                    <div className="loading-square">
                        <div className="loading-spin"></div>
                        <div className="loading-txt">...템플릿 로딩중입니다...</div>
                    </div>
                </div>
            )
        return (
            <div className="modal-container template-select-container">
                <div className="container">
                    <div className="title-container">
                        <div className="title">템플릿 선택</div>
                    </div>
                    <div className="btn-container">
                        <div className="btn" onClick={this.props.onConfirm.bind(this,this.state.templateId)}>
                                <img alt="선택" src={require('../resources/icon_template_select.png')} />
                            </div>
                        <div className="btn" onClick={this.props.onQuit}>
                            <img alt="취소" src={require('../resources/icon_template_cancel.png')} />
                        </div>
                    </div>
                    <div className="content-container">
                        <div className="template-container">
                            {mainTemplates !== null && mainTemplates.map((raw,idx)=>{
                                if(raw.isMain === 0 || idx % 2 === 0 || idx === 0)
                                    return null
                                return(
                                    <div 
                                        className="item" key={`template-item${idx}`} 
                                        onClick={this.onClickTemplate.bind(this,raw.id)}
                                        onMouseEnter={this.onHoverTemplate.bind(this,raw.id)}
                                        onMouseLeave={this.outHoverTemplate.bind(this)}
                                        >
                                        <img alt={`main-img${raw.id}`} src={raw.frame}></img>
                                        <div className="hover-div" style={this.state.hoverId===raw.id ? {display : 'flex'} : {}}>
                                            {subTemplates[raw.category_id] !== undefined && subTemplates[raw.category_id].map((raw,idx)=>{
                                                return(
                                                    <img alt={`sub-img`} src={raw.frame} key={idx}/>
                                                )
                                            })}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                        <div className="template-container">
                            {mainTemplates !== null && mainTemplates.map((raw,idx)=>{
                                if(raw.isMain === 0 || idx % 2 === 1)
                                    return null
                                return(
                                    <div 
                                        className="item" key={`template-item${idx}`} 
                                        onClick={this.onClickTemplate.bind(this,raw.id)}
                                        onMouseEnter={this.onHoverTemplate.bind(this,raw.id)}
                                        onMouseLeave={this.outHoverTemplate.bind(this)}
                                        >
                                        <img alt={`main-img${raw.id}`} src={raw.frame}></img>
                                        <div className="hover-div" style={this.state.hoverId===raw.id ? {display : 'flex'} : {}}>
                                            {subTemplates[raw.category_id] !== undefined && subTemplates[raw.category_id].map((raw,idx)=>{
                                                return(
                                                    <img alt={`sub-img`} src={raw.frame} key={idx}/>
                                                )
                                            })}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                        
                    </div>
                </div>
            </div>
        );
    }
}