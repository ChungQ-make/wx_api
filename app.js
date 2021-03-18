const express = require('express')
const mount = require('mount-routes')
const path = require('path')
const cors = require('cors')
const bodyParser = require('body-parser')

// 开启 https 服务 和 Gzip 服务
const fs = require('fs')
const https = require('https')
const compression = require('compression')
const options = {
    cert: fs.readFileSync(path.join(__dirname, './IIS/1_www.yycloud.ltd_bundle.crt')),
    key: fs.readFileSync(path.join(__dirname, './IIS/2_www.yycloud.ltd.key'))
}

// 连接MongoDB数据库
require('./model/Connect')

const app = express()


// core 解决跨域问题
app.use(cors())

// 挂载 gzip 中间件
app.use(compression())

// 初始化统一响应机制
const sendResult = require('./utils/sendResult')
app.use(sendResult)

// 配置 body-parser 一定要在 app.use(router) 挂载路由之前
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
// “bodyParser”已被弃用 可以使用express本身的built-in主体解析器库
// app.use(express.json())

// 开放可访问文件夹
app.use('/public/', express.static(path.join(__dirname, './public/')))
app.use('/upload/', express.static(path.join(__dirname, './upload/')))
app.use('/node_modules/', express.static(path.join(__dirname, './node_modules/')))

// 配置模板引擎
app.engine('html', require('express-art-template'))

// 借助mount 挂载路由，带路径的用法并且可以打印出路由表
mount(app, path.join(process.cwd(), '/routes'), true)


//  处理403错误
app.use('/403', function (req, res) {
    res.status(403).sendResult(null, 403, '403. Forbidden')
})
// 处理404错误
app.use((req, res) => {
    res.status(404).sendResult(null, 404, '404 not found.')
})
//  处理500错误
app.use((err, req, res, next) => {
    res.status(500).sendResult(err, 500, '500 server err.')
})


// 本地测试端口服务
app.listen(5000, () => {
    console.log('app is running at http://localhost:5000')
})


//  线上 https 端口服务
// https.createServer(options, app).listen(443, function () {
//     console.log('Https Service has been started, runing at https://localhost')
// }) 
