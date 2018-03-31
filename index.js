var express = require('express')
var app = express()
var port = require('./config').port

app.get('/api',function(req,res){
    res.write('api running')
})

app.listen(port,function(){
    console.log(`服务器跑在${port}端口`)
})