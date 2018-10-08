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
            id: "",
            pw: "",
            isLogin : null
        };
    }

    componentDidMount() {
        Network.init()
    }

    onChange = (e) => {
        if(e.keycode === 13){
            return this.onClickLogin()
        }
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    componentWillReceiveProps(nProps){
        if(nProps.user.isLogin && history.location.pathname !== '/main'){
            history.push('/main')
        }
    }

    onClickLogin = () => {
        if (this.state.id === "" || this.state.pw === "")
            return alert("아이디 혹은 패스워드가 공백 입니다.")
        this.props.Login({
            'id': this.state.id,
            'pw': this.state.pw
        })
    }

    render() {
        return (
            <div className="login main-page transition-item">
                <div className="title">PHOTO BOOK</div>
                <input onChange={this.onChange} name="id" placeholder="아이디를 입력해주세요."></input>
                <input onChange={this.onChange} name="pw" type="password" placeholder="비밀번호를 입력해주세요." ></input>
                <button onClick={this.onClickLogin}>로그인</button>
            </div>
        );
    }
}