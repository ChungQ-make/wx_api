/*
*   创建数据模型（设计表结构）用户信息数据结构
* */
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    openid: {
        type: String,
        required: true
    },
    nickName: {
        type: String,
        required: true
    },
    created_time: {
        type: Date,
        default: Date.now
    },
    last_modified_time: {
        type: Date,
        default: Date.now
    },
    avatarUrl: {
        type: String,
        default: ''
    },
    bio: {
        // 个人简介
        type: String,
        default: ''
    },
    gender: {
        type: Number,
        enum: [-1, 0, 1],
        default: -1
    },
    birthday: {
        type: Date
    },
    status: {
        type: Number,
        // 0 没有权限限制
        // 1 不可以售卖商品
        // 2 不可以登录
        enum: [0, 1, 2],
        default: 0
    },
    city: {
        type: String,
        default: ''
    },
    province: {
        type: String,
        default: ''
    },
    country: {
        type: String,
        default: ''
    },
    email: {
        type: String,
        default: ''
    },
    money: {
        type: Number,
        default: 1000
    },
    goodsCollection: {
        // // 商品收藏 存储商品的id
        // 这里改成联系人列表
        type: Array,
        default: []
    },
    language: {
        type: String,
        default: ''
    }

})


module.exports = mongoose.model('User', userSchema)
