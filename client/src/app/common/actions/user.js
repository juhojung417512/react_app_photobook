import Network from "../Network"
import actions from "./creator"

export const LOGIN = "LOGIN"
export const GET_LOGIN_DATA = "GET_LOGIN_DATA"

export let Login = actions( LOGIN, async(data)=>{
    return await Network.init().post('/api/post/login',data)
})

export let GetLoginData = actions( GET_LOGIN_DATA, async()=>{
    return true
})