import Network from "../Network"
import actions from "./creator"
import {HistoryManager} from "../utils"

export const GET_TEMPLATES = "GET_TEMPLATES"
export const GET_TEMPLATE_INFO = "GET_TEMPLATE_INFO"
export const RESET_TEMPLATE_INFO = "RESET_TEMPLATE_INFO"
export const CREATE_PHOTOBOOK = "CREATE_PHOTOBOOK"
export const UPLOAD_PHOTOBOOK = "UPLOAD_PHOTOBOOK"
export const GET_STICKERS = "GET_STICKERS"
export const CREATE_STICKER = "CREATE_STICKER"
export const DELETE_STICKER = "DELETE_STICKER"
export const RESET_STICKER_STATE = "RESET_STICKER_STATE"
export const DRAG_STICKER = "DRAG_STICKER"
export const CREATE_TEXTBOX = "CREATE_TEXTBOX"
export const DELETE_TEXTBOX = "DELETE_TEXTBOX"
export const RESET_TEXTBOX_STATE = "RESET_TEXTBOX_STATE"
export const DRAG_TEXTBOX = "DRAG_TEXTBOX"
export const REDO_HISTORY = "REDO_HISTORY"
export const UNDO_HISTORY = "UNDO_HISTORY"

export let GetTemplates = actions( GET_TEMPLATES, async()=>{
    return await Network.init().get('/templates')
})

export let GetTemplateInfo = actions( GET_TEMPLATE_INFO, async(templatId)=>{
    return await Network.init().get('/template/',templatId)
})

export let ResetTemplateInfo = actions (RESET_TEMPLATE_INFO, ()=>{
    return null
})

export let UploadPhotobook = actions (UPLOAD_PHOTOBOOK, async(zip)=>{
    return await Network.init().post('/upload/photobook',zip)
})

export let CreatePhotobook = actions (CREATE_PHOTOBOOK, ()=>{
    return true
})

export let GetStickers = actions( GET_STICKERS, async ()=>{
    return await Network.init().get('/stickers')
})

export let CreateSticker = actions (CREATE_STICKER, (id)=>{
    return id
})

export let DeleteSticker = actions (DELETE_STICKER, (id)=>{
    return id
})

export let ResetStickerState = actions(RESET_STICKER_STATE, ()=>{
    return true
})

export let DragSticker = actions( DRAG_STICKER, (idx,prev_pos,next_pos)=>{
    return {idx : idx, prev_pos:prev_pos, next_pos:next_pos}
})

export let CreateTextBox = actions(CREATE_TEXTBOX, ()=>{
    return true
})

export let DeleteTextBox = actions(DELETE_TEXTBOX, (txt,color)=>{
    return {txt: txt, color: color}
})

export let ResetTextBoxState = actions(RESET_TEXTBOX_STATE, ()=>{
    return true
})

export let DragTextBox = actions( DRAG_TEXTBOX, (idx,prev_pos,next_pos)=>{
    return {idx : idx, prev_pos:prev_pos, next_pos:next_pos}
})

export let UndoHistory = actions( UNDO_HISTORY, async ()=>{
    return await HistoryManager.init().UndoHistory()
})

export let RedoHistory = actions( REDO_HISTORY, async ()=>{
    return await HistoryManager.init().RedoHistory()
})