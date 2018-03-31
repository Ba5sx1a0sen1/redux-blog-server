var User = require('./models/user')

module.exports = function(app){
    app.post('/auth/login',function(req,res){//mongoose查询接口
        User.findOne({username:req.body.username},(err,user)=>{
            user.comparePassword(req.body.password,(err,isMatch)=>{
                if(!isMatch){return res.status(403).json({error:'密码错误'})}
                return res.json({
                    user:{name:user.username}
                })
            })
        })
    })
}