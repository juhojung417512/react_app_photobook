import React, { Component } from 'react';
import { hot } from 'react-hot-loader'
import { connect } from 'react-redux';
import Photodnd from './photodnd.comp'
import Network from '../common/Network'

import { 
    CreatePhoto,
} from "../common/actions"

let mapStateToProps = (state)=>{
    return {
	}
}

let mapDispatchToProps = (dispatch) => {
    return {
        CreatePhoto : (src,size,idx)=>dispatch(CreatePhoto(src,size,idx)),
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
        };
        this.fileExtList = ['png','jpg','jpeg','raw']
    }

    componentDidMount() {
        this.setState({
            photoList : this.props.photoList
        })
    }

    componentWillReceiveProps(nProps){
        if(nProps.photoList !== this.state.photoList){
            this.setState({
                photoList : nProps.photoList
            })
        }
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
        if('src' in res && res.src !== null)
            this.props.addPhoto(res)
        else
            alert("사진 불러오기 실패! 관리자에게 문의해주세요.")
    }
    render() {
        return (
            <div className="tools">
                <div className="photo-zone"> 
                    <Photodnd 
                        count={this.state.photoList.length +1}
                        createPhoto={(src,size)=>{this.props.CreatePhoto(src,size,null)}}
                        photoList={this.state.photoList} 
                        isTemplate={this.props.isTemplate}
                        frameBox={this.props.frameBox}
                        />
                </div>
                <div className="photo-upload">
                    <button onClick={this.onClickLoadPhoto}>사진 업로드 하기</button>
                    <input ref="file_upload" type="file" style={{display:"none"}} onChange={this.onChange}/>
                </div>
            </div>
        );
    }
}