var mongoose = require('mongoose')
var bcrypt = require('bcrypt')

var Schema = mongoose.Schema

var UserSchema = new Schema({
    username:{type:String,unique:true,required:true},
    password:{type:String,required:true}
},{
    timestamps:true//添加创建时间与修改时间，由mongoose辅助创建
})

UserSchema.pre('save',function(next){//save的前置钩子
    var user = this,SALT_FACTOR=5//定义变量，和加盐程度
    bcrypt.genSalt(SALT_FACTOR,function(err,salt){//生成盐
        if(err) return next(err)
        bcrypt.hash(user.password,salt,function(err,hash){//哈希运算
            if(err) return next(err)
            user.password = hash;//替换原来密码为哈希
            next()
        })
    })
})

UserSchema.methods.comparePassword = function(password,callback){//第一个密码是客户端发送的密码
    bcrypt.compare(password,this.password,(err,isMatch)=>{//第一个密码是客户端发送的密码，第二个是加密后的密码，由bcrypt进行比较
        if(err){return callback(err)}
        callback(null,isMatch)
    })
}

module.exports = mongoose.model('User',UserSchema)//导出User的model
//转变为users collection users集合