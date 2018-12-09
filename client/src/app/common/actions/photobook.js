import Network from "../Network"
import actions from "./creator"
import {HistoryManager} from "../utils"

export const GET_TEMPLATES = "GET_TEMPLATES"
export const GET_TEMPLATE_INFO = "GET_TEMPLATE_INFO"
export const RESET_TEMPLATE_INFO = "RESET_TEMPLATE_INFO"
export const CREATE_PHOTOBOOK = "CREATE_PHOTOBOOK"
export const UPLOAD_PHOTOBOOK = "UPLOAD_PHOTOBOOK"
export const ACTIVE_SLOT = "ACTIVE_SLOT"
export const DEACTIVE_SLOT = "DEACTIVE_SLOT"
export const SORT_SLOT = "SORT_SLOT"
export const ORDER_SLOT = "ORDER_SLOT"
export const GET_PHOTOS = "GET_PHOTOS"
export const CREATE_PHOTO = "CREATE_PHOTO"
export const DELETE_PHOTO = "DELETE_PHOTO"
export const RESET_PHOTO_STATE = "RESET_PHOTO_STATE"
export const DRAG_PHOTO = "DRAG_PHOTO"
export const RESIZE_PHOTO = "RESIZE_PHOTO"
export const GET_STICKERS = "GET_STICKERS"
export const CREATE_STICKER = "CREATE_STICKER"
export const DELETE_STICKER = "DELETE_STICKER"
export const RESET_STICKER_STATE = "RESET_STICKER_STATE"
export const DRAG_STICKER = "DRAG_STICKER"
export const RESIZE_STICKER = "RESIZE_STICKER"
export const CREATE_TEXTBOX = "CREATE_TEXTBOX"
export const DELETE_TEXTBOX = "DELETE_TEXTBOX"
export const RESET_TEXTBOX_STATE = "RESET_TEXTBOX_STATE"
export const DRAG_TEXTBOX = "DRAG_TEXTBOX"
export const RESIZE_TEXTBOX = "RESIZE_TEXTBOX"
export const CHANGE_COLOR_TEXTBOX = "CHANGE_COLOR_TEXTBOX"
export const REDO_HISTORY = "REDO_HISTORY"
export const UNDO_HISTORY = "UNDO_HISTORY"
export const CREATE_HISTORY = "CREATE_HISTORY"
export const SET_TEMPLATE_IDX = "SET_TEMPLATE_IDX"
export const SET_PREVIEW = "SET_PREVIEW"
export const CALL_PREVIEW = "CALL_PREVIEW"
export const GET_PHOTOBOOK_LIST = "GET_PHOTOBOOK_LIST"
export const DRAG_FORCE_SLOT = "DRAG_FORCE_SLOT"
export const DRAG_START_SLOT = "DRAG_START_SLOT"
export const RESIZE_FORCE_SLOT = "RESIZE_FORCE_SLOT"
export const RESIZE_START_SLOT = "RESIZE_START_SLOT"

// server
export const NEW_PHOTOBOOK = "NEW_PHOTOBOOK"
export const LOAD_PHOTOBOOK = "LOAD_PHOTOBOOK"
export const SAVE_PHOTOBOOK = "SAVE_PHOTOBOOK"
export const GET_ALL_DATA = "GET_ALL_DATA"
export const REFRESH_ALL_DATA = "REFRESH_ALL_DATA"

export const RefreshAllData = actions(REFRESH_ALL_DATA, ()=>{
    return true
})

export const GetAllData = actions(GET_ALL_DATA , () =>{
    return true
})

export let GetPhotobookList = actions(GET_PHOTOBOOK_LIST, async ()=>{
    return await Network.init().get('/photobook/get')
})

export let NewPhotobook = actions(NEW_PHOTOBOOK, async ()=>{
    return await Network.init().get('/photobook/new')
})

export let LoadPhotobook = actions(LOAD_PHOTOBOOK, async (id)=>{
    return await Network.init().get(`/photobook/load/${id}`)
})

export let SavePhotobook = actions(SAVE_PHOTOBOOK, async (data)=>{
    return await Network.init().post('/photobook/save',{data : data})
})

export let SetTemaplteIdx = actions( SET_TEMPLATE_IDX, (idx)=>{
    return idx
})

export let GetTemplates = actions( GET_TEMPLATES, async()=>{
    return await Network.init().get('/templates')
})

