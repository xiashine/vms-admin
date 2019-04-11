const express = require("express");
const router = express.Router();
const keys = require("../../config/keys");
const Profile = require('../../models/InfoList')
const passport = require("passport");
var path = require('path'); //系统路径模块
var fs = require('fs'); //文件模块
// 信息列表
// $route  GET api/infolist/test
// @desc   返回的请求的json数据
// @access public
router.get('/test',(req,res) => {
	res.json({msg:"成功"})
})

router.get('/userlist',(req,res) => {
	
	
})


module.exports = router;