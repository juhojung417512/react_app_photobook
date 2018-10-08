import {
    GET_TEMPLATES,
    GET_TEMPLATE_INFO,
    RESET_TEMPLATE_INFO,
    CREATE_PHOTOBOOK,
    UPLOAD_PHOTOBOOK,
    CREATE_PHOTO,
    DELETE_PHOTO,
    RESET_PHOTO_STATE,
    DRAG_PHOTO,
    RESIZE_PHOTO,
    GET_STICKERS,
    CREATE_STICKER,
    DELETE_STICKER,
    RESET_STICKER_STATE,
    DRAG_STICKER,
    CREATE_TEXTBOX,
    DELETE_TEXTBOX,
    RESET_TEXTBOX_STATE,
    DRAG_TEXTBOX,
    UNDO_HISTORY,
    REDO_HISTORY,
} from '../actions'
import {HistoryManager} from "../utils"

let initialState={
    template : null,
    templateList : null,
    isCreate : false,
    photoSrc : null,
    stickerList : null,
    stickerId : null,
    isPhoto : false,
    isSticker : false,
    isTextBox : false,
    undo : null,
    redo : null,
    pivot : 0
}

export default function photobook(state=initialState, action){
    HistoryManager.init().WriteHistory(action)
    switch (action.type) {
        case GET_TEMPLATES:
            return {
                ...state,
                templateList : action.payload.templateList
            };
        case GET_TEMPLATE_INFO:
            if(action.payload.template === null)
                alert('템플릿 불러오기 실패!')
            return{
                ...state,
                template: action.payload.template
            }
        case RESET_TEMPLATE_INFO:
            return{
                ...state,
                template: null
            }
        case UPLOAD_PHOTOBOOK :
            if(action.payload)
                alert("업로드 성공!")
            else 
                alert("업로드 실패.")
            return {
                ...state,
                isCreate : false
            }
        case CREATE_PHOTOBOOK:
            return{
                ...state,
                isCreate : action.payload
            }
        case CREATE_PHOTO : 
            return {
                ...state,
                isPhoto: true,
                photoSrc : action.payload
            }
        case DELETE_PHOTO :
            return{
                ...state
            }
        case RESET_PHOTO_STATE : 
            return {
                ...state,
                isPhoto : false,
                photoSrc : null
            }
        case DRAG_PHOTO : 
            return {
                ...state
            }
        case RESIZE_PHOTO : 
            return {
                ...state
            }
        case GET_STICKERS : 
            return{
                ...state,
                stickerList : action.payload.stickerList !== undefined ? action.payload.stickerList : null
            }
        case CREATE_STICKER : 
            return {
                ...state, 
                isSticker : true,
                stickerId : action.payload,
               
            }
        case DELETE_STICKER:
            return {
                ...state
            }
        case RESET_STICKER_STATE : 
            return {
                ...state,
                isSticker : false,
                stickerId : null
            }
        case DRAG_STICKER : 
            return {
                ...state
            }
        case CREATE_TEXTBOX : 
            return { 
                ...state,
                isTextBox : true
            }
        case DELETE_TEXTBOX:
            return{
                ...state
            }
        case RESET_TEXTBOX_STATE : 
            return {
                ...state,
                isTextBox : false
            }
        case DRAG_TEXTBOX : 
            return {
                ...state
            }
        case UNDO_HISTORY :
            return {
                ...state,
                undo : action.payload === null ? state.undo : action.payload.undo,
                pivot : action.payload === null ? state.pivot : action.payload.pivot,
            } 
        case REDO_HISTORY : 
            return {
                ...state,
                redo : action.payload === null ? state.redo : action.payload.redo,
                pivot : action.payload === null ? state.pivot : action.payload.pivot,
            }
        default : 
            return state
    }
}