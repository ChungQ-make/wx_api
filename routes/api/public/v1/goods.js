// 商品信息操作路由
const express = require('express')
const router = express.Router()
const GoodsManage = require('../../../../controller/GoodsManage')
const tokenObj = require('../../../../utils/token')
const upload = require('../../../../utils/upload')
const uploadObj = upload.uploadSetting('./upload/img/goods', 'img', 8, ['.png', '.jpg', '.bmp','.jpeg'])

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



// 使用中间件检错
router.post('/upload',
    uploadMiddleware,
    (req, res, next) => {
        const files = req.files
        res.json({
            err_code: 0,
            data: {
                url: files[0].path
            },
            message: '文件上传成功！'
        })
    })


// 自定义中间件进行检错
function uploadMiddleware(req, res, next) {
    uploadObj(req, res, function (err) {
        if (err) {
            res.json({
                err_code: 1,
                msg: '文件上传失败',
                err: err.toString()
            })
            // next(err)
        } else {
            next()
        }
    })
}

// 获取指定用户商品列表
router.post('/getMyGoods',tokenObj.verifyToken,(req,res,next)=>{
    GoodsManage.getOneUserGoodsList(req,res,next)
})


// 删除指定商品数据
router.post('/delete',tokenObj.verifyToken,(req,res,next)=>{
    GoodsManage.deleteGoodsByID(req,res,next)
})

//修改商品状态为 暂停出售 （2）
router.post('/stopSell',tokenObj.verifyToken,(req,res,next)=>{
    GoodsManage.stopSelByID(req,res,next)
})

// 修改商品状态为 正常出售 （0）
router.post('/toNormal',tokenObj.verifyToken,(req,res,next)=>{
    GoodsManage.toNormalByID(req,res,next)
})

// 增加商品数量  并重置商品状态为 0 
router.post('/addStocks',tokenObj.verifyToken,(req,res,next)=>{
    GoodsManage.addStocksByID(req,res,next)
})

// 修改商品的信息 提交成功后状态为 待审核 （4）
router.post('/editGoods',tokenObj.verifyToken,(req,res,next)=>{
    GoodsManage.editGoodsByID(req,res,next)
})

// 获取指定用户允许出售的商品列表
router.get('/sellerGoods',(req,res,next)=>{
    GoodsManage.getSellerGoodsByID(req,res,next)
})



module.exports = router