//主要用于Login登录 register 注册
const express = require("express");
const router = express.Router();
const keys = require("../../config/keys");
const Staff = require('../../models/Staff')
const passport = require("passport");
const formidable = require('formidable');
const fs = require("fs");
const util = require("util");
const sd = require("silly-datetime");
const path = require("path");
const async = require('async');//异步模块


// $route  GET api/staff/test
// @desc   返回的请求的json数据
// @access public
router.get("/text", (req, res) => {
  res.json({ msg: "staff" });
});

// $route  GET api/staff/upload
// @desc   返回的请求的json数据
// @access public
router.post('/upload',(req,res) => {
         //Creates a new incoming form.
				 var form = new formidable.IncomingForm();
				 //设置文件上传存放地址
				 form.uploadDir = "./uploads";
				 /*//执行里面的回调函数的时候，表单已经全部接收完毕了。
				 form.parse(req, function(err, fields, files) {
						//使用第三方模块silly-datetime
						 console.log(files);
						 var t = sd.format(new Date(),'YYYYMMDDHHmmss');
						 //生成随机数
						 var ran = parseInt(Math.random() * 8999 +10000);
						 //拿到扩展名
						 var extname = path.extname(files.file.name);
						 //旧的路径
						 var oldpath =  "./" + files.file.path;
						 //新的路径
						 var newpath = './uploads/'+t+ran+extname;
						 //改名
						 fs.rename(oldpath,newpath,function (err) {
								 if(err){
										console.error(err);	
								 }
						 });

						 //所有的文件域，files
						 res.json({ filepath: newpath});
				 });*/
				 //后缀名
				// form.keepExtensions = true;
				 //保存路径
				 form.parse(req, function(err, fields, files) {
						 //console.log(util.inspect({fields: fields, files: files}));
						 console.log(fields);
						 console.log(files);
						 //files=files.file;//获取bolb文件
						 var chunked = fields.chunked;
						 var index=fields.chunk;//当前片数
						 var total=fields.chunks;//总片数
						 var name=fields.fileName;//文件名称
						 var uid=fields.uid;//文件名称
						 var extname = path.extname(name);
						 console.log(!chunked);
						 var filename = uid+extname;
						 var pathname='./uploads/'+filename;//上传文件存放位置和名称
						 if(!chunked)
						 {
							 console.log('chunked:'+pathname);
							fs.renameSync(files.file.path,pathname);//修改临时文件名字
							return res.json({'code':0,'filepath':filename,'msg':'上传成功'});
						 }
						 var url='./uploads/'+uid+index;//临时bolb文件新名字
						 console.log(url);
						 fs.renameSync(files.file.path,url);//修改临时文件名字
							let  nextindex = Number(index) + 1;
						 
						 if(nextindex==total){//当最后一个分片上传成功，进行合并
										/*
												检查文件是存在，如果存在，重新设置名称
										*/
										fs.access(pathname,fs.F_OK,(err) => {
												if(!err){   
														var myDate=Date.now();
														filename = myDate+uid+extname;
														pathname='./uploads/'+filename;
														console.log(pathname);
		
												}
										});
										//这里定时，是做异步串行，等上执行完后，再执行下面
										setTimeout(function(){
												/*进行合并文件，先创建可写流，再把所有BOLB文件读出来，
														流入可写流，生成文件
														fs.createWriteStream创建可写流   
														aname是存放所有生成bolb文件路径数组:
														['Uploads/img/3G.rar1','Uploads/img/3G.rar2',...]
												*/
												var writeStream=fs.createWriteStream(pathname);
												var aname=[];
												for(var i=0;i<total;i++){
														var url='./uploads/'+uid+i;
														aname.push(url);
												}
		
												//async.eachLimit进行同步处理
												async.eachLimit(aname,1,function(item,callback){
														//item 当前路径， callback为回调函数
														console.log(item)
														fs.readFile(item,function(err,data){    
															 if(err)throw err;
															 //把数据写入流里
																writeStream.write(data);
																//删除生成临时bolb文件              
																fs.unlink(item,function(){console.log('删除成功');})
																callback();
														});
												},function(err){
														if (err) throw err;
														//后面文件写完，关闭可写流文件，文件已经成生完成
														writeStream.end();
														//返回给客服端，上传成功
														res.json({'code':0,'filepath':filename,'msg':'上传成功'});
												});
										},50);
		
						 }else{//还没有上传文件，请继续上传
								res.json({'data':nextindex});
						 }
				 });
});


// $route  POST api/staff/add
// @desc   添加数据内容
// @access public

router.post('/add',passport.authenticate('jwt', { session: false }),(req,res) => {
	const staffInformation = {};
	if(req.body.name) staffInformation.name = req.body.name;
	if(req.body.sex) staffInformation.sex = req.body.sex;
	if(req.body.state) staffInformation.state = req.body.state;
	if(req.body.hobby) staffInformation.hobby = req.body.hobby;
	if(req.body.marriage) staffInformation.marriage = req.body.marriage;
	if(req.body.birthday) staffInformation.birthday = req.body.birthday;
	if(req.body.address) staffInformation.address = req.body.address;
	
	new Staff(staffInformation).save().then(staff => {
    console.log(staff);
    res.json(staff);
  });
})

// $route  GET api/staff
// @desc   获取所有的数据
// @access public

router.get("/", passport.authenticate("jwt", { session: false }),(req,res) => {
	Staff.find().then(staff => {
		if(!staff) {
			return res.status(400).json("没有任何数据存在")
		}
		return res.json(staff)
	}).catch(err => {
		return res.status(404).json(err)
	})
});

// $route  GET api/staff/:id
// @desc   获取单个数据源数据内容
// @access public

router.get("/:id", passport.authenticate("jwt", { session: false }),(req,res) => {
	Staff.findOne({ _id: req.params.id }).then(staff =>{
		if(!staff) {
			return res.status(400).json("数据不存在")
		}
		res.json(staff)
	}).catch(err => {
		return res.status(404).json(err)
	})
});


// $route  POST api/staff/edit/:id
// @desc   编辑个人信息
// @access public

router.post("/edit/:id", passport.authenticate("jwt", { session: false }),(req,res) => {

	const staffInformation = {};
	if (req.body.name) staffInformation.name = req.body.name;
	if (req.body.sex) staffInformation.sex = req.body.sex;
	if (req.body.state) staffInformation.state = req.body.state;
	if (req.body.hobby) staffInformation.hobby = req.body.hobby;
	if (req.body.marriage) staffInformation.marriage = req.body.marriage;
	if (req.body.birthday) staffInformation.birthday = req.body.birthday;
	if (req.body.address) staffInformation.address = req.body.address;
	
	//更新数据内容
	Staff.findByIdAndUpdate({ _id: req.params.id }, { $set: staffInformation }, { new: true })
    .then(staff => {
      if (!staff) {
        return res.status(400).json("数据不存在");
      }
     res.json(staff);
    })
    .catch(err => {
      return res.status(404).json(err);
    });
});


// $route  POST api/staff/delete/:id
// @desc   删除单个信息
// @access public

router.delete("/delete/:id", passport.authenticate("jwt", { session: false }),(req,res) => {

	Staff.findByIdAndRemove({_id:req.params.id}).then(staff =>{
		staff.save().then(staff => {
			res.json(staff)
		})
	}).catch(err => {
		return res.status(404).json(err)
	})

});



module.exports = router;