//主要用于Login登录 register 注册
const express = require("express");
const router = express.Router();
const keys = require("../../config/keys");
const Tasks = require('../../models/Tasks')
const Sourceinfo = require('../../models/Sourceinfo')
const passport = require("passport");
const sd = require("silly-datetime");

// $route  GET api/tasks/test
// @desc   返回的请求的json数据
// @access public
router.get("/text", (req, res) => {
  res.json({ msg: "tasks" });
});

// $route  POST  api/tasks/add
// @desc   添加数据内容
// @access public

router.post('/add', passport.authenticate('jwt', { session: false }),
    (req, res) => {
        const TasksFields = {};

        if(req.body.infoid) TasksFields.infoid = req.body.infoid;
        //if (req.body.modelid) TasksFields.modelid = req.body.modelid;
        if (req.body.outpath) TasksFields.outpath = req.body.outpath;
        //console.log(req.body.modelid);
        req.body.modelid.forEach(function(item,index){
            console.log(item+'---'+index);
            TasksFields.modelid = item;
            new Tasks(TasksFields).save();

        })
        const SourceinfoFields = {};
        SourceinfoFields.state  = 1;
        Sourceinfo.findByIdAndUpdate(
            {_id:TasksFields.infoid},
            { $set: SourceinfoFields},
            {new:true}
        ).then(sourceinfo => {
            console.log(sourceinfo)
        }).catch(err => {
            console.log(err)
        })
        res.status(200).json({msg: "发布成功"});
    }
);


// $route  GET  api/tasks
// @desc   获取所有内容
// @access public

router.get("/", passport.authenticate("jwt", { session: false }),(req,res) => {
    Tasks.find()
    .populate({
        path: 'infoid',
        select: '_id title path tags thumb',
        model: 'sourceinfo',
        })
        .populate({
        path: 'modelid',
        select: '_id title bitrate width height format',
        model: 'models'
        })
        .sort({date: -1}).exec(function(err, list) {
            console.log(list)
            res.json(list)
    });
});

// $route  GET  api/tasks/cutlists
// @desc   获取所有内容
// @access public

router.get("/cutlists",(req,res) => {
    Sourceinfo.find({parentid:{$ne:0},state:0})    .populate({
        path: 'parentid',
        select: '_id path',
        model: 'sourceinfo',
        }).then(sourceinfo => {
        console.log(sourceinfo)
        const tasks = []
        sourceinfo.forEach(function(list,index){

            var t = sd.format(new Date(),'YYYYMMDDHHmmss');
			//生成随机数
            var ran = parseInt(Math.random() * 8999 +10000);
                         
            tasks.push({
                "createTime": list.date,
                "id": list._id,
                "in": {
                    "path": list.parentid.path,
                    "starttime":list.starttime,
                    "duration":list.endtime-list.starttime
                },
                "out": {
                    "path": t+ran+'.mp4'
                }
            })
        })
        const taskslists = {
            "code": 0,
            "tasks":tasks
        };
        
        res.json(taskslists);
    }).catch(err => {
        return res.status(404).json(err)
    })
});
// $route  GET  api/tasks/lists
// @desc   获取所有内容
// @access public

router.get("/lists",(req,res) => {
    Tasks.find({"state":"0"})
    .populate({
        path: 'infoid',
        select: '_id title path tags thumb',
        model: 'sourceinfo',
        })
        .populate({
        path: 'modelid',
        select: '_id title bitrate width height format abitrate sampling',
        model: 'models'
        })
        .sort({date: -1}).exec(function(err, lists) {
            const tasks = []
            lists.forEach(function(list,index){
                tasks.push({
                    "createTime": list.date,
                    "id": list._id,
                    "in": {
                        "path": list.infoid.path
                    },
                    "out": {
                        "path": list.infoid.path+'.'+ list.modelid.format
                    },
                    "template": {
                        "format": list.modelid.format,
                        "video": {
                            "bitrate": list.modelid.bitrate,
                            "width": list.modelid.width,
                            "height": list.modelid.height
                        },
                        "audio": {
                            "bitrate": list.modelid.abitrate,
                            "sampling": list.modelid.sampling
                        }
                    }
                })
            })
            const taskslists = {
                "code": 0,
                "tasks":tasks
            };
            res.json(taskslists)
    });
});
// $route  GET  api/tasks/:id
// @desc   获取所有单个数据内容
// @access public

router.get("/:id", passport.authenticate("jwt", { session: false }),(req,res) => {
    Tasks.findOne({_id: req.params.id}).then(tasks => {
        if(!tasks) {
            return res.status(404).json("数据不存在")
        }
        res.json(tasks)
    }).catch(err =>{
        return res.status(404).json(err)
    })
});

// $route  POST  api/tasks/edit/:id
// @desc   编辑信息
// @access public

router.post('/edit/:id',(req, res) => {
        const TasksFields = {};

        if(req.body.infoid) TasksFields.infoid = req.body.infoid;
        if (req.body.modelid) TasksFields.modelid = req.body.modelid;
        if (req.body.outpath) TasksFields.outpath = req.body.outpath;
        if (req.body.percentage) TasksFields.percentage = req.body.percentage;
        if (req.body.time) TasksFields.time = req.body.time;
        if (req.body.duration) TasksFields.duration = req.body.duration;
        if (req.body.size) TasksFields.size = req.body.size;
        if (req.body.state) TasksFields.state = req.body.state;

        Tasks.findByIdAndUpdate(
            {_id:req.params.id},
            { $set: TasksFields},
            {new:true}
        ).then(tasks => {
            if(!tasks) {
                return res.status(404).json("此信息不存在")
            }
            res.json(tasks)
        }).catch(err => {
            res.status(404).json(err)
        })
    }
);

module.exports = router;