/*
*   创建数据模型（设计表结构） 分类信息数据结构
* */
const mongoose = require('mongoose')
const Schema = mongoose.Schema

let counter = Date.now()
let CountedId = { type: Number, default: () => counter++ }

const ordersSchema = new Schema({
    order_id: CountedId,
    goods_name: {
        type: String,
        required: true
    },
    goods_id: {
        type: Number,
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
    address: {
        type: String,
        required: true
    },
    seller_id: {
        type: String,
        required: true
    },
    buyer_id: {
        type: String,
        required: true
    },
    seller_name: {
        type: String,
        required: true
    },
    buyer_name: {
        type: String,
        required: true
    },
    status: {
        type: Number,
        enum: [0, 1, 2, 3, 4],
        // 0 已支付
        // 1 交易中
        // 2 交易完成
        // 3 退货处理中
        // 4 退货完成
        default: 0
    },
    totalPrice: {
        type: Number,
        required: true
    },
    totalNum: {
        type: Number,
        required: true
    },
    goods_price: {
        type: Number,
        required: true
    }

})


const Model = mongoose.model('Orders', ordersSchema)

Model.find({ id: { $gt: 0 } }).sort({ id: -1 })
    .then(([first, ...others]) => {
        if (first)
            counter = first.id + 1
    })

module.exports = Model