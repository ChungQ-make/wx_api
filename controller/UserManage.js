/*
   * 负责处理用户登录、用户信息、订单查询
*/

const User = require('../model/user')
const token = require('../utils/token')
const request = require('request')
const Comment = require('../model/comment')
const Goods = require('../model/goods')
// 登陆用户返回token值
async function userLogin(req, res, next) {
    const {
        userInfo,
        code
    } = req.body
    if (userInfo === undefined || code === undefined) {
        return res.sendResult(null, 202, '缺少参数')
    }
    // 通过code换取openid
    const appID = 'wx6337405430aef36e'
    const appSecret = '9e2f8ce906b3653c2cc66b1274ad7560'
    const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${appID}&secret=${appSecret}&js_code=${code}&grant_type=authorization_code`
    request(url, async (erron, response, body) => {
        if (!erron && response.statusCode === 200) {
            const {
                openid
            } = JSON.parse(body)
            userInfo.openid = openid
            // 初始化token生成参数
            const user = {
                openid,
                nickName: userInfo.nickName,
                iss: 'kula0410'
            }
            try {
                // 已注册用户
                const userInfos = await User.findOne({
                    openid
                })
                if (userInfos.status === 2) {
                    return res.sendResult(null,403,'该用户禁止登陆！')
                }
                if (userInfos) {
                    // ! 回调函数形式
                    // token.createToken(user, '1day', function (token) {
                    //      res.sendResult({ token: 'Bearer ' + token, userInfo }, 200, '登陆成功！')
                    // })

                    // ! Promise形式(推荐)
                    const _token = await token.createToken(user)
                    res.sendResult({
                        token: 'Bearer ' + _token,
                        userInfos
                    }, 200, '登陆成功！')

                } else {
                    //  保存未注册的新用户信息
                    await new User(userInfo).save(async (err, data) => {
                        if (err)
                            return next(err)
                        const {
                            openid,
                            nickName
                        } = data
                        const _token = await token.createToken(user)
                        res.sendResult({
                            token: 'Bearer ' + _token,
                            userInfos: data
                        }, 200, '新用户登陆成功！')
                    })
                }
            } catch (err) {
                next(err)
            }
        } else {
            next(erron)
        }
    })
}

// 用户充值
async function userTopUps(req, res, next) {
    const state = token.verify(req.token)
    if (!state) {
        return res.status(403).sendResult(null, 403, '无效token！')
    }
    let { topUpsMoney, openid } = req.body
    if (topUpsMoney === undefined || openid === undefined) {
        return res.sendResult(null, 202, '缺少参数')
    }
    topUpsMoney = JSON.parse(topUpsMoney)
    try {
        // res.sendResult({topUpsMoney,openid})
        const data = await User.findOne({ openid })
        data.money = data.money + topUpsMoney
        await User.updateOne({ openid }, data)
        const userInfos = await User.findOne({ openid })
        res.sendResult({ userInfos, money: userInfos.money })
    } catch (err) {
        next(err)
    }
}

// 获取单个用户信息
async function getUerinfoByID(req, res, next) {
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
        if (!data) {
            res.sendResult(null, 404, '无此用户信息！')
        }
        res.sendResult(data)
    } catch (err) {
        next(err)
    }
}

async function userQuery(req, res, next) {
    const { query } = req.query
    try {
        const reg = new RegExp(query, "gi")
        const data = await User.findOne({ nickName: reg }, { money: 0, goodsCollection: 0 })
        res.sendResult(data)
    } catch (err) {
        next(err)
    }
}

async function getUserlist(req, res, next) {
    const state = token.verify(req.token)
    if (!state) {
        return res.status(403).sendResult(null, 403, '无效token！')
    }
    let { query, pagenum, pagesize } = req.query
    query = query.trim()
    pagenum = pagenum === undefined ? 0 : pagenum - 1
    pagesize = pagesize === undefined ? 4 : pagesize
    try {
        const skip = pagenum * pagesize * 1
        const reg = new RegExp(query, "gi")
        const userList = query ? await User.find({
            $or: [
                { nickName: reg },
                { openid: reg }
            ]
        }).limit(pagesize * 1).skip(skip) : await User.find({}).limit(pagesize * 1).skip(skip)
        const total = query ? await User.find({
            $or: [
                { nickName: reg },
                { openid: reg }
            ]
        }).countDocuments() : await User.find({}).countDocuments()
        const pageCounts = Math.ceil(total / pagesize)
        res.sendResult({
            userList,
            total,
            pagenum: pagenum * 1,
            pagesize: pagesize * 1,
            pageCounts
        })
    } catch (err) {
        next(err)
    }
}

async function editUser(req, res, next) {
    const state = token.verify(req.token)
    if (!state) {
        return res.status(403).sendResult(null, 403, '无效token！')
    }
    let { editForm } = req.body
    try {
        const data = await User.updateOne({ openid: editForm.openid }, editForm)
        res.sendResult(data, 200, '更新成功！')
    } catch (err) {
        next(err)

    }
}

async function deleteUser(req, res, next) {
    const state = token.verify(req.token)
    if (!state) {
        return res.status(403).sendResult(null, 403, '无效token！')
    }
    try {
        const { openid } = req.body
        if (openid === undefined) {
            return res.sendResult(null, 404, '缺少参数')
        }
        // 删除用户 更新原来的商品为禁止出售
        await Goods.updateMany({ seller_id: openid }, { status: 3 })
        const data = await User.deleteOne({ openid })
        res.sendResult(data)
    } catch (err) {
        next(err)
    }
}

async function updateState(req,res,next){
    const state = token.verify(req.token)
    if (!state) {
        return res.status(403).sendResult(null, 403, '无效token！')
    }
    try {
        const {openid,status} = req.body
        if (status === 1) {
            await Goods.updateMany({ seller_id: openid }, { status: 3 })
        }else if (status === 2) {
            await Goods.updateMany({ seller_id: openid ,status: { $lte: 2 }}, { status: 2 })
        }
        const data = await User.updateOne({openid},{status})
        res.sendResult(data)
    } catch (err) {
        next(err)
    }
}


module.exports = {
    userLogin,
    userTopUps,
    getUerinfoByID,
    userQuery,
    getUserlist,
    editUser,
    deleteUser,
    updateState
}