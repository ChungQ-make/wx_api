/**
 *  负责管理商品的操作模块
 */

const Goods = require('../model/goods')
const tokenObj = require('../utils/token')


// 商品添加
async function addGoods(req, res, next) {
    const state = tokenObj.verify(req.token)
    if (!state) return res.status(403).sendResult(null, 403, '无效token！')
    try {
        const goodsInfo = req.body
        await new Goods(goodsInfo).save((err, data) => {
            if (err)
                next(err)
            // console.log('添加商品成功！')
            res.sendResult(data)
        })
    } catch (err) {
        next(err)
    }
}

// 获取商品信息
async function getGoodsInfo(req, res, next) {
    try {
        const { goods_id } = req.query
        if (!goods_id)
            return res.sendResult(null, 200, '未添加参数！')
        const goodsInfos = await Goods.findOne({ goods_id })
        res.sendResult(goodsInfos)
    } catch (err) {
        next(err)
    }
}

// 获取商品列表
async function getGoodsList(req, res, next) {
    try {
        // 注意这里的 pageSize 由于是JSON数据获取而来 所以必须_pageSize*1转换为Number类型
        const { goods_type, pageNum, pageSize } = req.query
        const _pageNum = pageNum || 0
        const _pageSize = pageSize || 8
        const skip = _pageNum * _pageSize
        const goodsList = goods_type ? await Goods.find({ goods_type }).limit(_pageSize * 1).skip(skip) : await Goods.find().limit(_pageSize * 1).skip(skip)
        const total = goods_type ? await Goods.find({ goods_type }).countDocuments() : await Goods.find().countDocuments()
        const pageCounts = Math.ceil(total / _pageSize)
        res.sendResult({
            goodsList,
            total,
            pageNum: _pageNum * 1,
            pageSize: _pageSize * 1,
            pageCounts
        })
    } catch (err) {
        next(err)
    }
}

// 商品搜索
async function SearchGoodsList(req, res, next) {
    let { query } = req.query
    // 进行数据处理，去除所有空格
    query = query.replace(/\s/ig, '')
    try {
        // 为了提高查询效率，可以同时查询商品名、商品分类、卖家昵称，并结合正则表达式
        const reg = new RegExp(query, "gi")
        const goodsList = await Goods.find({
            $or: [
                { goods_name: reg },
                { goods_type: reg },
                { seller: reg }
            ]
        })
        const total = goodsList.length
        res.sendResult({ goodsList, total })
    } catch (err) {
        next(err)
    }
}


module.exports = {
    addGoods,
    getGoodsInfo,
    getGoodsList,
    SearchGoodsList
}