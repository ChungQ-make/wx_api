/*  负责 token 的生成、处理和验证模块 */
/* 此模块为后台管理系统单独使用 */



const jwt = require('jsonwebtoken')

// 设置加密密钥（可分别设置公钥和私钥）
const key = 'secretkey'


/**
 *  处理前端返回的 token
 */
function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization']
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ')
        const bearerToken = bearer[1]
        req.token = bearerToken
        next()
    } else {
        res.sendStatus(403)
    }
}

/**
 * 生成token
 * @param {Object} user 生成token
 * @param {String} time token生效时间
 * @param {Function} callback 回调函数，负责传递token和错误信息 
 */
async function createToken(user, time, callback) {
    const _callback = callback || function () { }
    // 有效时间(默认为一天) 这里没设置为永久
    const _time = time || '1day'
    // jwt.sign(user, key, { expiresIn: _time }, (err, token) => {})
    // 设置返回值 由于是异步操作 可以借助Promise语法获取数据
    const _token = new Promise((resolve, reject) => {
        jwt.sign(user, key, { expiresIn: _time }, (err, token) => {
            // err ? _callback(null, err) : _callback(token, null)
            if (err) {
                _callback(null, err)
                reject(null)
            } else {
                _callback(token, null)
                resolve(token)
            }
        })
    })
    // console.log('1)___' + await _token)

    return _token
}

/**
 * 验证解析token
 * @param  {String} token 进行解析的token
 * @param  {Function} callback  回调函数,负责传递解析的token信息和解析失败的错误信息
 */
function verify(token, callback) {
    // 设置状态返回值state
    let state = false
    let _callback = callback || function () { }
    jwt.verify(token, key, (err, authData) => {
        if (err) {
            // res.status(403).json({
            //     status: 403,
            //     msg: '无效token！'
            // })
            // 这里改成单独处理
            state = false
            _callback(null, err)
        } else {
            state = true
            _callback(authData, null)
        }
    })

    return state
}

module.exports = {
    verifyToken,
    jwt,
    createToken,
    verify
}