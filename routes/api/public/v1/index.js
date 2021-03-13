const express = require('express')
const router = express.Router()

// index主路由
router.get('/', (req, res, next) => {
    const data = {
        message: '这里是主路由，基址是 http://localhost:5000/api/public/v1'
    }
    res.sendResult(data)
})


module.exports = router