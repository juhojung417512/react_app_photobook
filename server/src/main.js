import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs'
import path from "path"

import api from './routes';

const app = express();

let port = 3000;

app.use(bodyParser.json());

// app.get("/*", function (req, res) {
//     res.sendFile(path.resolve('../client/build', 'index.html'));
// })

app.get("/resources/templates/:category/:filename", async (req,res) => {
    let filename = req.params.filename
    let category = req.params.category

    let filePath = path.join(__dirname,'../resources/templates/'+category, filename);
    let stat = fs.statSync(filePath);
    let fileEx = filename.split(".")
    fileEx = fileEx[fileEx.length-1]
    res.writeHead(200, {
        'Content-Type': fileEx,
        'Content-Length': stat.size
    });
    let readStream = fs.createReadStream(filePath);
    readStream.pipe(res);
})

app.get("/resources/:filetype/:filename", async (req,res) => {
    let filename = req.params.filename
    let filetype = req.params.filetype

    let filePath = path.join(__dirname,'../resources/'+filetype, filename);
    let stat = fs.statSync(filePath);
    let fileEx = filename.split(".")
    fileEx = fileEx[fileEx.length-1]
    res.writeHead(200, {
        'Content-Type': fileEx,
        'Content-Length': stat.size
    });
    let readStream = fs.createReadStream(filePath);
    readStream.pipe(res);
})

app.get("/resources/:filename", async (req,res) => {
    let filename = req.params.filename

    let filePath = path.join(__dirname,'../resources/', filename);
    let stat = fs.statSync(filePath);
    let fileEx = filename.split(".")
    fileEx = fileEx[fileEx.length-1]
    res.writeHead(200, {
        'Content-Type': fileEx,
        'Content-Length': stat.size
    });
    let readStream = fs.createReadStream(filePath);
    readStream.pipe(res);
})

app.use(express.static('../client/build/'));
app.use('/api', api);

app.listen(port, () => {
    console.log('Express is listening on port', port);
});