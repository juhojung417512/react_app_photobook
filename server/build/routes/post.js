'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _multer = require('multer');

var _multer2 = _interopRequireDefault(_multer);

var _sqlmgr = require('../../scripts/sqlmgr');

var _sqlmgr2 = _interopRequireDefault(_sqlmgr);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();
var storage = (0, _multer2.default)({ dest: '../../photos', limits: { fileSize: 5 * 1024 * 1024 } });
var upload = storage.single('file');

var filename = void 0;
router.post("/upload/file", upload, function (req, res) {
    var img_id = Math.floor(Math.random() * 10000).toString() + req.file.originalname;
    _fs2.default.rename(req.file.path, 'photos/' + img_id, function (err) {
        if (err) {
            console.log(err);
            filename = null;
        }
    });
    filename = 'photos/' + img_id;
    return res.json({ filename: filename });
});

router.post('/login', async function (req, res) {
    console.log('reading post ', req.body);
    var data = req.body[0];
    if (data.id == undefined || data.pw == undefined) return res.json({
        result: false
    });
    var result = await _sqlmgr2.default.login(data.id, data.pw);
    return res.json({
        result: result !== undefined && result.userId !== undefined ? true : false,
        id: data.id,
        pw: data.pw
    });
});

exports.default = router;