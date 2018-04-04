var mongoose = require('mongoose')
var Schema = mongoose.Schema

var PostSchema = new Schema({
    name:{type:String},
    content:{type:String}
},{
    timestamps:true
})

module.exports = mongoose.model('Post',PostSchema)