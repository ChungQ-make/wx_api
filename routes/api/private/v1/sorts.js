const express = require('express')
const router = express.Router()
const token = require('../../../../utils/token_forAdmin')
const SortsManage = require('../../../../controller/SortsManage')

router.get('/list',token.verifyToken,(req, res, next) => {
    SortsManage.getAllSortsList(req,res,next)
})

module.exports = router