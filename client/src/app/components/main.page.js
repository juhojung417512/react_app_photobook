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
import Filedir from './filedir.comp'
import Tools from './tools.comp'
import {
    GetLoginData
} from "../common/actions"

let mapStateToProps = (state) => {
    return {
        user: state.user,
        isLogin: state.user.isLogin
    }
}

let mapDispatchToProps = (dispatch) => {
    return {
        GetLoginData: () => dispatch(GetLoginData())
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
            dropdownList : ["포토북 삭제","이름 변경","위치이동","전송"],
            popupStyle : {display:"none"},
            photoList : []
        };
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

    onClickDropdownItem = (target)=>{
        //popup display on

    }

    render() {
        return ( <div className="main-page transition-item">
            <div className="top-bar">
                <div className="menu-title">포토북</div>
                <div className="menu-txt">새포토북</div>
                <div className="menu-txt">불러오기</div>   
                <div className="menu-dropdown" onClick={this.showMenu}>
                    포토북 관리
                    <div className="dropdown-list" style={this.state.dropdownMenuStyle}>
                        {this.state.dropdownList.map((item)=>{
                            return(<div onClick={this.onClickDropdownItem.bind(item)} key={item}>{item}</div>)
                        })}
                    </div>
                </div>
            </div>

            <div className="contents">
                <div className="left">
                    <Filedir />
                    <Tools setPhoto={(photo)=>{this.setState({photoList : [...this.state.photoList, photo]})}}/>
                </div>
                <div className="photo-square">
                    {this.state.photoList.map((item)=>{
                        return (<div className="photo" key={item}><img src={item} alt={item+"-desc"}/></div>)
                    })}
                </div> 
            </div>
        </div>);
    }
}