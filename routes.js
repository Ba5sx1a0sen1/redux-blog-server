var User = require('./models/user')//引入User的Model，要通过接口进行对数据库的操作，如增删改查
var Post = require('./models/post')
var jwt = require('jsonwebtoken')
var secret = require('./config').secret
var multer = require('multer')
var upload = multer({ dest: './public/uploads/posts' })

var generateToken = function (user) {
    return jwt.sign(user, secret, {
        expiresIn: 3000
    })
}

var requireAuth = function (req, res, next) {//自己编写管理员验证中间件
    var token = req.headers.authorization
    if (token) {
        jwt.verify(token, secret, function (err, decoded) {
            if (err) {
                if (err.name === 'TokenExpiredError') {
                    return res.status(401).json({ error: '认证码失效,请重新登录!' })
                } else {
                    return res.status(401).json({ error: '认证失败!' })
                }
            } else {
                if (decoded.admin === true) {
                    next()//执行下一步操作(中间件)
                } else {
                    res.status(401).json({ error: '认证失败!您不是管理员!' })
                }
            }
        })
    } else {
        return res.status(403).json({
            error: '请提供认证码!'
        })
    }
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
                    user: { name: user.username, admin: user.admin },
                    token: generateToken({ name: user.username, admin: user.admin })
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
                user: { name: user.username },
                token: generateToken({ name: user.username })
            })
        })
    })

    app.post('/posts', requireAuth, upload.single('post'), function (req, res) {
        var post = new Post()
        console.log(req.body)
        if (req.file && req.file.filename) {
            post.cover = req.file.filename
        }
        post.name = req.body.name
        post.content = req.body.content
        post.save(function (err) {
            if (err) return console.log(err)
            res.json({
                post: post,
                message: '文章创建成功'
            })
        })
    })

    app.get('/posts', function (req, res) {
        Post.find({}, 'name cover', function (err, posts) {
            if (err) return console.log(err)
            res.json({
                posts: posts,
                message: '获取所有文章成功'
            })
        })
    })

    app.get('/posts/:post_id', function (req, res) {
        Post.findById({ _id: req.params.post_id }, function (err, post) {
            if (err) return res.status(422).json({ error: err.message })
            res.json({ post: post })
        })
    })

    app.put('/posts/:post_id', requireAuth, upload.single('post'), function (req, res) {
        Post.findById({ _id: req.params.post_id }, function (err, post) {
            if (err) return res.status(422).json({ error: err.message });
            post.name = req.body.name;
            post.content = req.body.content;
            if (req.file && req.file.filename) {
                post.cover = req.file.filename;
            }
            post.save(function (err) {
                if (err) return res.status(422).json({ error: err.message });
                res.json({
                    post: post,
                    message: '文章更新成功了！'
                });
            });
        });
    })

    app.delete('/posts/:post_id', requireAuth, function (req, res) {
        var id = req.params.post_id;
        Post.findById({ _id: id }, function (err, post) {
            post.remove(function (err) {
                if (err) return res.status(422).json({ error: err.message });
                res.json({
                    id: id,
                    message: '文章已经移除了！'
                });
            });
        });
    })

}