import {
    SET_TEMPLATE_IDX,
    GET_TEMPLATES,
    GET_TEMPLATE_INFO,
    RESET_TEMPLATE_INFO,
    CREATE_PHOTOBOOK,
    UPLOAD_PHOTOBOOK,
    ACTIVE_SLOT,
    DEACTIVE_SLOT,
    SORT_SLOT,
    ORDER_SLOT,
    GET_PHOTOS,
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
    RESIZE_STICKER,
    CREATE_TEXTBOX,
    DELETE_TEXTBOX,
    RESET_TEXTBOX_STATE,
    DRAG_TEXTBOX,
    RESIZE_TEXTBOX,
    UNDO_HISTORY,
    REDO_HISTORY,
    CALL_PREVIEW,
    SET_PREVIEW,
    GET_PHOTOBOOK_LIST,
    NEW_PHOTOBOOK,
    LOAD_PHOTOBOOK,
    SAVE_PHOTOBOOK,
    GET_ALL_DATA,
    REFRESH_ALL_DATA,
    CHANGE_COLOR_TEXTBOX,
    DRAG_FORCE_SLOT,
    DRAG_START_SLOT,
    RESIZE_FORCE_SLOT,
    RESIZE_START_SLOT,
    SELECT_TEMPLATE,
    SET_PATH_NEW_PHOTOBOOK
} from '../actions'
import {HistoryManager, OrderSlots, SortSlots} from "../utils"
import {ORDER_LIST_TYPE} from "../constants"
import {HISTORYS} from '../constants'

let stateStore = {
    // state store
}

let initialState={
    template : null,
    templateIndex : null,
    templateCategoryId : null,
    templateList : null,
    isCreate : false,
    photoList : [],
    photoData : null,
    stickerList : null,
    stickerId : null,
    undo : null,
    redo : null,
    pivot : 0,
    selectedSlot : [],
    selectedType : [],
    sortStyle : null,
    orderStyle : null,
    isPreview : false,
    preview : [],
    photobookList : null,
    allData : null,
    photos: [],
    photosForceDragPos : [],
    photosResize : [],
    photosOrder : [],
    stickers : [],
    stickersForceDragPos : [],
    stickersResize : [],
    stickersOrder : [],
    textboxes : [],
    textColor : [],
    textboxesForceDragPos : [],
    textboxesResize : [],
    textboxesOrder : [],
    maxOrder : 0
}

