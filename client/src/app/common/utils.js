import html2canvas from 'html2canvas'
import jszip from 'jszip'
import {HISTORYS,MaxHistorys} from './constants'

export async function html2zip(content,props){
    return await html2canvas(content, {useCORS: true}).then(async(canvas) => {
        let zip = new jszip()
        zip.file('info.json',`{border:${props.template.style_border}}`)
        
        let photos = zip.folder('photos')
        photos.file('test.png',canvas.toDataURL('image/png'))

        console.log(photos)
        return await zip.generateAsync({type:"blob"})
    });
}

export function transform2pos(transform){
    let _ = transform.split('(')[1].split('px')
    let x = parseInt(_[0])
    let y = parseInt(_[1].split(' ')[1])

    return {x: x, y: y}
}

export class HistoryManager{
    static history = []
    static pivot = 0
    static instance = null
    
    static init(){
        if(HistoryManager.instance == null)
            HistoryManager.instance = new HistoryManager()
        return HistoryManager.instance
    }

    async WriteHistory(action){
        let isHis = Object.values(HISTORYS).findIndex((key)=>{
            return key === action.type
        })
        
        if(isHis === -1)
            return
        if(HistoryManager.pivot === MaxHistorys)
        {
            HistoryManager.history = [...HistoryManager.history.splice(0,1)]
            HistoryManager.pivot -= 1
        }
        else {
            HistoryManager.pivot += 1
            HistoryManager.history = [...HistoryManager.history, {[action.type]:action.payload}]
        }
    }

    async UndoHistory(){
        if(HistoryManager.pivot !== 0){
            HistoryManager.pivot -= 1
            return { undo : HistoryManager.history[HistoryManager.pivot], pivot : HistoryManager.pivot }
        }
        return null
    }

    async RedoHistory(){
        if(HistoryManager.pivot < HistoryManager.history.length){
            HistoryManager.pivot += 1
            return { redo : HistoryManager.history[HistoryManager.pivot-1] , pivot : HistoryManager.pivot }
        }
        return null
    }
}