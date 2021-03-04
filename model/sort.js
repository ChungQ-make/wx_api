/*
*   创建数据模型（设计表结构） 分类信息数据结构
* */
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const sortSchema = new Schema({
    sort_name: {
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
    description: {
        type: String,
        default: ''
    },
    category_imgUrl: {
        type: String,
        default: 'http://localhost:5000/upload/img/catitems/goods_categories.png'
    },
    category_show: {
        type: Boolean,
        default: true
    }
})

module.exports = mongoose.model('Sort', sortSchema)
