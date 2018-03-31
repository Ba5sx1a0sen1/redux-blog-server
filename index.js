var express = require('express')
var mongoose = require('mongoose')
var bodyParser = require('body-parser')
var app = express()//创建express示例应用
var port = require('./config').port//服务端口地址
var uri = require('./config').uri//数据库地址
var User = require('./models/user')
var routes = require('./routes')
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

//数据库初始化操作
mongoose.connect(uri)
var db = mongoose.connection
db.on('error',function(err){
    console.log('error',err)
})
db.on('open',function(){
    console.log('success')
    var user = new User({
        username:'houyanna',
        password:'ribi'
    })
    user.save()//保存到mogondb数据库 
})



routes(app)

app.listen(port,function(){
    console.log(`服务器跑在${port}端口`)
})