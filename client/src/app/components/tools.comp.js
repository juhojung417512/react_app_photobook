import React, { Component } from 'react';
import { hot } from 'react-hot-loader'
import { connect } from 'react-redux';

import Network from '../common/Network'
import history from '../common/history';

import { 
    Login
} from "../common/actions"

let mapStateToProps = (state)=>{
    return {
        user:state.user,
	}
}

let mapDispatchToProps = (dispatch) => {
    return {
        Login:(id,pw)=>dispatch(Login(id,pw)),
    }
}
@hot(module)
@connect(mapStateToProps, mapDispatchToProps)
export default class extends Component {
    constructor() {
        super();
        this.state = {
            photoList : [],
            maximumPhotoSize : 5000000
        };
        this.fileExtList = ['png','jpg','jpeg','raw']
    }

    componentDidMount() {
    }

    onClickLoadPhoto = ()=>{
        this.refs.file_upload.value = null
        this.refs.file_upload.click()
    }

    onChange = async(ev)=>{
        if(ev.target.files.length === 0)
            return alert("사진 불러오기 실패! (업로드한 파일이 없습니다.)")
        else if(ev.target.files[0].size > this.state.maximumPhotoSize)
            return alert("사진 불러오기 실패! (5MB 이상의 사진은 전송할 수 없습니다.)")
        let _ = ev.target.files[0].name.split('.')
        let file_ext = _[_.length-1]
        if(this.fileExtList.findIndex((item)=>{return item === file_ext}) === -1)
            return alert("사진 불러오기 실패! (지원하지 않는 확장자 입니다.)")
        
        let res = await Network.init().postUploadAjax(ev.target.files[0])
        if('filename' in res)
            this.props.setPhoto(res.filename) // postuploadajax serverside need
    }

    render() {
        return (
            <div className="tools">
                <button onClick={this.onClickLoadPhoto}>사진 업로드 하기</button>
                <input ref="file_upload" type="file" style={{display:"none"}} onChange={this.onChange}/>
            </div>
        );
    }
}