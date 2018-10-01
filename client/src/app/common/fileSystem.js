export default class File {
    static folderPosition = [0,0]
    static observer = null
    static singltone = null
    
    static init(){
        if(File.singltone === null){
            File.singltone = new File()
        }
        return File.singltone
    }

    static get(){
        return File.singltone
    }

    setObserver = (o)=>{
        File.observer = o
    }

    moveFolder = (toX, toY) => {
        if(File.observer){
            File.observer(toX, toY)
        }
    }
}
