const express = require('express')
const router = express.Router()
const token = require('../../../../utils/token_forAdmin')
const OrderManage = require('../../../../controller/OrderManage')

router.get('/list',token.verifyToken,(req, res, next) => {
    OrderManage.getAllOrderList(req,res,next)
})

// * 获取全国地址五级联动数据(组件数据对应不一致 该api作废)
router.get('/address',token.verifyToken,(req, res, next) => {
    OrderManage.getAddressList(req,res,next)
})

// 更新订单数据
router.post('/update',token.verifyToken,(req, res, next) => {
    OrderManage.updateOrderInfo(req,res,next)
})

// 删除订单
router.post('/delete',token.verifyToken,(req, res, next) => {
    OrderManage.deleteOrder(req,res,next)
})

// 删除订单
router.post('/state',token.verifyToken,(req, res, next) => {
    OrderManage.editOrderState(req,res,next)
})


module.exports = router