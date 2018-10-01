'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _routes = require('./routes');

var _routes2 = _interopRequireDefault(_routes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();

var port = 3000;

app.use(_bodyParser2.default.json());

// app.get("/*", function (req, res) {
//     res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
// })

app.get("/photos/:filename", async function (req, res) {
    var filename = req.params.filename;
    var filePath = _path2.default.join(__dirname, '../photos', filename);
    var stat = _fs2.default.statSync(filePath);
    var fileEx = filename.split(".");
    fileEx = fileEx[fileEx.length - 1];
    res.writeHead(200, {
        'Content-Type': fileEx,
        'Content-Length': stat.size
    });
    var readStream = _fs2.default.createReadStream(filePath);
    readStream.pipe(res);
});

app.use(_express2.default.static('../client/build/'));
app.use('/api', _routes2.default);

app.listen(port, function () {
    console.log('Express is listening on port', port);
});