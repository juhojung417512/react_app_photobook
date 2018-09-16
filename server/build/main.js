'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _routes = require('./routes');

var _routes2 = _interopRequireDefault(_routes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();

var port = 3000;

app.use(_bodyParser2.default.json());

// app.get("/*", function (req, res) {
//     res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
// })

//app.use('/', express.static(__dirname + '/../../build'));

app.use(_express2.default.static('../client/build/'));
app.use('/api', _routes2.default);

app.listen(port, function () {
    console.log('Express is listening on port', port);
});