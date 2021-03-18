/*
 *   创建数据模型（设计表结构） 管理员信息数据结构
 * */
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const adminSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    gender: {
        type: Number,
        enum: [-1, 0, 1],
        default: -1
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: 'admin'
    },
    created_time: {
        type: Date,
        default: Date.now
    },
    status: {
        type: Number,
        // 0 全部权限（超级管理员）
        // 1 不能创建新账号
        // 2 不可以登陆
        enum: [0, 1, 2],
        default: 1
    }
})

module.exports = mongoose.model('Admin', adminSchema)