/*
*   创建数据模型（设计表结构） 聊天模块数据结构
* */
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const commentSchema = new Schema({
    sender: {
        type: String,
        required: true
    },
    recipient: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    created_time: {
        type: Date,
        default: new Date
    },
    last_modified_time: {
        type: Date,
        default: Date.now
    },
    goods_id: {
        type: String,
        required: true
    },
    goods_name: {
        type: String,
        required: true
    }
})


module.exports = mongoose.model('Comment', commentSchema)
