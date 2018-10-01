import React, {
    Component
} from 'react';
import {
    hot
} from 'react-hot-loader'
import {
    connect
} from 'react-redux';

import history from '../common/history'
import Tools from './tools.comp'
import Template from './template.comp'
import Sticker from './sticker.comp'

import {
    GetLoginData,
    CreatePhotobook,
    CreateSticker,
    GetStickers
} from "../common/actions"

let mapStateToProps = (state) => {
    return {
        user: state.user,
        isLogin: state.user.isLogin,
        stickerList : state.photobook.stickerList
    }
}

let mapDispatchToProps = (dispatch) => {
    return {
        GetLoginData: () => dispatch(GetLoginData()),
        CreatePhotobook : ()=> dispatch(CreatePhotobook()),
        CreateSticker : (idx)=> dispatch(CreateSticker(idx)),
        GetStickers : ()=> dispatch(GetStickers())
    }
}

@hot(module)
@connect(mapStateToProps, mapDispatchToProps)
export default class extends Component {
    constructor() {
        super();
        this.state = {
            showMenu : false,
            dropdownMenuStyle : {display:"none"},
            popupStyle : {display:"none"},
            photoList : [],
            templateId : null,
            sticker_count : 6
        };
        this.dropdownList = [
            {type: "delete", title : "포토북 삭제"},
            {type: "rename", title : "이름 변경"},
            {type: "move", title : "위치이동"},
            {type: "send", title : "포토북 전송"},
        ]
    }

    componentDidMount() {
        if (!window.getCookie('isLogin'))
            history.replace('/')
    }

    showMenu = (event)=> {
        event.preventDefault();

        this.setState({ showMenu: true, dropdownMenuStyle : {display:"block"}}, () => {
            document.addEventListener('click', this.closeMenu);
        });
    }

    closeMenu = (event)=> {
        if (this.state.showMenu)
            this.setState({ showMenu : false, dropdownMenuStyle : {display:"none"}}, () => {
                document.removeEventListener('click', this.closeMenu);
            });
    }

    onClickDropdownItem = (type)=>{
        //popup display on
        console.log(type)
        switch(type){
            case "send" :
                this.props.CreatePhotobook()
                break
            case "delete":
            case "rename":
            case "move":
            default : 
                break
        }
    }

    render() {
        return ( <div className="main-page transition-item">
            <div className="top-bar">
                <div className="menu-title">포토북</div>
                <div className="menu-txt">새포토북</div>
                <div className="menu-txt">불러오기</div>
                <div className="menu-dropdown" onClick={this.showMenu}>
                    포토북 관리
                    <div className="dropdown-list zindex-2" style={this.state.dropdownMenuStyle}>
                        {this.dropdownList.map((item,idx)=>{
                            return(<div onClick={this.onClickDropdownItem.bind(this,item.type)} key={idx}>{item.title}</div>)
                        })}
                    </div>
                </div>
            </div>

            <div className="contents">
                <Sticker count={this.state.sticker_count} createSticker={(idx)=>{this.props.CreateSticker(idx)}} stickerList={this.props.stickerList}/>
                <div className="left">
                    <Tools setPhoto={(photo)=>{this.setState({photoList : [...this.state.photoList, photo]})}} 
                        setTemplate={(templateId)=>{this.setState({templateId:templateId})}}/>
                </div>
                <Template templateId={this.state.templateId}>
                    <div className="photo-square">
                        {this.state.photoList.map((item)=>{
                            return (<div className="photo" key={item}><img draggable={false} src={item} alt={item+"-desc"}/></div>)
                        })}
                    </div> 
                </Template>
            </div>
        </div>);
    }
}