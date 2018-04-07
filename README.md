# REDUX博客的后端应用,包括API
## 对应前端的地址为[redux-client](https://github.com/Ba5sx1a0sen1/redux-blog-client)
***
## 技术栈:
1. 数据库采用mgongodb,操作数据库采用mongoose
2. 后端框架采用express
3. 使用bcrypt对信息进行加密
4. 使用jsonwebtoken,multer,body-parser中间件,分别用于处理凭证,文件上传,http请求体解析
***
### API目录
1. 登录 POST /auth/login
    请求:
    ```
        {
            name:'用户名',
            password:'密码'
        }
    ```
    返回:
    ```
        { error: '用户名不存在！' }
        
        { error: '密码错误' }

        {
            user: { name: '用户名', admin: true或者false },
            token: '对应token字符串'
        }

    ```

2. 注册 POST /auth/signup
    请求:
    ```
        {
            name:'用户名',
            password:'密码'
        }
    ```
    返回:
    ```
        {
            user: { name: '用户名'},
            token: '对应token字符串'
        }
    ```

3. 新增文章 POST /posts
    请求:
    ```
        {
            name:'文章标题',
            content:'文章内容',
            cover:图片,是一个file,参考mdn Formdata
        }
    ```
    返回:
    ```
        {
            post: {
                name:'文章名称',
                content:'文章内容',
                cover:'封面地址'
            },
            message: '文章创建成功'
        }
    ```

4. 获取文章列表(标题与封面) GET /posts
    返回:
    ```
        {
            posts: [{
                name:'文章名称',
                content:'文章内容',
                cover:'封面地址'
            },{
                name:'文章名称',
                content:'文章内容',
                cover:'封面地址'
            },
            ...],
            message: '获取所有文章成功'
        }
    ```

5. 查看单篇文章详情 GET /posts/:post_id
    返回:
    ```
        {
            post:{
                name:'文章名称',
                content:'文章内容',
                cover:'封面地址'
            }
        }
    ```

6. 编辑单篇文章详情 PUT /posts/:post_id
    请求体与新增类似
    返回:
    ```
        {
            post:{
                name:'文章名称',
                content:'文章内容',
                cover:'封面地址'
            },
            message: '文章更新成功'
        }
    ```

7. 删除单篇文章 DELETE /posts/:post_id
    返回:
    ```
        {
            id:'被删除文章的id',
            message: '文章已经移除了!'
        }
    ```