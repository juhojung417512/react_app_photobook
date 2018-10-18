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

    onKeyPress = (e) =>{
        if(e.key === 'Enter'){
            return this.onClickLogin()
        }
    }

    onChange = (e) => {
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
                <img className="top-icon" alt="login top icon" src={require('../resources/login_top_icon.png')}/>
                <div className="content">
                    <div className="signin-txt">Sign In</div>
                    <div className="login-txt">
                        <div className="login-img">
                            <img alt="id" src={require('../resources/login_user_icon.png')} />
                        </div>
                        <div className="login-input">
                            <input onChange={this.onChange} name="id" placeholder="Username"></input>
                        </div>
                    </div>
                    <div className="login-txt">
                        <div className="login-img">
                            <img alt="pw" src={require('../resources/login_lock_icon.png')} />
                        </div>
                        <div className="login-input">
                            <input onKeyPress={this.onKeyPress} onChange={this.onChange} name="pw" type="password" placeholder="Password" ></input>
                        </div>
                    </div>
                    <div className="login-button">
                        <button onClick={this.onClickLogin}>Login</button>
                    </div>
                </div>
                
            </div>
        );
    }
}