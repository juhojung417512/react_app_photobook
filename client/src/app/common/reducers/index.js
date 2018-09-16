import { combineReducers } from 'redux';
import test from "./test"
import user from "./user"

export default function createStore(reducers){
    return combineReducers({
        test,
        user,
        ...reducers
    })
}
