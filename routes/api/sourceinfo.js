//主要用于Login登录 register 注册
const express = require("express");
const router = express.Router();
const keys = require("../../config/keys");
const Sourceinfo = require('../../models/Sourceinfo')
const passport = require("passport");
const Models = require('../../models/Models')

// $route  GET api/sourceinfo/test
// @desc   返回的请求的json数据
// @access public
router.get("/text", (req, res) => {
  res.json({ msg: "sourceinfo" });
});

// $route  POST  api/sourceinfo/add
// @desc   添加数据内容
// @access public

router.post('/add', passport.authenticate('jwt', { session: false }),
    (req, res) => {
        const SourceinfoFields = {};

        if(req.body.title) SourceinfoFields.title = req.body.title;
        if (req.body.path) SourceinfoFields.path = req.body.path;
        if (req.body.tags) SourceinfoFields.tags = req.body.tags;
        if (req.body.state) SourceinfoFields.state = req.body.state;
        if (req.body.thumb) SourceinfoFields.thumb = req.body.thumb;
        if (req.body.parentid) SourceinfoFields.parentid = req.body.parentid;
        if (req.body.starttime) SourceinfoFields.starttime = req.body.starttime;
        if (req.body.endtime) SourceinfoFields.endtime = req.body.endtime;

        new Sourceinfo(SourceinfoFields).save().then(sourceinfo => {
            console.log(sourceinfo)
            res.json(sourceinfo);
        })
    }
);


// $route  GET  api/sourceinfo
// @desc   获取所有内容
// @access public

router.get("/", passport.authenticate("jwt", { session: false }),(req,res) => {
    Sourceinfo.find({"parentid":"0"}).then(sourceinfo => {
        if(!sourceinfo) {
            return res.status(404).json("没有任何数据存在")
        }
        res.json(sourceinfo);
    }).catch(err => {
        return res.status(404).json(err)
    })
});


// $route  GET  api/sourceinfo/lists
// @desc   获取所有内容
// @access public

router.get("/list/:id", passport.authenticate("jwt", { session: false }),(req,res) => {
    Sourceinfo.find({parentid:req.params.id}).then(sourceinfo => {
        if(!sourceinfo) {
            return res.status(404).json("没有任何数据存在")
        }
        res.json(sourceinfo);
    }).catch(err => {
        return res.status(404).json(err)
    })
});

// $route  GET  api/sourceinfo/:id
// @desc   获取所有单个数据内容
// @access public

router.get("/:id", passport.authenticate("jwt", { session: false }),(req,res) => {
    Sourceinfo.findOne({_id: req.params.id}).then(sourceinfo => {
        if(!sourceinfo) {
            return res.status(404).json("数据不存在")
        }
        res.json(sourceinfo)
    }).catch(err =>{
        return res.status(404).json(err)
    })
});

// $route  POST  api/sourceinfo/edit/:id
// @desc   编辑信息
// @access public

router.post('/edit/:id', (req, res) => {
        const SourceinfoFields = {};

        if(req.body.title) SourceinfoFields.title = req.body.title;
        if (req.body.path) SourceinfoFields.path = req.body.path;
        if (req.body.tags) SourceinfoFields.tags = req.body.tags;
        if (req.body.state) SourceinfoFields.state = req.body.state;
        if (req.body.thumb) SourceinfoFields.thumb = req.body.thumb;

        Sourceinfo.findByIdAndUpdate(
            {_id:req.params.id},
            { $set: SourceinfoFields},
            {new:true}
        ).then(sourceinfo => {
            if(!sourceinfo) {
                return res.status(404).json("此信息不存在")
            }
            //状态发布完
            if(SourceinfoFields.state == 3)
            {
                const TasksFields = {};
                TasksFields.infoid = req.params.id;
                Models.find().then(models => {
                    if(models) {
                        models.forEach(function(item,index){
                            TasksFields.modelid = item._id;
                            new Tasks(TasksFields).save();
                        })
                    }
                }).catch(err => {
                    console.log(err)
                })
            }
            res.json(sourceinfo)
        }).catch(err => {
            res.status(404).json(err)
        })
    }
);

// $route  GET  api/sourceinfo/delete/:id
// @desc   获取所有单个数据内容
// @access public

router.delete("/delete/:id", passport.authenticate("jwt", { session: false }), (req, res) => {
    Sourceinfo.findByIdAndRemove({_id:req.params.id}).then(sourceinfo =>{
        sourceinfo.save().then(sourceinfo => res.json(sourceinfo));
    }).catch(err => {
        return res.status(404).json(err)
    })
});

module.exports = router;