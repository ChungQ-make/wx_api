// 商品信息操作路由
const express = require('express')
const router = express.Router()
const GoodsManage = require('../../../../controller/GoodsManage')
const tokenObj = require('../../../../utils/token')

// 商品详情
router.get('/detail', (req, res, next) => {
    GoodsManage.getGoodsInfo(req, res, next)
})

// 商品列表
router.get('/goodsList', (req, res, next) => {
    GoodsManage.getGoodsList(req, res, next)
})

// 商品搜索
router.get('/search', (req, res, next) => {
    GoodsManage.SearchGoodsList(req, res, next)
})

// (用户进行)商品添加
router.post('/addGoods',tokenObj.verifyToken,(req, res, next) => {
    GoodsManage.addGoods(req, res, next)
})


module.exports = router