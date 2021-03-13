const express = require('express')
const router = express.Router()
const OrderManage = require('../../../../controller/OrderManage')
const tokenObj = require('../../../../utils/token')

// 关于订单的操作的路由

// 创建订单(0)
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

// 添加描述
router.post('/editDes',tokenObj.verifyToken, (req, res, next) => {
    OrderManage.editDes(req, res, next)
})


// 获取由我的商品创建的订单列表
router.post('/myGoodsOrders',tokenObj.verifyToken,(req,res,next)=>{
    OrderManage.getMyGoodsOrdersByID(req,res,next)
})


// 商家确认发货（1）
router.post('/deliverGoods',tokenObj.verifyToken,(req,res,next)=>{
    OrderManage.deliverGoodsByID(req,res,next)
})

// 用户确认收货（2）
router.post('/takeGoods',tokenObj.verifyToken,(req,res,next)=>{
    OrderManage.takeGoodsByID(req,res,next)
})

// 用户发起退货申请（3）
router.post('/returnGoods',tokenObj.verifyToken,(req,res,next)=>{
    OrderManage.returnGoodsByID(req,res,next)
})

// 商家处理退货申请 
router.post('/agreeReturn',tokenObj.verifyToken,(req,res,next)=>{
    OrderManage.agreeReturn(req,res,next)
})

// 拒绝退货 后状态处理（0-->3-->0 / 2-->3-->2/4）
router.post('/backReturn',tokenObj.verifyToken,(req,res,next)=>{
    OrderManage.backResquest(req,res,next)
})

// 商家确认退货商品，完成退货流程(5)
router.post('/checkGoods',tokenObj.verifyToken,(req,res,next)=>{
    OrderManage.checkGoods(req,res,next)
})



module.exports = router