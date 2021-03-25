const express = require('express')
const router = express.Router()
const GoodsManage = require('../../../../controller/GoodsManage')
const SortsManage = require('../../../../controller/SortsManage')
// 这里提供的只是前端的测试数据，真实数据需等到后端（和后台系统）开发时提供

// 轮播图
router.get('/swiperdata', (req, res, next) => {
    GoodsManage.getSeiperData(req,res,next)
})

// 导航栏
router.get('/catitems', (req, res, next) => {
    const data = [
        {
            "name": "商品分类",
            "image_src": "http://localhost:5000/upload/img/catitems/goods_categories.png",
            "open_type": "switchTab",
            "navigator_url": "/pages/categories/main"
        },
        {
            "name": "热门推荐",
            "image_src": "http://localhost:5000/upload/img/catitems/goods_recommend.png",
            "open_type": "switchTab",
            "navigator_url": "/pages/goods_list/main"
        },
        {
            "name": "新品上线",
            "image_src": "http://localhost:5000/upload/img/catitems/goods_new.png",
            "open_type": "switchTab",
            "navigator_url": "/pages/goods_list/main"
        },
        {
            "name": "官方商城",
            "image_src": "http://localhost:5000/upload/img/catitems/goods_official.png",
            "open_type": "switchTab",
            "navigator_url": "/pages/myShop/main?openid=ocAqT4j40nJf_KUjXB_aSq2kWLf0"
        }
    ]
    res.sendResult(data)
    // res.sendResult(null,404,'erron')
})

// 新楼层数据
router.get('/floordata', (req, res, next) => {
    SortsManage.getFloorData(req, res, next)
})


module.exports = router