// 添加统一的返回结果方法
module.exports = function (req, res, next) {
    res.sendResult = function (data, code, message) {
        let fmt = req.query.fmt ? req.query.fmt : "rest"
        // 设置默认参数
        let _message = message || 'ok'
        let _code = code || 200
        if (fmt == "rest") {
            res.json(
                {
                    data: data,
                    meta: {
                        msg: _message,
                        status: _code
                    }
                })
        }
    }
    next()
}
