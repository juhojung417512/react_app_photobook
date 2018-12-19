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
router.post("/upload/image", upload, function (req, res) {
    var size = null;
    var img_id = 'resources/' + Math.floor(Math.random() * 10000).toString() + req.file.originalname;
    filename = img_id;
    _fs2.default.rename(req.file.path, img_id, function (err) {
        if (err) {
            console.log(err);
            filename = null;
        }
    });
    // image size return
    // console.log(path.join(__dirname, '../../', img_id))
    // imagick.identify(path.join(__dirname, '../../', img_id), function(err, features){
    //     if (err) throw err
    //     console.log("SEX")

    //     console.log(features)
    // })
    return res.json({ src: filename, size: { width: 300, height: 300 } });
});

router.post("/photobook/save", function (req, res) {
    var data = req.body[0].data;
    var id = req.body[0].id;
    // update photobook by id
    console.log(data);
    return true;
});

router.post("/upload/photobook", function (req, res) {
    var imageData = req;
    return true;
});

router.post('/login', async function (req, res) {
    var data = req.body[0];
    if (data.id == undefined || data.pw == undefined) return res.json({
        result: false
    });
    var result = await _sqlmgr2.default.login(data.id, data.pw);
    return res.json({
        result: result !== null && result.userId !== undefined ? true : false
    });
});

router.post('/photobook/path', async function (req, res) {
    // let result = await mysql.newPhotobookPath(req.body[0].path)
    var result = {
        insertId: 1
    };
    return res.json({
        res: result !== null ? true : false,
        path: req.body[0].path,
        id: result !== null ? result.insertId : null
    });
});

router.post('/photobook/new', async function (req, res) {
    // new photobook
    var data = req.body[0];
    var templateCategoryId = req.body[0].templateCategoryId;
    var result = await _sqlmgr2.default.getTemplatesByCategoryId(templateCategoryId);
    await _sqlmgr2.default.updatePhotobook(data.id, data.name, templateCategoryId, data.userId);
    // new photobook row

    return res.json({
        res: result
    });
});

exports.default = router;