/*
   * 负责处理订单数据模块
*/

const Orders = require('../model/orders')
const token = require('../utils/token')
const Goods = require('../model/goods')
const User = require('../model/user')
const fs = require('fs')
const path = require('path')
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
    const { formData, totalPrice } = req.body
    if (!formData.length) { return res.sendResult(null, 404, '空数据！') }

    // 记录创建的订单数据
    let orderInfos = []
    formData.forEach(async (item, index) => {
        try {
            let data = await Goods.findOne({ goods_id: item.goods_id }, { stocks: true, status: true })
            // 进行lodash深拷贝
            const goodInfo = lodash.cloneDeep(data)
            // 更新商品的库存和状态
            data.stocks = data.stocks - item.totalNum
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
            await Goods.updateOne({ goods_id: item.goods_id }, data)
            const orderInfo = await new Orders(item).save()
            if (index === formData.length - 1) {
                let { money } = await User.findOne({ openid: item.buyer_id }).lean()
                money = money - totalPrice
                // console.log('money:'+money)
                if (money < 0) {
                    return res.sendResult(goodInfo, 1002, '余额不足！')
                }
                await User.updateOne({ openid: item.buyer_id }, { money })
                res.sendResult({ orderInfos, money })
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
        if (order_id === undefined) {
            return res.sendResult(null, 202, '缺少参数！')
        }
        if (!await Orders.findOne({ order_id }))
            return res.sendResult(null, 404, '该订单不存在！')
        const orderInfos = await Orders.findOne({ order_id })
        res.sendResult(orderInfos)
    } catch (err) {
        next(err)
    }
}

// 获取指定用户的订单
async function getOrdersList(req, res, next) {
    const state = token.verify(req.token)
    if (!state) {
        return res.status(403).sendResult(null, 403, '无效token！')
    }
    const { openid, status } = req.body
    if (openid === undefined) {
        return res.sendResult(null, 202, '缺少(openid)参数！')
    }
    try {
        if (status === undefined) {
            const orderList = await Orders.find({ buyer_id: openid })
            res.sendResult(orderList)
        } else {
            const orderList = await Orders.find({
                $and: [
                    { buyer_id: openid }, { status }
                ]
            })
            res.sendResult(orderList)
        }
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
    if (order_id === undefined || address === undefined) return res.sendResult(null, 202, '缺少参数！')
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
            return res.sendResult(null, 404, '该订单不存在！')
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


async function editDes(req, res, next) {
    const state = token.verify(req.token)
    if (!state) {
        return res.status(403).sendResult(null, 403, '无效token！')
    }
    const { order_id, description } = req.body
    if (order_id === undefined || description === undefined) {
        return res.sendResult(null, 202, '缺少参数！')
    }
    try {
        await Orders.updateOne({ order_id }, { description })
        res.sendResult(null, 200, 'update description success！')
    } catch (err) {
        next(err)
    }
}

// 获取由我的商品创建的订单列表
async function getMyGoodsOrdersByID(req, res, next) {
    const state = token.verify(req.token)
    if (!state) {
        return res.status(403).sendResult(null, 403, '无效token！')
    }
    const { seller_id } = req.body
    if (seller_id === undefined) {
        return res.sendResult(null, 202, '缺少参数')
    }
    try {
        const data = await Orders.find({ seller_id })
        res.sendResult(data)
    } catch (err) {
        next(err)
    }
}

// 商家发货 状态变更为待收货状态（1）
async function deliverGoodsByID(req, res, next) {
    const state = token.verify(req.token)
    if (!state) {
        return res.status(403).sendResult(null, 403, '无效token！')
    }
    const { order_id } = req.body
    if (order_id === undefined) {
        return res.status(404).sendResult(null, 202, '缺少参数')
    }
    try {
        const data = await Orders.updateOne({ order_id }, { status: 1 })
        res.sendResult(data)
    } catch (err) {
        next(err)
    }
}

// 用户确认收货（2）
async function takeGoodsByID(req, res, next) {
    const state = token.verify(req.token)
    if (!state) {
        return res.status(403).sendResult(null, 403, '无效token！')
    }
    const { order_id, seller_id } = req.body
    if (order_id === undefined || seller_id === undefined) {
        return res.status(404).sendResult(null, 202, '缺少参数')
    }
    try {
        const sellerInfos = await User.findOne({ openid: seller_id })
        if (!sellerInfos) {
            return res.sendResult(sellerInfos, 204, '查无此商家信息，无法执行操作')
        }
        // 更新订单状态 商家获取所得金额
        const data = await Orders.updateOne({ order_id }, { status: 2 })
        let { totalPrice } = await Orders.findOne({ order_id })
        let { money } = await User.findOne({ openid: seller_id }).lean()
        money += totalPrice
        await User.updateOne({ openid: seller_id }, { money })
        res.sendResult(data, 200, '已确认收货')
    } catch (err) {
        next(err)
    }
}

// 用户发起退货申请（3）
async function returnGoodsByID(req, res, next) {
    const state = token.verify(req.token)
    if (!state) {
        return res.status(403).sendResult(null, 403, '无效token！')
    }
    const { order_id } = req.body
    if (order_id === undefined) {
        return res.status(404).sendResult(null, 202, '缺少参数')
    }
    try {
        const data = await Orders.updateOne({ order_id }, { status: 3 })
        res.sendResult(data)
    } catch (err) {
        next(err)
    }
}

// 商家处理退货申请 进入退货中状态
async function agreeReturn(req, res, next) {
    const state = token.verify(req.token)
    if (!state) {
        return res.status(403).sendResult(null, 403, '无效token！')
    }
    const { order_id } = req.body
    if (order_id === undefined) {
        return res.status(404).sendResult(null, 202, '缺少参数')
    }
    try {
        const data = await Orders.updateOne({ order_id }, { status: 4 })
        res.sendResult(data)
    } catch (err) {
        next(err)
    }
}

// 拒绝退货后 根据 status 返回至原来状态（0-->3-->0 / 2-->3-->2/4）
async function backResquest(req, res, next) {
    const state = token.verify(req.token)
    if (!state) {
        return res.status(403).sendResult(null, 403, '无效token！')
    }
    // 这里传过来的 status 判断原来的订单状态
    const { order_id, status } = req.body
    if (order_id === undefined || status === undefined) {
        return res.status(404).sendResult(null, 202, '缺少参数')
    }
    try {
        const data = await Orders.updateOne({ order_id }, { status })
        res.sendResult(data)
    } catch (err) {
        next(err)
    }
}



// 商家确认退货商品，完成退货流程
async function checkGoods(req, res, next) {
    const state = token.verify(req.token)
    if (!state) {
        return res.status(403).sendResult(null, 403, '无效token！')
    }
    const { order_id, seller_id, buyer_id } = req.body
    if (order_id === undefined || seller_id === undefined || buyer_id === undefined) {
        return res.status(404).sendResult(null, 202, '缺少参数')
    }
    try {
        // 更改订单状态 同时更新商家和买家的账户金额
        const { totalPrice } = await Orders.find({ order_id })
        const data = await Orders.updateOne({ order_id }, { status: 5 })
        let sellerData = await User.findOne({ openid: seller_id })
        let buyerData = await User.findOne({ openid: buyer_id })
        buyerData.money += totalPrice
        sellerData.money -= totalPrice
        await User.updateOne({ openid: seller_id }, sellerData)
        await User.updateOne({ openid: buyer_id }, buyerData)
        res.sendResult(data, 200, '完成退货')
    } catch (err) {
        next(err)
    }
}


// 管理员获取所有订单列表
async function getAllOrderList(req, res, next) {
    const state = token.verify(req.token)
    if (!state) {
        return res.status(403).sendResult(null, 403, '无效token！')
    }

    let { query, pagenum, pagesize } = req.query
    query = query.trim()
    pagenum = pagenum === undefined ? 0 : pagenum - 1
    pagesize = pagesize === undefined ? 8 : pagesize
    const skip = pagenum * pagesize * 1

    try {
        // 通过判断query转成Number的数值型后的数据  来选择查询方式（这里混合查询）
        if (query * 1) {
            query = query * 1
            const orderList = await Orders.find({ order_id: query }).limit(pagesize * 1).skip(skip)
            const total = await Orders.find({ order_id: query }).countDocuments()
            const pageCounts = Math.ceil(total / pagesize)
            res.sendResult({
                orderList,
                total,
                pagenum: pagenum * 1,
                pagesize: pagesize * 1,
                pageCounts
            })
        } else {
            const reg = new RegExp(query, "gi")
            const orderList = query ? await Orders.find({
                $or: [
                    { buyer_name: reg },
                    { goods_name: reg }
                ]
            }).limit(pagesize * 1).skip(skip)
                : await Orders.find({}).limit(pagesize * 1).skip(skip)

            const total = query ? await Orders.find({
                $or: [
                    { buyer_name: reg },
                    { goods_name: reg }
                ]
            }).countDocuments()
                : await Orders.find({}).countDocuments()
            const pageCounts = Math.ceil(total / pagesize)
            res.sendResult({
                orderList,
                total,
                pagenum: pagenum * 1,
                pagesize: pagesize * 1,
                pageCounts
            })
        }
    } catch (err) {
        next(err)
    }
}

// * 获取全国地址五级联动数据(组件数据对应不一致 该api作废)
function getAddressList(req, res, next) {
    const state = token.verify(req.token)
    if (!state) {
        return res.status(403).sendResult(null, 403, '无效token！')
    }
    const file = path.join(__dirname, '../utils/json/cityData.json')
    fs.readFile(file, 'utf-8', function (err, data) {
        if (err) {
            res.sendResult(null, 500, '文件读取失败')
        } else {
            res.sendResult(JSON.parse(data))
        }
    })
}


async function updateOrderInfo(req, res, next) {
    const state = token.verify(req.token)
    if (!state) {
        return res.status(403).sendResult(null, 403, '无效token！')
    }
    let { editOrderInfo } = req.body
    const { order_id } = editOrderInfo
    try {
        const data = await Orders.updateOne({ order_id }, editOrderInfo)
        res.sendResult(data, 200, '成功修改订单信息！')
    } catch (err) {
        next(err)
    }
}

// 管理员删除订单
async function deleteOrder(req, res, next) {
    const state = token.verify(req.token)
    if (!state) {
        return res.status(403).sendResult(null, 403, '无效token！')
    }
    const { order_id } = req.body
    if (order_id === undefined) {
        return res.status(404).sendResult(null, 202, '缺少参数')
    }
    try {
        const data = await Orders.deleteOne({ order_id })
        res.sendResult(data, 200, '删除成功！')
    } catch (err) {
        next(err)
    }
}


// 后台更改订单状态
async function editOrderState(req,res,next){
    const state = token.verify(req.token)
    if (!state) {
        return res.status(403).sendResult(null, 403, '无效token！')
    }
    const {order_id,status} = req.body
    try {
        const data = await Orders.updateOne({ order_id }, {status})
        res.sendResult(data, 200, '成功修改商品状态！')
    } catch (err) {
        next(err)
    }
}




module.exports = {
    createOrder, findOrdersInfo, getOrdersList, editAddress, OrderPay, editDes,
    getMyGoodsOrdersByID, deliverGoodsByID, returnGoodsByID, takeGoodsByID,
    backResquest, agreeReturn, checkGoods, getAllOrderList, getAddressList,
    updateOrderInfo, deleteOrder,editOrderState
}