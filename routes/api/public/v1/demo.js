const express = require('express')
const router = express.Router()
const token = require('../../../../utils/token')
const UserManage = require('../../../../controller/UserManage')
const GoodsManage = require('../../../../controller/GoodsManage')
const User = require('../../../../model/user')
// const multer = require('multer') 
const upload = require('../../../../utils/upload')

// const uploadObj = upload.uploadSetting(null, 'file', 1, ['.PNG'])
const uploadObj = upload.uploadSetting('./upload/img/goods', 'img', 8, ['.png', '.jpg', '.bmp','.jpeg'])

// 设置图片存储路径(标准写法)
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, './public/mimg')
//     },
//     filename: function (req, file, cb) {
//         cb(null, `${Date.now()}-${file.originalname}`)
//     }
// })
// 添加配置文件到muler对象。
// const upload = multer({ storage: storage })

// 测试路由 进行数据测试
router.get('/', function (req, res) {
    res.json({
        message: {
            data: {
                name: '汪烁',
                age: 22,
                gender: 0
            }
        },
        meta: {
            status: 200,
            msg: 'ok!'
        }
    })
})


router.post('/', function (req, res) {
    res.json({
        message: {
            data: {
                name: '张三',
                age: 11,
                gender: 0
            }
        },
        meta: {
            status: 200,
            msg: 'ok!'
        }
    })
})


router.post('/login', (req, res) => {
    /*
        iss:签发人
        iat:签发时间回溯30s
        exp:过期时间 这里可是使用秒数,也可以使用day
        "{"jti":1,"iss":"gumt.top","user":"goolge","iat":1555650413,"exp":1555657613}"
        "iat": ~~(Date.now() / 1000)-30,
        "exp": ~~(Date.now() / 1000)+(60*60),
    */
    const user = {
        'jti': 1,
        'iss': 'gumt.top',
        'user': 'google',
        'email': 'cn.chung@foxmail.com'
    }

    token.createToken(user)

})

// 这里可以选中将token.verifyToken在入口文件中以自定义中间计划的形式挂载
router.post('/posts', token.verifyToken, (req, res) => {
    token.verify(req.token, function (authData) {
        if (authData) {
            res.sendResult(authData, 200, 'login success')
        } else {
            res.status(403).json({
                code: 403,
                msg: '无效token！'
            })
        }
    })
})

router.post('/userlogin', (req, res, next) => {
    UserManage.UserLogin(req, res, next)
})

router.get('/uploadHome', (req, res, next) => {
    res.render('UploadImg.html')
})

// 不使用中间件
// router.post('/upload',
//     (req, res, next) => {
//         uploadObj(req, res, (err) => {
//             if (err) {
//                 res.json({
//                     err_code: 1,
//                     msg: '文件上传失败!',
//                     err: err.toString()
//                 })
//             } else {
//                 const files = req.files
//                 res.json({
//                     err_code: 0,
//                     data: {
//                         url: files[0].path
//                     },
//                     message: '文件上传成功！'
//                 })
//             }
//         })
//     })


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

// 商品添加测试路由
router.get('/addGoods', (req, res, next) => {
    GoodsManage.addGoodsTest(req, res, next)
})


// 测试 1
router.get('/getInfos',async (req,res,next)=>{
    const {openid} = req.query
    // const userInfos = await User.findOne({
    //     openid
    // })
    let {money} = await User.findOne({openid},{money: 1}).lean()
    let data = await User.findOne({openid},{money: 1}).lean()
    res.sendResult({money, data})
})

// module.exports = router
