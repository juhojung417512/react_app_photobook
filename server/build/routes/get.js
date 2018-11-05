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

router.get('/photos', async function (req, res) {
    var photo_list = await _sqlmgr2.default.getPhotos();
    var list = [];
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = photo_list[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var p = _step.value;

            list.push({ id: p.id, src: p.src, size: { width: p.width, height: p.height } });
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }

    return res.json({
        photoList: list
    });
});

router.get('/stickers', async function (req, res) {
    var sticker_list = await _sqlmgr2.default.getStickers();
    var list = [];
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
        for (var _iterator2 = sticker_list[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var s = _step2.value;

            list.push({ id: s.id, src: s.src, size: { width: s.width, height: s.height } });
        }
    } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion2 && _iterator2.return) {
                _iterator2.return();
            }
        } finally {
            if (_didIteratorError2) {
                throw _iteratorError2;
            }
        }
    }

    return res.json({
        stickerList: list.length === 0 ? null : list
    });
});

router.get('/templates', async function (req, res) {
    var template_list = await _sqlmgr2.default.getTemplates();
    return res.json({
        templateList: template_list.length === 0 ? null : template_list
    });
});

router.get('/template/:id', async function (req, res) {
    var template = await _sqlmgr2.default.getTemplateById(req.params.id);
    return res.json({
        template: template
    });
});

exports.default = router;