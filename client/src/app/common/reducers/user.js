import {
    LOGIN,
    GET_LOGIN_DATA
} from '../actions'

let initialState={
    isLogin : null
}
export default function user(state=initialState, action){
    switch (action.type) {
        case LOGIN:
            if(!action.payload.result)
                alert("아이디 혹은 패스워드가 올바르지 않습니다.")
            else{
                window.setCookie('isLogin',true)
            }

            return {
                ...state,
                isLogin : action.payload.result
            };
        case GET_LOGIN_DATA:
            return {
                isLogin : state.isLogin
            }
        default : 
            return state
    }
}