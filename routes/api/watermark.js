//主要用于Login登录 register 注册
const express = require("express");
const router = express.Router();
const keys = require("../../config/keys");
const Watermark = require('../../models/Watermark')
const passport = require("passport");

// $route  GET api/watermark/test
// @desc   返回的请求的json数据
// @access public
router.get("/text", (req, res) => {
  res.json({ msg: "watermark" });
});

// $route  POST  api/watermark/add
// @desc   添加数据内容
// @access public

router.post('/add', passport.authenticate('jwt', { session: false }),
    (req, res) => {
        const WatermarkFields = {};

        if(req.body.title) WatermarkFields.title = req.body.title;
        if (req.body.in) WatermarkFields.in = req.body.in;
        if (req.body.x) WatermarkFields.x = req.body.x;
        if(req.body.y) WatermarkFields.y = req.body.y;
        if (req.body.position) WatermarkFields.position = req.body.position;
        if (req.body.top) WatermarkFields.top = req.body.top;
        if(req.body.left) WatermarkFields.left = req.body.left;
        if (req.body.right) WatermarkFields.right = req.body.right;
        if (req.body.bottom) WatermarkFields.bottom = req.body.bottom;

        new Watermark(WatermarkFields).save().then(watermark => {
            console.log(watermark)
            res.json(watermark);
        })
    }
);


// $route  GET  api/watermark
// @desc   获取所有内容
// @access public

router.get("/", passport.authenticate("jwt", { session: false }),(req,res) => {
    Watermark.find().then(watermark => {
        if(!watermark) {
            return res.status(404).json("没有任何数据存在")
        }
        res.json(watermark);
    }).catch(err => {
        return res.status(404).json(err)
    })
});

// $route  GET  api/watermark/:id
// @desc   获取所有单个数据内容
// @access public

router.get("/:id", passport.authenticate("jwt", { session: false }),(req,res) => {
    Watermark.findOne({_id: req.params.id}).then(watermark => {
        if(!watermark) {
            return res.status(404).json("数据不存在")
        }
        res.json(watermark)
    }).catch(err =>{
        return res.status(404).json(err)
    })
});

// $route  POST  api/watermark/edit/:id
// @desc   编辑信息
// @access public

router.post('/edit/:id', passport.authenticate('jwt', { session: false }),
    (req, res) => {
        const WatermarkFields = {};

        if(req.body.title) WatermarkFields.title = req.body.title;
        if (req.body.in) WatermarkFields.in = req.body.in;
        if (req.body.x) WatermarkFields.x = req.body.x;
        if(req.body.y) WatermarkFields.y = req.body.y;
        if (req.body.position) WatermarkFields.position = req.body.position;
        if (req.body.top) WatermarkFields.top = req.body.top;
        if(req.body.left) WatermarkFields.left = req.body.left;
        if (req.body.right) WatermarkFields.right = req.body.right;
        if (req.body.bottom) WatermarkFields.bottom = req.body.bottom;

        Watermark.findByIdAndUpdate(
            {_id:req.params.id},
            { $set: WatermarkFields},
            {new:true}
        ).then(watermark => {
            if(!watermark) {
                return res.status(404).json("此信息不存在")
            }
            res.json(watermark)
        }).catch(err => {
            res.status(404).json(err)
        })
    }
);
// $route  POST api/watermark/delete/:id
// @desc   删除单个信息
// @access public

router.delete("/delete/:id", passport.authenticate("jwt", { session: false }),(req,res) => {

	Watermark.findByIdAndRemove({_id:req.params.id}).then(watermark =>{
        console.log(watermark)
		Watermark.save().then(watermark => {
			res.json(watermark)
		})
	}).catch(err => {
		return res.status(404).json(err)
	})

});
module.exports = router;