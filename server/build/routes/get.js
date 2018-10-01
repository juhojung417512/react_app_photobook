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