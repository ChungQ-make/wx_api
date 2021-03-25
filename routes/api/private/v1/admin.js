const express = require('express')
const router = express.Router()
const token = require('../../../../utils/token_forAdmin')
const AdminManage = require('../../../../controller/AdminManage')

router.post('/login',(req, res, next) => {
    AdminManage.adminLogin(req,res,next)
})

router.get('/detail',token.verifyToken,(req, res, next) => {
    AdminManage.getAdminDetail(req,res,next)
})

router.get('/list',token.verifyToken,(req, res, next) => {
    AdminManage.getAdminList(req,res,next)
})

router.post('/add',token.verifyToken,(req, res, next) => {
    AdminManage.addAdmin(req,res,next)
})

router.post('/delete',token.verifyToken,(req, res, next) => {
    AdminManage.deleteAdmin(req,res,next)
})

router.post('/update',token.verifyToken,(req, res, next) => {
    AdminManage.updateAdmin(req,res,next)
})


module.exports = router