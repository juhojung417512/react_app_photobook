'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _sqlmgr = require('../../scripts/sqlmgr');

var _sqlmgr2 = _interopRequireDefault(_sqlmgr);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router.get('/', function (req, res) {
    return res.json({
        success: true
    });
});

router.get('/:id', function (req, res) {
    console.log('reading post ', req.params.id);
    return res.json({
        index: req.params.id
    });
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