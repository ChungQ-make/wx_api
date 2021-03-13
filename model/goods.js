/*
*   创建数据模型（设计表结构） 商品信息数据结构
* */
const mongoose = require('mongoose')
const Schema = mongoose.Schema

// 这里改成时间戳的目的是解决服务器重启后counter重置问题
// let counter = 1
let counter = Date.now()
let CountedId = { type: Number, default: () => counter++ }

const goodsSchema = new Schema({
    seller: {
        type: String,
        required: true
    },
    seller_id: {
        type: String,
        required: true
    },
    goods_id: CountedId,
    goods_name: {
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
    goods_imgUrl: {
        type: Array,
        default: ['http://localhost:5000/upload/img/goods_default.png']
    },
    description: {
        type: String,
        default: ''
    },
    goods_price: {
        type: Number,
        required: true
    },
    status: {
        type: Number,
        // 0 正常售出
        // 1 售罄（缺货）
        // 2 暂停售出
        // 3 禁止出售
        // 4 审核中
        // 5 审核不通过
        enum: [0, 1, 2, 3, 4, 5],
        default: 4
    },
    goods_type: {
        type: String,
        required: true
    },
    stocks: {
        // 库存
        type: Number,
        required: true
    },
    pageViews: {
        // 浏览量
        type: Number,
        default: 0
    },
    telNumber: {
        type: String,
        required: true
    }
})

const Model = mongoose.model('Goods', goodsSchema)

Model.find({ id: { $gt: 0 } }).sort({ id: -1 })
    .then(([first, ...others]) => {
        if (first)
            counter = first.id + 1
    })

module.exports = Model

