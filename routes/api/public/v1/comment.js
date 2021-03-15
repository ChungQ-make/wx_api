const express = require('express')
const router = express.Router()
const CommentManage = require('../../../../controller/CommentManage')
const tokenObj = require('../../../../utils/token')



// 获取单个用户一对一对话列表
router.post('/uerSession',tokenObj.verifyToken,(req,res,next)=>{
    CommentManage.getUerSession(req,res,next) 
})

//  创建一对一会话时对话信息
router.post('/create',tokenObj.verifyToken,(req,res,next)=>{
    CommentManage.createComment(req,res,next) 
})

// 获取和用户产生对话的联系人列表
router.post('/contacts',tokenObj.verifyToken,(req,res,next)=>{
    CommentManage.getContactsList(req,res,next) 
})

module.exports = router