export let GetTemplateInfo = actions( GET_TEMPLATE_INFO, async(templateId)=>{
    return await Network.init().get(`/template/${templateId}`)
})

export let ResetTemplateInfo = actions (RESET_TEMPLATE_INFO, ()=>{
    return null
})

export let UploadPhotobook = actions (UPLOAD_PHOTOBOOK, async(zip)=>{
    return await Network.init().post('/upload/photobook',{photobook : zip})
})

export let CreatePhotobook = actions (CREATE_PHOTOBOOK, ()=>{
    return true
})

export let ActiveSlot = actions ( ACTIVE_SLOT, (type,idx)=>{
    return {type : type , idx : idx}
})

export let DeactiveSlot = actions ( DEACTIVE_SLOT, (type,idx)=>{
    return {type : type, idx : idx}
})

export let SortSlot = actions( SORT_SLOT,(type, x, y)=>{
    let res = x !== undefined  ? {type : type, x : x, y: y} : {type: type}
    return res
})

export let OrderSlot = actions( ORDER_SLOT,(type)=>{
    return type
})

export let GetPhotos = actions( GET_PHOTOS, async ()=>{
    return await Network.init().get('/photos')
})

export let CreatePhoto = actions( CREATE_PHOTO, (src,size,idx)=>{
    return {src : src, size : size, idx : idx}
})

export let DeletePhoto = actions( DELETE_PHOTO, (idx, hFlag)=>{
    return {idx: idx, hFlag : hFlag}
})

export let DragPhoto = actions( DRAG_PHOTO, (idx, prev, next)=>{
    return {idx: idx, prev: prev, next: next}
})

export let ResizePhoto = actions( RESIZE_PHOTO, (idx, prev, next)=>{
    return {idx : idx, prev: prev, next: next}
})

export let GetStickers = actions( GET_STICKERS, async ()=>{
    return await Network.init().get('/stickers')
})

export let CreateSticker = actions (CREATE_STICKER, (id,idx)=>{
    return {id : id, idx : idx}
})

export let DeleteSticker = actions (DELETE_STICKER, (idx,hFlag)=>{
    return {idx : idx,hFlag : hFlag}
})

export let DragSticker = actions( DRAG_STICKER, (idx,prev,next)=>{
    return {idx : idx, prev:prev, next:next}
})

export let ResizeSticker = actions( RESIZE_STICKER, (idx,prev,next)=>{
    return {idx : idx, prev: prev, next: next}
})

export let CreateTextBox = actions(CREATE_TEXTBOX, (data)=>{
    let data2dic = data !== undefined ? {idx : data.idx, txt : data.txt} : {idx : null}
    return data2dic
})

export let DeleteTextBox = actions(DELETE_TEXTBOX, (txt,color,idx,hFlag)=>{
    return {txt: txt, color: color, idx: idx, hFlag : hFlag}
})
export let DragTextBox = actions( DRAG_TEXTBOX, (idx,prev,next)=>{
    return {idx : idx, prev:prev, next:next}
})

export let ResizeTextBox = actions( RESIZE_TEXTBOX, (idx,prev,next)=>{
    return {idx : idx, prev: prev, next: next}
})

export let UndoHistory = actions( UNDO_HISTORY, ()=>{
    return HistoryManager.init().UndoHistory()
})

export let RedoHistory = actions( REDO_HISTORY, ()=>{
    return HistoryManager.init().RedoHistory()
})

export let CreateHistory = actions (CREATE_HISTORY, (type,id,idx)=>{
    return {type :type, id : id ,idx : idx}
})

export let SetPreview = actions(SET_PREVIEW, (preview,idx)=>{
    return {preview : preview, idx: idx}
})

export let CallPreview = actions(CALL_PREVIEW, ()=>{
    return true
})

export let ChangeColorTextBox = actions(CHANGE_COLOR_TEXTBOX, (idx,color)=>{
    return {idx : idx, color : color}
})

export let DragForceSlot = actions(DRAG_FORCE_SLOT, (type,idx,pos)=>{
    return {type : type, idx : idx, pos: pos}
})

export let DragStartSlot = actions(DRAG_START_SLOT, (type,idx)=>{
    return {type : type, idx : idx}
})

export let ResizeForceSlot = actions(RESIZE_FORCE_SLOT, (type,idx,size)=>{
    return {type : type, idx : idx, size : size}
})

export let ResizeStartSlot = actions(RESIZE_START_SLOT, (type,idx)=>{
    return {type : type, idx : idx}
})