const express = require('express')
const router = express.Router()
const token = require('../../../../utils/token_forAdmin')
const UserManage = require('../../../../controller/UserManage')

router.get('/',token.verifyToken,(req, res, next) => {
    UserManage.getUserlist(req,res,next)
})

router.post('/userInfo',token.verifyToken,(req, res, next) => {
    UserManage.getUerinfoByID(req,res,next)
})

router.post('/editUser',token.verifyToken,(req, res, next) => {
    UserManage.editUser(req,res,next)
})

router.post('/delete',token.verifyToken,(req, res, next) => {
    UserManage.deleteUser(req,res,next)
})


router.post('/state',token.verifyToken,(req, res, next) => {
    UserManage.updateState(req,res,next)
})


module.exports = router