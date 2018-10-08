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
import Photozone from './photozone.comp'
import Templatezone from './templatezone.comp'
import Template from './template.comp'
import Sticker from './sticker.comp'
import Divider from './divider.comp'

import {
    GetLoginData,
    CreatePhotobook,
    CreateSticker,
    GetStickers,
    UndoHistory,
    RedoHistory,
    CreateTextBox,
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
        GetStickers : ()=> dispatch(GetStickers()),
        UndoHistory : ()=>dispatch(UndoHistory()),
        RedoHistory : ()=>dispatch(RedoHistory()),
        CreateTextBox : ()=>dispatch(CreateTextBox()),
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
            addPhotoList : [],
            templateId : null,
            sticker_count : 6,
            dividerState : 'Template'
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

    componentWillReceiveProps(nProps){
        // photo history active need
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

    onClickUndo = ()=>{
        this.props.UndoHistory()
    }

    onClickRedo = ()=>{
        this.props.RedoHistory()
    }

    onClickTextBox = ()=>{
        this.props.CreateTextBox()
    }

    render() {
        return ( <div className="main-page transition-item">
            <div className="top-bar">
                <div className="menu-txt right-border click"><img alt="top_img" src={require('../resources/top_newphotobook.png')}/>새 포토북</div>
                <div className="menu-txt right-border click"><img alt="top_img" src={require('../resources/top_save.png')}/>저장</div>
                <div className="menu-txt right-border click"><img alt="top_img" src={require('../resources/top_load.png')}/>불러오기</div>
                <div className="menu-txt right-border click" onClick={this.onClickUndo}><img alt="top_img" src={require('../resources/top_undo.png')}/>실행취소</div>
                <div className="menu-txt right-border click" onClick={this.onClickRedo}><img alt="top_img" src={require('../resources/top_redo.png')}/>다시실행</div>
                <div className="menu-txt right-border click" onClick={this.onClickTextBox}><img alt="top_img" src={require('../resources/top_text.png')}/>글상자</div>
                <div className="menu-txt right-border click"><img alt="top_img" src={require('../resources/top_layer.png')}/>사진정렬</div>
                <div className="menu-txt right-border click"><img alt="top_img" src={require('../resources/top_sort.png')}/>순서</div>
                <div className="menu-dropdown right-border click" onClick={this.showMenu}>
                    포토북 관리
                    <div className="dropdown-list zindex-2" style={this.state.dropdownMenuStyle}>
                        {this.dropdownList.map((item,idx)=>{
                            return(<div onClick={this.onClickDropdownItem.bind(this,item.type)} key={idx}>{item.title}</div>)
                        })}
                    </div>
                </div>
                <div className="menu-txt"></div>
                <div className="menu-txt"></div>
                <div className="menu-txt"></div>
                <div className="menu-txt left-border click"><img alt="top_img" src={require('../resources/top_preview.png')}/>미리보기</div>
            </div>

            <div className="contents">
                <Divider 
                    photo={<Photozone photoList={this.state.addPhotoList} setPhoto={(photo)=>{this.setState({photoList : [...this.state.photoList, photo]})}}
                        addPhoto={(photo)=>{this.setState({addPhotoList : [...this.state.addPhotoList, photo]})}}/>} 
                    sticker={<Sticker count={this.state.sticker_count} createSticker={(idx)=>{this.props.CreateSticker(idx)}} 
                            stickerList={this.props.stickerList}/>}
                    template={<Templatezone setTemplate={(templateId)=>{this.setState({templateId:templateId})}}/>}
                    state={this.state.dividerState} setType={(type)=>{this.setState({dividerState: type})}}
                />
                <div className="template-page">
                    <Template templateId={this.state.templateId} photoList={this.state.photoList} />
                    <div className="paging">
                            <div className="paging-button"><img alt="paging-button" src={require('../resources/bottom_left.png')}/></div>
                            <div className="template-pages">
                                adsadsdas
                            </div>
                            <div className="paging-button"><img alt="paging-button" src={require('../resources/bottom_right.png')}/></div>
                    </div>
                </div>
                
            </div>
        </div>);
    }
}