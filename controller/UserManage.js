/*
    负责处理用户登录、用户信息、订单查询
*/

const User = require('../model/user')
const token = require('../utils/token')
const request = require('request')


// 登陆用户返回token值
async function UserLogin(req, res, next) {
    const {
        userInfo,
        code
    } = req.body
    if (!userInfo || !code) {
        return res.sendResult(null, 403, '缺少参数')
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



module.exports = {
    UserLogin
}