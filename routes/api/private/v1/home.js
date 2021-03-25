const express = require('express')
const router = express.Router()
const token = require('../../../../utils/token_forAdmin')
const GoodsManage = require('../../../../controller/GoodsManage')
const upload = require('../../../../utils/upload')
const uploadObj = upload.uploadSetting('./upload/img/goods', 'img', 8, ['.png', '.jpg', '.bmp','.jpeg'])

// 后台获取轮播图数据
router.get('/swiper',(req, res, next) => {
    GoodsManage.getSeiperData(req,res,next)
})

// 修改轮播图数据
router.post('/swiper/update',token.verifyToken,(req, res, next) => {
    GoodsManage.updateSwiperData(req,res,next)
})

// 删除轮播图数据
router.post('/swiper/delete',token.verifyToken,(req, res, next) => {
    GoodsManage.deleteSwiperItem(req,res,next)
})

// 增加轮播项
router.post('/swiper/add',token.verifyToken,(req, res, next) => {
    GoodsManage.addSwiperItem(req,res,next)
})

// 图床显示
router.get('/uploadHome', (req, res, next) => {
    res.render('UploadImg.html')
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
            next(err)
        }
    })
}

module.exports = router
