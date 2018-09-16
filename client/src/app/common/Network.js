export default class Network{
    static singletone = null

    static init(){
        if(Network.singletone == null){
            Network.singletone = new Network();
        }
        return Network.singletone
    }

    async get(url,...data){
        console.log(data)
        let res = await fetch(url)
        return res.json();
    }

    async post(url,...data){
        let res = await fetch(url, {
            method: 'post',
            body: JSON.stringify(data),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        return res.json();
    }
    
    async postUploadAjax(file){
        let form = new FormData();
        form.append("file",file)
        
        let res = await fetch('/upload/file',{
            method: 'POST',
            body: form
        })
        return res.json()
    }
}