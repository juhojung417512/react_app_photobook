import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs'

import api from './routes';

const app = express();

let port = 3000;

app.use(bodyParser.json());

// app.get("/*", function (req, res) {
//     res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
// })

//app.use('/', express.static(__dirname + '/../../build'));

app.use(express.static('../client/build/'));
app.use('/api', api);

app.listen(port, () => {
    console.log('Express is listening on port', port);
});