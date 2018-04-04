var User = require('./models/user')//引入User的Model，要通过接口进行对数据库的操作，如增删改查
var jwt = require('jsonwebtoken')
var secret = require('./config').secret

var generateToken = function (user) {
    return jwt.sign(user, secret, {
        expiresIn: 3000
    })
}

module.exports = function (app) {
    app.post(`/auth/login`, function (req, res) {//mongoose查询接口
        User.findOne({ username: req.body.username }, (err, user) => {//只查询一个
            if (err) { return console.log(err) }
            if (!user) { return res.status(403).json({ error: '用户名不存在！' }) }

            //查询到数据后进行的操作
            user.comparePassword(req.body.password, (err, isMatch) => {
                if (err) { return console.log(err) }

                if (!isMatch) { return res.status(403).json({ error: '密码错误' }) }
                return res.json({
                    user: { name: user.username,admin:user.admin  },
                    token: generateToken({ name: user.username,admin:user.admin })
                })
            })
        })
    })

    app.post('/auth/signup', function (req, res) {
        var user = new User()
        user.username = req.body.username
        user.password = req.body.password
        user.save(function (err) {
            if (err) { return console.log(err) }
            return res.json({
                user: { name: user.username},
                token: generateToken({ name: user.username })
            })
        })
    })
}