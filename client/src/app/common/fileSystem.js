export default class File {
    static folderPosition = [0,0]
    static singleton = null
    static observer = null
    static init(){
        if(File.singletone == null){
            File.singletone = new File();
        }
        return File.singletone
    }

    setObserver = (o)=>{
        File.init().observer = o
    }

    moveFolder = (toX, toY)=> {
        if(File.init().observer){
            File.init().observer(toX, toY)
        }
    }
}
