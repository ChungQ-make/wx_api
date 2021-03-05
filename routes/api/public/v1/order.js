const express = require('express')
const router = express.Router()
const OrderManage = require('../../../../controller/OrderManage')
const tokenObj = require('../../../../utils/token')

// 关于订单的操作的路由

// 创建订单
router.post('/create', tokenObj.verifyToken, (req, res, next) => {
    OrderManage.createOrder(req, res, next)
})

// 获取单个订单详情
router.post('/detail', tokenObj.verifyToken, (req, res, next) => {
    OrderManage.findOrdersInfo(req, res, next)
})

// 获取单个用户全部订单（订单列表）
router.post('/orderList', tokenObj.verifyToken, (req, res, next) => {
    OrderManage.getOrdersList(req, res, next)
})

// 修改订单地址
router.post('/editAddress', tokenObj.verifyToken, (req, res, next) => {
    OrderManage.editAddress(req, res, next)
})

// 订单支付
router.post('/pay', tokenObj.verifyToken, (req, res, next) => {
    OrderManage.OrderPay(req, res, next)
})


module.exports = router