/*
    负责处理订单数据模块
*/

const Orders = require('../model/orders')
const token = require('../utils/token')
const Goods = require('../model/goods')
const User = require('../model/user')
// 引入lodash插件进行深拷贝
const lodash = require('lodash')

async function createOrder(req, res, next) {
    // console.log(req.token)

    // 02-19 初级方案
    // token.verify(req.token, res, function (authData) {
    //     res.sendResult(authData, 200, 'order is created successful')
    // })

    // 下面这种方法由于会产生二次响应的错误 故不建议使用
    // 解决办法：可以设置一个返回值flag 判断是否验证成功，然后再单独处理对应事件避免重复响应
    // token.verify(req.token, res)
    // res.sendResult(req.token, 200, 'order is created successful')

    // 02-22 改进后的形式（verify只做验证处理，具体操作单独设置，后期改进可以借助promis语法优化（这里没必要））
    // （使用形式1 通过回调函数进行处理）
    // token.verify(req.token, (data, err) => {
    //     if (data) {
    //         res.sendResult(data, 200, 'login success')
    //     } else {
    //         // console.log(err)
    //         res.status(403).json({
    //             status: 403,
    //             msg: '无效token！',
    //             errMsg: err
    //         })
    //     }
    // })

    // （使用形式2 通过状态返回值state处理）
    // const state = token.verify(req.token)
    // state ? res.sendResult(null, 200, '获取成功！') : res.status(403).json({
    //     status: 403,
    //     msg: '无效token！'
    // })
    const state = token.verify(req.token)
    if (!state) {
        return res.status(403).sendResult(null, 403, '无效token！')
    }
    const {formData,totalPrice} = req.body
    if (!formData.length) { return res.sendResult(null, 403, '空数据！') }

    // 记录创建的订单数据
    let orderInfos = []
    formData.forEach(async (item, index) => {
        try {
            let data = await Goods.findOne({ goods_id: item.goods_id }, { stocks: true, status: true })
            // 进行lodash深拷贝
            const goodInfo = lodash.cloneDeep(data)
            // 更新商品的库存和状态
            data.stocks = data.stocks - item.totalNum
            console.log(data.stocks)
            if (data.stocks < 0) {
                return res.sendResult(goodInfo, 1000, '该商品库存不足！')
            } else if (data.status === 1) {
                return res.sendResult(goodInfo, 1000, '该商品库存不足！')
            } else if (data.status === 2) {
                return res.sendResult(goodInfo, 1001, '该商品暂停出售！')
            }
            if (data.stocks === 0) {
                data.status = 1
            }
            console.log(data);
            await Goods.updateOne({ goods_id: item.goods_id }, data)
            const orderInfo = await new Orders(item).save()
            orderInfos.push(orderInfo)
            if (index === formData.length - 1) {
                let { money } = await User.findOne({ openid: item.buyer_id }).lean()
                money = money - totalPrice
                // console.log('money:'+money)
                if (money < 0) {
                    return res.sendResult(goodInfo, 1002, '余额不足！')
                }
                await User.updateOne({ openid: item.buyer_id }, { money })
                res.sendResult({orderInfos,money})
            }
        } catch (err) {
            next(err)
        }
    })
}

async function findOrdersInfo(req, res, next) {
    const state = token.verify(req.token)
    if (!state) {
        return res.status(403).sendResult(null, 403, '无效token！')
    }
    try {
        const { order_id } = req.body
        if (!await Orders.findOne({ order_id }))
            return res.sendResult(null, 403, '该订单不存在！')
        const orderInfos = await Orders.findOne({ order_id })
        res.sendResult(orderInfos)
    } catch (err) {
        next(err)
    }
}

async function getOrdersList(req, res, next) {
    const state = token.verify(req.token)
    if (!state) {
        return res.status(403).sendResult(null, 403, '无效token！')
    }
    const { openid } = req.body
    if (!openid)
        return res.sendResult(null, 403, '缺少(openid)参数！')
    try {
        const orderList = await Orders.find({ buyer_id: openid })
        res.sendResult(orderList)
    } catch (err) {
        next(err)
    }
}

async function editAddress(req, res, next) {
    const state = token.verify(req.token)
    if (!state) {
        return res.status(403).sendResult(null, 403, '无效token！')
    }
    const { order_id, address } = req.body
    if (!order_id || !address) return res.sendResult(null, 403, '缺少参数！')
    try {
        if (!await Orders.findOne({ order_id }))
            return res.sendResult(null, 403, '该订单不存在！')
        await Orders.updateOne({ order_id }, { address })
        const orderInfos = await Orders.findOne({ order_id })
        res.sendResult(orderInfos, 200, '修改订单地址成功！')
    } catch (err) {
        next(err)
    }
}

async function OrderPay(req, res, next) {
    const state = token.verify(req.token)
    if (!state) {
        return res.status(403).sendResult(null, 403, '无效token！')
    }
    try {
        const { order_id, openid } = req.body
        if (!await Orders.findOne({ order_id }))
            return res.sendResult(null, 403, '该订单不存在！')
        const { totalAmount } = await Orders.findOne({ order_id })
        const { money } = await User.findOne({ openid })
        // 更新数据
        money = money - totalAmount
        if (money < 0)
            return res.sendResult(null, 1000, '余额不足！')
        await Orders.updateOne({ order_id }, { status: 1 })
        await User.updateOne({ openid }, { money })
        const OrderList = await Orders.findOne({ order_id })
        const UserInfo = { open }
        res.sendResult({ orderList, openid })
    } catch (err) {
        next(err)
    }
}
module.exports = {
    createOrder, findOrdersInfo, getOrdersList, editAddress, OrderPay
}