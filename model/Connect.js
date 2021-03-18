// 这里负责的项目项目启动时，连接数据库和初始化管理员账号的操作模块
const mongoose = require('mongoose')
const Admin = require('./admin')

// 设置使用 mongodb 的索引创建方法
mongoose.set('useCreateIndex', true)
mongoose.connect('mongodb://localhost/mall_data', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}).then(() => {
    console.log('MongoDB 连接成功!')
}).catch((err) => {
    console.log('MongoDB 连接失败! ' + err)
})


// 初始化管理员账号
;(async function () {
    if (!await Admin.findOne({
            username: 'admin'
        })) {
        await new Admin({
            username: 'admin',
            password: '123456',
            role: 'admin',
            status: 0
        }).save()
        console.log('初始化管理员账号成功！')
    }
    const adminInfos = [{
        username: 'admin',
        password: '123456',
        role: 'admin',
        status: 0
    }]
    console.table(adminInfos)
})()

// 使用匿名函数 自执行函数 () [] 等符号再最外层时 开头需要加上 ; 避免报错