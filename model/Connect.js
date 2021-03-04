// 这里负责的项目项目启动时，连接数据库的操作模块
const mongoose = require('mongoose')
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
