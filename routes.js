module.exports = function(app){
    app.get('/api',function(req,res){
        res.send('api running')
    })
    app.post('/printname',function(req,res){
        res.send(req.body)
    })
}