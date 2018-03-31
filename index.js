var express = require('express')
var mongoose = require('mongoose')
var app = express()
var port = require('./config').port
var uri = require('./config').uri

var User = require('./models/user')

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


app.get('/api',function(req,res){
    res.send('api running')
})

app.listen(port,function(){
    console.log(`服务器跑在${port}端口`)
})