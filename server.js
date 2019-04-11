const express = require('express');
const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser');
const passport = require("passport"); //验证token
//引入users.js
const users = require('./routes/api/users');
//引入profiles.js
const profiles = require("./routes/api/profiles");
//staff.js
const staff = require("./routes/api/staff");
//sourceinfo.js
const sourceinfo = require("./routes/api/sourceinfo")
//tasks.js
const tasks = require("./routes/api/tasks")
//models.js
const models = require("./routes/api/models")
//watermark.js
const watermark = require("./routes/api/watermark")

//设置跨域访问  
app.all('*', function(req, res, next) {  
	res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
    next();  
});  

app.get('/', (req, res) => {
	res.send('Hello World');
});

// 引入DB config
const db = require('./config/keys').mongoURI;

//使用body-parser中间件
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//链接MongoDB
mongoose
	.connect(
		db,
		{ useNewUrlParser: true }
	)
	.then(() => {
		console.log('MongoDB Connected链接成功');
	})
	.catch(err => console.log(err));

//引入passport初始化
app.use(passport.initialize());
require("./config/passport")(passport);

// 使用routes
app.use('/api/users', users);
app.use("/api/profiles", profiles);
app.use("/api/staff", staff);
app.use("/api/sourceinfo", sourceinfo);
app.use("/api/tasks", tasks);
app.use("/api/models", models);
app.use("/api/watermark", watermark);

const port = process.env.PORT || 5000; //地址

app.listen(port, () => {
	console.log(`Server running on port ${port}`);
});
