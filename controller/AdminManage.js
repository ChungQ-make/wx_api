
//  * 管理员操模块

const Admin = require('../model/admin')
const User = require('../model/user')
const token = require('../utils/token_forAdmin')
const upload = require('../utils/upload')
const Goods = require('../model/goods')
const Orders = require('../model/orders')
const Sorts = require('../model/sort')


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
        if (!await Admin.findOne({ username, password })) {
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

module.exports = {
    adminLogin
}