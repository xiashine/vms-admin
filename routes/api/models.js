//主要用于Login登录 register 注册
const express = require("express");
const router = express.Router();
const keys = require("../../config/keys");
const Models = require('../../models/Models')
const passport = require("passport");

// $route  GET api/models/test
// @desc   返回的请求的json数据
// @access public
router.get("/text", (req, res) => {
  res.json({ msg: "models" });
});

// $route  POST  api/models/add
// @desc   添加数据内容
// @access public

router.post('/add', passport.authenticate('jwt', { session: false }),
    (req, res) => {
        const ModelsFields = {};

        if(req.body.title) ModelsFields.title = req.body.title;
        if (req.body.video) ModelsFields.video = req.body.video;
        if (req.body.bitrate) ModelsFields.bitrate = req.body.bitrate;
        if(req.body.width) ModelsFields.width = req.body.width;
        if (req.body.height) ModelsFields.height = req.body.height;
        if (req.body.audio) ModelsFields.audio = req.body.audio;
        if(req.body.abitrate) ModelsFields.abitrate = req.body.abitrate;
        if (req.body.sampling) ModelsFields.sampling = req.body.sampling;
        if (req.body.format) ModelsFields.format = req.body.format;
        if (req.body.watermarkid) ModelsFields.watermarkid = req.body.watermarkid;

        new Models(ModelsFields).save().then(models => {
            console.log(models)
            res.json(models);
        })
    }
);


// $route  GET  api/models
// @desc   获取所有内容
// @access public

router.get("/", passport.authenticate("jwt", { session: false }),(req,res) => {
    Models.find().then(models => {
        if(!models) {
            return res.status(404).json("没有任何数据存在")
        }
        res.json(models);
    }).catch(err => {
        return res.status(404).json(err)
    })
});

// $route  GET  api/models/:id
// @desc   获取所有单个数据内容
// @access public

router.get("/:id", passport.authenticate("jwt", { session: false }),(req,res) => {
    Models.findOne({_id: req.params.id}).then(models => {
        if(!models) {
            return res.status(404).json("数据不存在")
        }
        res.json(models)
    }).catch(err =>{
        return res.status(404).json(err)
    })
});

// $route  POST  api/models/edit/:id
// @desc   编辑信息
// @access public

router.post('/edit/:id', passport.authenticate('jwt', { session: false }),
    (req, res) => {
        const ModelsFields = {};

        if(req.body.title) ModelsFields.title = req.body.title;
        if (req.body.video) ModelsFields.video = req.body.video;
        if (req.body.bitrate) ModelsFields.bitrate = req.body.bitrate;
        if(req.body.width) ModelsFields.width = req.body.width;
        if (req.body.height) ModelsFields.height = req.body.height;
        if (req.body.audio) ModelsFields.audio = req.body.audio;
        if(req.body.abitrate) ModelsFields.abitrate = req.body.abitrate;
        if (req.body.sampling) ModelsFields.sampling = req.body.sampling;
        if (req.body.format) ModelsFields.format = req.body.format;
        if (req.body.watermarkid) ModelsFields.watermarkid = req.body.watermarkid;

        Models.findByIdAndUpdate(
            {_id:req.params.id},
            { $set: ModelsFields},
            {new:true}
        ).then(models => {
            if(!models) {
                return res.status(404).json("此信息不存在")
            }
            res.json(models)
        }).catch(err => {
            res.status(404).json(err)
        })
    }
);

// $route  POST api/models/delete/:id
// @desc   删除单个信息
// @access public

router.delete("/delete/:id", passport.authenticate("jwt", { session: false }),(req,res) => {

	Models.findByIdAndRemove({_id:req.params.id}).then(models =>{
		Models.save().then(models => {
			res.json(models)
		})
	}).catch(err => {
		return res.status(404).json(err)
	})

});

module.exports = router;