const express = require('express')
const router = express.Router()
// const token = require('../../../../utils/token_forAdmin')
const AdminManage = require('../../../../controller/AdminManage')

router.post('/login',(req, res, next) => {
    AdminManage.adminLogin(req,res,next)
})

module.exports = router