const express = require('express')
const router = express.Router()
const token = require('../../../../utils/token_forAdmin')
const SortsManage = require('../../../../controller/SortsManage')

// 获取分类标题数组
router.get('/list',token.verifyToken,(req, res, next) => {
    SortsManage.getAllSortsList(req,res,next)
})

// 获取具体分类信息
router.get('/sortlist',token.verifyToken,(req, res, next) => {
    SortsManage.getCategoriesBC(req,res,next)
})

// 更新分类数据、
router.post('/update',token.verifyToken,(req, res, next) => {
    SortsManage.updateSortInfo(req,res,next)
})

// 增加新的分类
router.post('/add',token.verifyToken,(req, res, next) => {
    SortsManage.addNewSort(req,res,next)
})

// 删除分类
router.post('/delete',token.verifyToken,(req, res, next) => {
    SortsManage.removeByID(req,res,next)
})


module.exports = router