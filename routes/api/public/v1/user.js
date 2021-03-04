const express = require('express')
const router = express.Router()
const UserManage = require('../../../../controller/UserManage')

// 关于用户信息操作的路由
router.post('/login', (req, res, next) => {
    UserManage.UserLogin(req, res, next)
})

module.exports = router