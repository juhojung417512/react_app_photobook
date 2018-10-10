export const ItemTypes = {
  FOLDER: 'floder',
  PHOTO : 'photo'
};
export const MaxHistorys = 20
export const HISTORYS = {
    'C_P' : 'CREATE_PHOTO',
    'D_P' : 'DELETE_PHOTO',
    'DRAG_P' : 'DRAG_PHOTO',
    'R_P' : 'RESIZE_PHOTO',
    'C_S' : 'CREATE_STICKER',
    'D_S': 'DELETE_STICKER',
    'DRAG_S': 'DRAG_STICKER',
    'R_S' : 'RESIZE_STICKER',
    'C_T':'CREATE_TEXTBOX',
    'D_T' : 'DELETE_TEXTBOX',
    'DRAG_T' : 'DRAG_TEXTBOX',
    'R_T' : 'RESIZE_TEXTBOX',
    'C_H' : 'CREATE_HISTORY',
}

export const PHOTOBOOK_LIST = [
    {type: "delete", title : "포토북 삭제"},
    {type: "rename", title : "이름 변경"},
    {type: "move", title : "위치이동"},
    {type: "send", title : "포토북 전송"},
]

export const ORDER_LIST = [
    {type: "plus", title : "앞으로"},
    {type: "minus", title : "뒤로"},
    {type: "forward", title : "맨 앞으로"},
    {type: "backward", title : "맨 뒤로"},
]

export const ORDER_LIST_TYPE = {
    P : 'plus',
    M : 'minus',
    F : 'forward',
    B : 'backward'
}

export const SORT_LIST = [
    {type: "left", title : "왼쪽"},
    {type: "right", title : "오른쪽"},
    {type: "centerX", title : "가로 가운데"},
    {type: "top", title : "위"},
    {type: "bottom", title : "아래"},
    {type: "centerY", title : "세로 가운데"},
]

export const SORT_LIST_TYPE = {
    L : 'left',
    R : 'right',
    C_X : 'centerX',
    T : 'top',
    B : 'bottom',
    C_Y : 'centerY'
}