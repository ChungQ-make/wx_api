/* 
    * 负责处理会话业务的模块
*/

const token = require('../utils/token')
const Comment = require('../model/comment')
const User = require('../model/user')


// 获取单个用户一对一会话列表
async function getUerSession(req, res, next) {
    const state = token.verify(req.token)
    if (!state) {
        return res.status(403).sendResult(null, 403, '无效token！')
    }
    const { recipient_id, sender_id } = req.body
    if (sender_id === undefined || recipient_id === undefined) {
        return res.sendResult(null, 202, '缺少参数')
    }
    try {
        const data = await Comment.find({
            $or: [
                { sender_id, recipient_id }, { sender_id: recipient_id, recipient_id: sender_id }
            ]
        })
        res.sendResult(data)
    } catch (err) {
        next(err)
    }
}


// 一对一会话时 创建当个会话信息
async function createComment(req, res, next) {
    const state = token.verify(req.token)
    if (!state) {
        return res.status(403).sendResult(null, 403, '无效token！')
    }
    const formData = req.body
    try {
        const { sender_id, recipient_id } = formData
        // 将对方互相添加到联系人列表
        const senderData = await User.findOne({ openid: sender_id }).lean()
        const recipientData = await User.findOne({ openid: recipient_id }).lean()
        if (senderData.goodsCollection.indexOf(recipient_id) < 0) {
            senderData.goodsCollection.push(recipient_id)
        }
        if (recipientData.goodsCollection.indexOf(sender_id) < 0) {
            recipientData.goodsCollection.push(sender_id)
        }
        await User.updateOne({ openid: sender_id }, senderData)
        await User.updateOne({ openid: recipient_id }, recipientData)

        const data = await new Comment(formData).save()
        res.sendResult(data, 201, '发送成功！')
    } catch (err) {
        next(err)
    }
}

// 获取产生对话的联系人列表
async function getContactsList(req, res, next) {
    const state = token.verify(req.token)
    if (!state) {
        return res.status(403).sendResult(null, 403, '无效token！')
    }
    const { openid } = req.body
    if (openid === undefined) {
        return res.sendResult(null, 202, '缺少参数')
    }
    try {
        const data = await User.findOne({ openid })
        let contactsList = []
        data.goodsCollection.forEach(async (item, index) => {
            contactsList.push(await User.findOne({ openid: item }, { money: 0, goodsCollection: 0 }).lean())
            if (index === data.goodsCollection.length - 1) {
                contactsList.forEach(async (item1, index1) => {
                    const _data = await Comment.find(
                        {
                            $or: [
                                { sender_id: item1.openid, recipient_id: openid }, { sender_id: openid, recipient_id: item1.openid }
                            ]
                        }
                    ).sort({ _id: -1 }).lean()
                    item1.newComment = _data[0].content
                    item1.count = _data.length
                    if (index1 === contactsList.length - 1) {
                        res.sendResult(contactsList)
                    }
                })
            }
        })
        // res.sendResult(data.goodsCollection)
    } catch (err) {
        next(err)
    }
}

module.exports = {
    getUerSession,
    createComment,
    getContactsList
}