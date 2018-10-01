import React, { Component } from 'react';
import { hot } from 'react-hot-loader'
import { connect } from 'react-redux';

import Network from '../common/Network'

import { 
    GetTemplates,
    CreateTextBox,
    UndoHistory,
    RedoHistory
} from "../common/actions"

let mapStateToProps = (state)=>{
    return {
        templateList: state.photobook.templateList
	}
}

let mapDispatchToProps = (dispatch) => {
    return {
        GetTemplates:()=>dispatch(GetTemplates()),
        CreateTextBox : ()=>dispatch(CreateTextBox()),
        UndoHistory : ()=>dispatch(UndoHistory()),
        RedoHistory : ()=>dispatch(RedoHistory())
    }
}
@hot(module)
@connect(mapStateToProps, mapDispatchToProps)
export default class extends Component {
    constructor() {
        super();
        this.state = {
            photoList : [],
            maximumPhotoSize : 5000000,
            sticker_count : 3
        };
        this.fileExtList = ['png','jpg','jpeg','raw']
    }

    componentDidMount() {
        this.props.GetTemplates()
    }

    onClickLoadPhoto = ()=>{
        this.refs.file_upload.value = null
        this.refs.file_upload.click()
    }

    onChange = async(ev)=>{
        if(ev.target.files.length === 0)
            return alert("사진 불러오기 실패! (업로드한 파일이 없습니다)")
        else if(ev.target.files[0].size > this.state.maximumPhotoSize)
            return alert("사진 불러오기 실패! (5MB 이상의 사진은 전송할 수 없습니다)")
        let _ = ev.target.files[0].name.split('.')
        let file_ext = _[_.length-1]
        if(this.fileExtList.findIndex((item)=>{return item === file_ext}) === -1)
            return alert("사진 불러오기 실패! (지원하지 않는 확장자 입니다)")
        
        let res = await Network.init().UploadFile(ev.target.files[0])
        if('filename' in res && res.filename !== null)
            this.props.setPhoto(res.filename)
        else
            alert("사진 불러오기 실패! (관리자에게 문의해주세요)")
    }

    onClickTemplate = (templateId) =>{
        this.props.setTemplate(templateId)
    }

    onClickTemplateDelete = ()=> {
        this.props.setTemplate(null)
    }

    onClickTextBox = ()=>{
        this.props.CreateTextBox()
    }

    onClickUndo = ()=>{
        this.props.UndoHistory()
    }

    onClickRedo = ()=>{
        this.props.RedoHistory()
    }

    render() {
        return (
            <div className="tools">
                <div className="template-list">
                    {this.props.templateList ? this.props.templateList.map((item,idx)=>{
                        return(<div key={idx} className="template-icon">
                                <img draggable={false} alt={`template ${idx}`} src={item.frame} onClick={this.onClickTemplate.bind(this,item.templateId)}/>
                            </div>)
                    }) : <div></div>}
                    <button onClick={this.onClickTemplateDelete}>템플릿 삭제</button>
                </div>
                <div className="textbox-div">
                    <button onClick={this.onClickTextBox}>글 상자 만들기</button>
                </div>
                <div className="textbox-div">
                    <button onClick={this.onClickUndo}>실행 취소</button>
                </div>
                <div className="textbox-div">
                    <button onClick={this.onClickRedo}>다시 실행</button>
                </div>
                <div className="photo-upload">
                    <button onClick={this.onClickLoadPhoto}>사진 업로드 하기</button>
                    <input ref="file_upload" type="file" style={{display:"none"}} onChange={this.onChange}/>
                </div>
            </div>
        );
    }
}