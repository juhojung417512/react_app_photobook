import {
    LOGIN,
    GET_LOGIN_DATA,
    SET_LOGIN_DATA
} from '../actions'

let initialState={
    isLogin : null,
    userId : null
}
export default function user(state=initialState, action){
    switch (action.type) {
        case LOGIN:
            if(!action.payload.result)
                alert("아이디 혹은 패스워드가 올바르지 않습니다.")
            else{
                console.log(action.payload.userId)
                window.setCookie('isLogin',true)
            }
            return {
                ...state,
                isLogin : action.payload.result,
            };
        case GET_LOGIN_DATA:
            return {
                ...state
            }
        case SET_LOGIN_DATA :
            window.setCookie('userId',action.payload)
            return {
                ...state,
                userId : action.payload
            }
        default : 
            return state
    }
}