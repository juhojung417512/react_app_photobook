const {app, BrowserWindow} = require('electron')

let wdw = null
let child = null

function createWindow(){
    wdw = new BrowserWindow({show : false,frame:true})

    wdw.loadURL('http://localhost:8081')
    //wdw.webContents.openDevTools()

    wdw.once('ready-to-show',()=>{
        wdw.show()
    })

    wdw.on('closed', ()=>{
        wdw = null
    })
    
    // child
    // if(wdw !== null)
    // {
    //     child = new BrowserWindow({parent:wdw,modal:true, show:false})
    //     child.loadURL('http://naver.com')
    //     child.once('ready-to-show',()=>{
    //         child.show()
    //     })
    // }

}

app.on('ready',()=>{
    createWindow()
})

app.on('activate',()=>{
    if(wdw === null)
        createWindow()
})

app.on('window-all-closed',()=>{
    app.quit()
})