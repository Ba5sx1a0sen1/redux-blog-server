var express = require('express')
var mongoose = require('mongoose')
var bodyParser = require('body-parser')
var morgan = require('morgan')
var path = require('path')
var app = express()//创建express实例应用
var port = require('./config').port//服务端口地址
var uri = require('./config').uri//数据库地址
var User = require('./models/user')
var routes = require('./routes')

//使用morgan中间件，body-parser中间件，设置CORS响应头
app.use(morgan('dev'))
app.use(express.static(path.join(__dirname,'public')))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization')
    res.setHeader('Access-Control-Allow-Credentials', true);
    next()
})


//数据库初始化操作
mongoose.connect(uri)
var db = mongoose.connection
db.on('error', function (err) {
    console.log('error', err)
})
db.on('open', function () {
    console.log('success')
    // var user = new User({
    //     username: 'bass',
    //     password: '123'
    // })
    // user.save()//保存到mogondb数据库 
})

routes(app)//调用路由配置

app.listen(port, function () {
    console.log(`服务器跑在${port}端口`)
})