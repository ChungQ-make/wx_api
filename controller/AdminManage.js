
//  * 管理员操模块 （负责后台管理员账号的管理）
const Admin = require('../model/admin')
// const User = require('../model/user')
const token = require('../utils/token_forAdmin')
// const upload = require('../utils/upload')
// const Goods = require('../model/goods')
// const Orders = require('../model/orders')
// const Sorts = require('../model/sort')


// 管理员登录
async function adminLogin(req, res, next) {
    const {
        username,
        password
    } = req.body
    if (username === undefined || password === undefined) {
        return res.sendResult(null, 202, '缺少参数')
    }
    try {
        if (!await Admin.findOne({ username, password, status: { $lte: 1 } })) {
            return res.sendResult(null, 403, '登录失败！')
        }
        // 初始化token生成参数
        const admin = {
            username,
            iss: 'kula0410',
            email: 'cn.chung@foxmail.com'
        }
        token.createToken(admin, '1day', function (token) {
            res.sendResult({ token: 'Bearer ' + token, username }, 200, '登陆成功！')
        })
    } catch (err) {
        next(err)
    }
}

// 获取单个管理员信息
async function getAdminDetail(req, res, next) {
    const state = token.verify(req.token)
    if (!state) {
        return res.status(403).sendResult(null, 403, '无效token！')
    }

    try {
        const { username } = req.query
        if (username === undefined) {
            res.sendResult(null, 202, '缺少参数')
        }
        const data = await Admin.findOne({ username })
        if (!data) {
            return res.sendResult(null, 404, '没有该用户信息！')
        }
        res.sendResult(data)
    } catch (err) {
        next(err)

    }
}

// 获取全部管理信息
async function getAdminList(req, res, next) {
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
        const adminList = query ? await Admin.find({
            $or: [
                { nickName: reg }
            ]
        }).limit(pagesize * 1).skip(skip) : await Admin.find({}).limit(pagesize * 1).skip(skip)
        const total = query ? await Admin.find({
            $or: [
                { nickName: reg }
            ]
        }).countDocuments() : await Admin.find({}).countDocuments()
        const pageCounts = Math.ceil(total / pagesize)
        res.sendResult({
            adminList,
            total,
            pagenum: pagenum * 1,
            pagesize: pagesize * 1,
            pageCounts
        })
    } catch (err) {
        next(err)
    }
}

async function addAdmin(req, res, next) {
    const state = token.verify(req.token)
    if (!state) {
        return res.status(403).sendResult(null, 403, '无效token！')
    }
    const { addFrom } = req.body
    try {
        const data = await new Admin(addFrom).save()
        res.sendResult(data, 201, '创建成功！')
    } catch (err) {
        next(err)
    }
}

async function deleteAdmin(req, res, next) {
    const state = token.verify(req.token)
    if (!state) {
        return res.status(403).sendResult(null, 403, '无效token！')
    }
    const { username } = req.body
    if (username === undefined) {
        return res.status(404).sendResult(null, 202, '缺少参数')
    }
    try {
        const data = await Admin.deleteOne({ username })
        res.sendResult(data, 200, '删除成功！')
    } catch (err) {
        next(err)
    }
}

async function updateAdmin(req, res, next) {
    const state = token.verify(req.token)
    if (!state) {
        return res.status(403).sendResult(null, 403, '无效token！')
    }
    const { editForm } = req.body
    const username = editForm.username
    try {
        const data = await Admin.updateOne({ username }, editForm)
        res.sendResult(data, 200, '修改成功！')
    } catch (err) {
        next(err)
    }
}


module.exports = {
    adminLogin, getAdminDetail, getAdminList, addAdmin, deleteAdmin, updateAdmin
}