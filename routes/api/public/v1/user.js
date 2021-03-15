const express = require('express')
const router = express.Router()
const UserManage = require('../../../../controller/UserManage')
const tokenObj = require('../../../../utils/token')


// 关于用户信息操作的路由
// 用户登陆
router.post('/login', (req, res, next) => {
    UserManage.userLogin(req, res, next)
})

// 用户充值
router.post('/topUps',tokenObj.verifyToken,(req,res,next)=>{
    UserManage.userTopUps(req,res,next) 
})

// 获取单个用户信息
router.post('/getUerinfo',tokenObj.verifyToken,(req,res,next)=>{
    UserManage.getUerinfoByID(req,res,next) 
})

// 通过用户名获取用户信息 
router.get('/query',(req,res,next)=>{
    UserManage.userQuery(req,res,next) 
})


module.exports = router