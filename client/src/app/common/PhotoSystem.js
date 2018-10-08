export default class Photo {
    static folderPosition = [0,0]
    static observer = null
    static singltone = null
    
    static init(){
        if(Photo.singltone === null){
            Photo.singltone = new Photo()
        }
        return Photo.singltone
    }

    static get(){
        return Photo.singltone
    }

    setObserver = (o)=>{
        Photo.observer = o
    }

    moveFolder = (toX, toY) => {
        if(Photo.observer){
            Photo.observer(toX, toY)
        }
    }
}
