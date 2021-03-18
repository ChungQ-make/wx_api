const express = require('express')
const router = express.Router()
const GoodsManage = require('../../../../controller/GoodsManage')
const SortsManage = require('../../../../controller/SortsManage')
// 这里提供的只是前端的测试数据，真实数据需等到后端（和后台系统）开发时提供

// 轮播图
router.get('/swiperdata', (req, res, next) => {
    const data = [
        {
            "image_src": "https://api-hmugo-web.itheima.net/pyg/banner1.png",
            "open_type": "navigate",
            "goods_id": 129,
            "navigator_url": "/pages/goods_detail/main?goods_id=1614312234835"
        },
        {
            "image_src": "https://api-hmugo-web.itheima.net/pyg/banner2.png",
            "open_type": "navigate",
            "goods_id": 395,
            "navigator_url": "/pages/goods_detail/main?goods_id=1614312234835"
        },
        {
            "image_src": "https://api-hmugo-web.itheima.net/pyg/banner3.png",
            "open_type": "navigate",
            "goods_id": 38,
            "navigator_url": "/pages/goods_detail/main?goods_id=1614312234835"
        }
    ]
    res.sendResult(data)
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

// 楼层数据
router.get('/floordataDemo', (req, res, next) => {
    const data = [
        {
            "floor_title": {
                "name": "时尚女装",
                "image_src": "https://api-hmugo-web.itheima.net/pyg/pic_floor01_title.png"
            },
            "product_list": [
                {
                    "name": "优质服饰",
                    "image_src": "https://api-hmugo-web.itheima.net/pyg/pic_floor01_1@2x.png",
                    "image_width": "232",
                    "open_type": "navigate",
                    "navigator_url": "/pages/goods_list?query=服饰"
                },
                {
                    "name": "春季热门",
                    "image_src": "https://api-hmugo-web.itheima.net/pyg/pic_floor01_2@2x.png",
                    "image_width": "233",
                    "open_type": "navigate",
                    "navigator_url": "/pages/goods_list?query=热"
                },
                {
                    "name": "爆款清仓",
                    "image_src": "https://api-hmugo-web.itheima.net/pyg/pic_floor01_3@2x.png",
                    "image_width": "233",
                    "open_type": "navigate",
                    "navigator_url": "/pages/goods_list?query=爆款"
                },
                {
                    "name": "倒春寒",
                    "image_src": "https://api-hmugo-web.itheima.net/pyg/pic_floor01_4@2x.png",
                    "image_width": "233",
                    "open_type": "navigate",
                    "navigator_url": "/pages/goods_list?query=春季"
                },
                {
                    "name": "怦然心动",
                    "image_src": "https://api-hmugo-web.itheima.net/pyg/pic_floor01_5@2x.png",
                    "image_width": "233",
                    "open_type": "navigate",
                    "navigator_url": "/pages/goods_list?query=心动"
                }
            ]
        },
        {
            "floor_title": {
                "name": "户外活动",
                "image_src": "https://api-hmugo-web.itheima.net/pyg/pic_floor02_title.png"
            },
            "product_list": [
                {
                    "name": "勇往直前",
                    "image_src": "https://api-hmugo-web.itheima.net/pyg/pic_floor02_1@2x.png",
                    "image_width": "232",
                    "open_type": "navigate",
                    "navigator_url": "/pages/goods_list?query=户外"
                },
                {
                    "name": "户外登山包",
                    "image_src": "https://api-hmugo-web.itheima.net/pyg/pic_floor02_2@2x.png",
                    "image_width": "273",
                    "open_type": "navigate",
                    "navigator_url": "/pages/goods_list?query=登山包"
                },
                {
                    "name": "超强手套",
                    "image_src": "https://api-hmugo-web.itheima.net/pyg/pic_floor02_3@2x.png",
                    "image_width": "193",
                    "open_type": "navigate",
                    "navigator_url": "/pages/goods_list?query=手套"
                },
                {
                    "name": "户外运动鞋",
                    "image_src": "https://api-hmugo-web.itheima.net/pyg/pic_floor02_4@2x.png",
                    "image_width": "193",
                    "open_type": "navigate",
                    "navigator_url": "/pages/goods_list?query=运动鞋"
                },
                {
                    "name": "冲锋衣系列",
                    "image_src": "https://api-hmugo-web.itheima.net/pyg/pic_floor02_5@2x.png",
                    "image_width": "273",
                    "open_type": "navigate",
                    "navigator_url": "/pages/goods_list?query=冲锋衣"
                }
            ]
        },
        {
            "floor_title": {
                "name": "箱包配饰",
                "image_src": "https://api-hmugo-web.itheima.net/pyg/pic_floor03_title.png"
            },
            "product_list": [
                {
                    "name": "清新气质",
                    "image_src": "https://api-hmugo-web.itheima.net/pyg/pic_floor03_1@2x.png",
                    "image_width": "232",
                    "open_type": "navigate",
                    "navigator_url": "/pages/goods_list?query=饰品"
                },
                {
                    "name": "复古胸针",
                    "image_src": "https://api-hmugo-web.itheima.net/pyg/pic_floor03_2@2x.png",
                    "image_width": "263",
                    "open_type": "navigate",
                    "navigator_url": "/pages/goods_list?query=胸针"
                },
                {
                    "name": "韩版手链",
                    "image_src": "https://api-hmugo-web.itheima.net/pyg/pic_floor03_3@2x.png",
                    "image_width": "203",
                    "open_type": "navigate",
                    "navigator_url": "/pages/goods_list?query=手链"
                },
                {
                    "name": "水晶项链",
                    "image_src": "https://api-hmugo-web.itheima.net/pyg/pic_floor03_4@2x.png",
                    "image_width": "193",
                    "open_type": "navigate",
                    "navigator_url": "/pages/goods_list?query=水晶项链"
                },
                {
                    "name": "情侣表",
                    "image_src": "https://api-hmugo-web.itheima.net/pyg/pic_floor03_5@2x.png",
                    "image_width": "273",
                    "open_type": "navigate",
                    "navigator_url": "/pages/goods_list?query=情侣表"
                }
            ]
        }
    ]
    res.sendResult(data)
})

// 新楼层数据
router.get('/floordata', (req, res, next) => {
    SortsManage.getFloorData(req, res, next)
})


module.exports = router