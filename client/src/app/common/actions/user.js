import Network from "../Network"
import actions from "./creator"

export const LOGIN = "LOGIN"
export const GET_LOGIN_DATA = "GET_LOGIN_DATA"
export const SET_LOGIN_DATA = "SET_LOGIN_DATA"

export let Login = actions( LOGIN, async(data)=>{
    return await Network.init().post('/login',data)
})

export let GetLoginData = actions( GET_LOGIN_DATA, ()=>{
    return true
})

export let SetLoginData = actions( SET_LOGIN_DATA, (id)=>{
    return id
})