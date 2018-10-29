export default class Network{
    static singletone = null
    static params = null

    static init(){
        if(Network.singletone == null){
            Network.singletone = new Network();
        }
        return Network.singletone
    }

    async get(url,...data){
        let res = await fetch('/api/get'+url+data.join('/'))
        return res.json();
    }

    async post(url,...data){
        let res = await fetch('/api/post'+ url, {
            method: 'post',
            body: JSON.stringify(data),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        return res.json();
    }
    
    async UploadFile(file){
        let form = new FormData();
        form.append("file",file)
        
        let res = await fetch('/api/post/upload/image',{
            method: 'POST',
            body: form
        })
        return res.json()
    }
}