const express = require('express')
const router = express.Router()
const token = require('../../../../utils/token_forAdmin')
const GoodsManage = require('../../../../controller/GoodsManage')

// 获取审核列表
router.get('/audit',token.verifyToken,(req, res, next) => {
    GoodsManage.getAuditData(req,res,next)
})

// 处理审核事件
router.post('/audit',token.verifyToken,(req, res, next) => {
    GoodsManage.goodsAudit(req,res,next)
})

// 获取所有商品列表（所有状态）
router.get('/list',token.verifyToken,(req, res, next) => {
    GoodsManage.getAllGoodsList(req,res,next)
})

// 管理员获取指定商品信息
router.get('/detail',token.verifyToken,(req, res, next) => {
    GoodsManage.getGoodsDetail(req,res,next)
})

// 更管理员新商品信息
router.post('/update',token.verifyToken,(req, res, next) => {
    GoodsManage.updateGoodsInfos(req,res,next)
})

// 管理员删除
router.post('/delete',token.verifyToken,(req, res, next) => {
    GoodsManage.deleteGoodsByID(req,res,next)
})

// 管理员更改商品状态
router.post('/state',token.verifyToken,(req, res, next) => {
    GoodsManage.editState(req,res,next)
})
module.exports = router