const express = require('express')
const router = express.Router()
const SortsManage = require('../../../../controller/SortsManage')
const token = require('../../../../utils/token')

// 添加分类
router.post('/addCategory', token.verifyToken, (req, res, next) => {
    SortsManage.addNewSort(req, res, next)
})

// 分类数据
router.get('/', (req, res, next) => {
    SortsManage.getCategoriesData(req, res, next)
})

// 获取全部分类名称（允许展示的）
router.get('/names', (req, res, next) => {
    SortsManage.getCategoriesName(req, res, next)
})


module.exports = router