export default function photobook(state=initialState, action){
    let hFlag = true
    switch(action.type){
        
        case CREATE_PHOTO :
            if(action.payload.idx === null)
                action.payload.idx = state.photos.length
            else
                hFlag = false
            break
        case CREATE_STICKER : 
            if(action.payload.idx === null)
                action.payload.idx = state.stickers.length
            else
                hFlag = false
            break
        case CREATE_TEXTBOX : 
            if(action.payload.idx === null)
                action.payload.idx = state.textboxes.length
            else 
                hFlag = false
            break
        case DELETE_PHOTO : 
        case DELETE_STICKER : 
        case DELETE_TEXTBOX : 
            if(!action.payload.hFlag)
                hFlag = false
            break
        default : 
            break
    }
    if(hFlag)
        HistoryManager.init().WriteHistory(action)

    switch (action.type) {
        case SET_PATH_NEW_PHOTOBOOK : 
            console.log(action.payload)
            return{
                ...state
            }
        case SELECT_TEMPLATE : 
            let id = action.payload
            return{
                ...state,
                templateCategoryId : id
            }
            // id로 템플릿 페이지 쭈르륵 생성 (30개), 포토북 경로 선택 팝업.., 새포토북 , 불러오기 팝업 가운데에 표지 뜨도록
        case REFRESH_ALL_DATA : 
            return {
                ...state,
                allData : null
            }
        case GET_ALL_DATA:
            if(state.templateIndex !== null)
                stateStore[state.templateIndex] = state
            return{
                ...state,
                allData : stateStore
            }
        case GET_PHOTOBOOK_LIST :
            return {
                ...state,
                photobookList : action.payload.photobookList
            }
        case NEW_PHOTOBOOK :
            stateStore = {}
            return {
                ...initialState
            }
        case LOAD_PHOTOBOOK :
            // return {
            //     ...action.payload.data
            // }
            return{
                ...state
            }
        case SAVE_PHOTOBOOK :
            action.payload ? alert('저장되었습니다.') : alert('저장실패. 관리자에게 문의해주세요.')
            return {
                ...state
            }
        case RESIZE_FORCE_SLOT : {
            let type = action.payload.type
            let idx = action.payload.idx
            let size = action.payload.size
            switch(type){
                case HISTORYS.R_P:
                    state.photosResize[idx] = size
                    break
                case HISTORYS.R_S: 
                    state.stickersResize[idx] = size
                    break
                case HISTORYS.R_T : 
                    state.textboxesResize[idx] = size
                    break
                default : 
                    break
            }
            return{
                ...state,
                photosResize : state.photosResize,
                stickersResize : state.stickersResize,
                textboxesResize : state.textboxesResize
            }
        }
        case RESIZE_START_SLOT :
            let type = action.payload.type
            let idx = action.payload.idx
            switch(type){
                case HISTORYS.R_P:
                    state.photosResize[idx] = null
                    break
                case HISTORYS.R_S: 
                    state.stickersResize[idx] = null
                    break
                case HISTORYS.R_T : 
                    state.textboxesResize[idx] = null
                    break
                default : 
                    break
            }
            return {
                ...state,
                photosResize : state.photosResize,
                stickersResize : state.stickersResize,
                textboxesResize : state.textboxesResize
            }
        case DRAG_START_SLOT : 
            switch(action.payload.type){
                case HISTORYS.DRAG_P:
                    state.photosForceDragPos[action.payload.idx] = null
                    break
                case HISTORYS.DRAG_S: 
                    state.stickersForceDragPos[action.payload.idx] = null
                    break
                case HISTORYS.DRAG_T : 
                    state.textboxesForceDragPos[action.payload.idx] = null
                    break
                default : 
                    break
            }
            return{
                ...state,
                photosForceDragPos : state.photosForceDragPos,
                stickersForceDragPos : state.stickersForceDragPos,
                textboxesForceDragPos : state.textboxesForceDragPos
            }
        case SET_TEMPLATE_IDX : 
            if(Object.keys(stateStore).length < action.payload + 1)
                stateStore[action.payload] = initialState
            if(state.templateIndex !== null)
                stateStore[state.templateIndex] = state
            return{
                ...stateStore[action.payload],
                templateIndex : action.payload
            }
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
        case ACTIVE_SLOT : 
            return{
                ...state,
                selectedSlot : [...state.selectedSlot, action.payload.idx],
                selectedType : [...state.selectedType, action.payload.type],
                sortStyle : null,
                orderStyle : null
            }
        case DEACTIVE_SLOT : 
            state.selectedSlot.splice(state.selectedSlot.indexOf(action.payload.idx),1)
            state.selectedType.splice(state.selectedType.indexOf(action.payload.type),1)
            return {
                ...state,
                selectedSlot : [...state.selectedSlot],
                selectedType : [...state.selectedType],
                sortStyle : null,
                orderStyle : null
            }
        case SORT_SLOT : 
            if(action.payload.x !== undefined){
                let res
                for(let i=0;i<=state.selectedSlot.length; i++){
                    let idx = state.selectedSlot[i]
                    switch(state.selectedType[i]){
                        case "Photo" :
                            if(state.photos[idx].display === false)
                                break
                            res = SortSlots(state.photosResize[idx],action.payload.x,action.payload.y)
                            state.photosForceDragPos = res.pos
                            break
                        case "Sticker": 
                            if(state.stickers[idx].display === false)
                                break
                            res = SortSlots(state.stickersResize[idx],action.payload.x,action.payload.y)
                            state.stickersForceDragPos = res.pos
                            break
                        case "Textbox":
                            if(state.textboxes[idx].display === false)
                                break
                            res = SortSlots(state.textboxesResize[idx],action.payload.x,action.payload.y)
                            state.textboxesForceDragPos = res.pos
                            break
                        default : 
                            break
                    }
                }
                return{
                    ...state,
                    photosForceDragPos : state.photosForceDragPos,
                    stickersForceDragPos : state.stickersForceDragPos,
                    textboxesForceDragPos : state.textboxesForceDragPos,
                    sortStyle : null,
                }
            }
            return{
                ...state,
                sortStyle : action.payload.type
            }
        case ORDER_SLOT :
            for(var i=0;i<state.selectedSlot.length;i++){
                let type = state.selectedType[i]
                let orderObj
                let res
                let idx = state.selectedSlot[i]
                switch(type){
                    case 'Photo':
                        if(state.photos[idx].display === false)
                            break
                        orderObj = state.photosOrder[idx]
                        res = OrderSlots(action.payload,orderObj,state.maxOrder)
                        state.photosOrder[idx] = res.orderObj
                        break
                    case 'Sticker':
                        if(state.stickers[idx].display === false)
                            break
                        orderObj = state.stickersOrder[idx]
                        res = OrderSlots(action.payload,orderObj,state.maxOrder)
                        state.stickersOrder[idx] = res.orderObj
                        break
                    case 'Textboxes':
                        if(state.textboxes[idx].display === false)
                            break
                        orderObj = state.textboxesOrder[idx]
                        res = OrderSlots(action.payload,orderObj,state.maxOrder)
                        state.textboxesOrder[idx] = res.orderObj
                        break
                    default : 
                        break
                }
                if(res !== undefined)
                    state.maxOrder = res.maxOrder
            }
            return{
                ...state,
                photosOrder : state.photosOrder,
                stickersOrder : state.stickersOrder,
                textboxesOrder : state.textboxesOrder,
                maxOrder : state.maxOrder
            }
        case DRAG_FORCE_SLOT : 
            let slotIdx = action.payload.idx
            let pos = action.payload.pos
            switch(action.payload.type){
                case HISTORYS.DRAG_P: 
                    if(state.photos[slotIdx].display === false)
                        break
                    state.photosForceDragPos[slotIdx] = pos
                    break
                case HISTORYS.DRAG_S:
                    if(state.stickers[slotIdx].display === false)
                        break
                    state.stickersForceDragPos[slotIdx] = pos
                    break
                case HISTORYS.DRAG_T:
                    if(state.textboxes[slotIdx].display === false)
                        break
                    state.textboxesForceDragPos[slotIdx] = pos
                    break
                default : 
                    break
            }
            return{
                ...state,
                photosForceDragPos : state.photosForceDragPos,
                stickersForceDragPos : state.stickersForceDragPos,
                textboxesForceDragPos : state.textboxesForceDragPos,
            }
        
        case GET_PHOTOS : 
            return {
                ...state,
                photoList : action.payload.photoList
            }
        case CREATE_PHOTO : 
            let photoData = action.payload
            
            if(state.photos[photoData.idx] === undefined){
                return {
                    ...state,
                    photos: [...state.photos,{src: photoData.src ,display : true}],
                    photosForceDragPos : [...state.photosForceDragPos,null],
                    photosResize : [...state.photosResize, photoData.size ? photoData.size : null],
                    photosOrder : [...state.photosOrder,1]
                }
            } else {
                state.photos[photoData.idx].display = true
                return {
                    ...state,
                    photos: [...state.photos]
                }
            }
            
        case DELETE_PHOTO :
            state.photos[action.payload.idx === null ? state.photos.length-1 : action.payload.idx].display = false
            return{
                ...state,
                photos : state.photos,
            }
        case RESET_PHOTO_STATE : 
            return {
                ...state,
                isPhoto : false,
                photoData : null
            }
        case DRAG_PHOTO : 
            return {
                ...state,
                sortStyle : null,
                orderStyle : null
            }
        case RESIZE_PHOTO : 
            state.photosResize[action.payload.idx] = action.payload.next
            return {
                ...state,
                photosResize : state.photosResize
            }
        case GET_STICKERS : 
            return{
                ...state,
                stickerList : action.payload.stickerList !== undefined ? action.payload.stickerList : null
            }
        case CREATE_STICKER : 
            let stickerData = action.payload
            if(state.stickers[stickerData.idx] === undefined){
                return{
                    ...state,
                    stickers : [...state.stickers, {id : stickerData.id, src:state.stickerList[stickerData.id-1].src,display:true}],
                    stickersForceDragPos : [...state.stickersForceDragPos, null],
                    stickersResize : [...state.stickersResize, {width: 100, height: 100 }],
                    stickersOrder : [...state.stickersOrder,1]
                }
            } else {
                state.stickers[stickerData.idx].display = true
                return{
                    ...state,
                    stickers : state.stickers
                }
            }
        case DELETE_STICKER:
            state.stickers[action.payload.idx === undefined ? state.stickers.length-1 : action.payload.idx].display = false
            return {
                ...state,
                stickers : state.stickers
            }
        case RESET_STICKER_STATE : 
            return {
                ...state,
                isSticker : false,
                stickerId : null
            }
        case DRAG_STICKER : 
            return {
                ...state,
                sortStyle : null,
                orderStyle : null
            }
        case RESIZE_STICKER : 
            state.stickersResize[action.payload.idx] = action.payload.next
            return{
                ...state,
                stickersResize : state.stickersResize
            }
        case CREATE_TEXTBOX : 
            if(state.textboxes[action.payload.idx] === undefined){
                return{
                    ...state,
                    textboxes : [...state.textboxes, {display:true,text : null}],
                    textColor : [...state.textColor, 'black'],
                    textboxesForceDragPos : [...state.textboxesForceDragPos, null],
                    textboxesResize : [...state.textboxesResize, {width : 100, height: 100}],
                    textboxesOrder : [...state.textboxesOrder,1],
                    selectedSlot : [...state.selectedSlot, action.payload.idx],
                    selectedType : [...state.selectedType, 'Textbox'],
                    sortStyle : null,
                    orderStyle : null
                }
            } else {
                state.textboxes[action.payload.idx].display = true
                state.textboxes[action.payload.idx].text = action.payload.txt
                return{
                    ...state,
                    textboxes : state.textboxes,
                    selectedSlot : [...state.selectedSlot, action.payload.idx],
                    selectedType : [...state.selectedType, 'Textbox'],
                    sortStyle : null,
                    orderStyle : null
                }
            }
        case DELETE_TEXTBOX:
            state.textboxes[action.payload.idx === undefined ? state.textboxes.length -1 : action.payload.idx].display = false
            return{
                ...state,
                textboxes : state.textboxes,
                selectedSlot : [...state.selectedSlot, action.payload.idx],
                selectedType : [...state.selectedType, 'Textbox'],
                sortStyle : null,
                orderStyle : null
            }
        case CHANGE_COLOR_TEXTBOX:
            state.textColor[action.payload.idx] = action.payload.color
            return{
                ...state,
                textColor : state.textColor
            }
        case RESET_TEXTBOX_STATE : 
            return {
                ...state,
                isTextBox : false
            }
        case DRAG_TEXTBOX : 
            return {
                ...state,
                sortStyle : null,
                orderStyle : null
            }
        case RESIZE_TEXTBOX : 
            state.textboxesResize[action.payload.idx] = action.payload.next
            return{
                ...state,
                textboxesResize : state.textboxesResize
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
        case CALL_PREVIEW : 
            return {
                ...state,
                isPreview : true
            }
        case SET_PREVIEW : 
            state.preview[action.payload.idx] = action.payload.preview
            return{
                ...state,
                preview : state.preview,
                isPreview : false
            }
        
        default : 
            return state
    }
}