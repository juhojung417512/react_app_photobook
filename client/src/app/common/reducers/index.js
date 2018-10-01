import { combineReducers } from 'redux';
import test from "./test"
import user from "./user"
import photobook from "./photobook"

export default function createStore(reducers){
    return combineReducers({
        test,
        user,
        photobook,
        ...reducers
    })
}
