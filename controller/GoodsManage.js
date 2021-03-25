/**
 *  * 负责管理商品的操作模块
 */

const { entries } = require('lodash')
const Goods = require('../model/goods')
const tokenObj = require('../utils/token')
const fs = require('fs')
const path = require('path')

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
            res.sendResult(data, 201, '成功提交商品信息！')
        })
    } catch (err) {
        next(err)
    }
}

// 获取商品信息
async function getGoodsInfo(req, res, next) {
    try {
        const { goods_id } = req.query
        if (goods_id === undefined)
            return res.sendResult(null, 202, '缺少参数！')
        let goodsInfos = await Goods.findOne({ goods_id })
        if (!goodsInfos) {
            return res.sendResult(null, 404, '没有该商品信息！')
        }
        // 更新访问量 + 0.4
        goodsInfos.pageViews += 0.4
        await Goods.updateOne({ goods_id }, goodsInfos)
        res.sendResult(goodsInfos)
    } catch (err) {
        next(err)
    }
}

// 获取商品列表（允许展示状态 0 1 2）
async function getGoodsList(req, res, next) {
    try {
        // 注意这里的 pageSize 由于是JSON数据获取而来 所以必须_pageSize*1转换为Number类型
        const { goods_type, pageNum, pageSize } = req.query
        const _pageNum = pageNum || 0
        const _pageSize = pageSize || 8
        const skip = _pageNum * _pageSize
        const goodsList = goods_type ? await Goods.find({
            $and: [
                { status: { $lte: 2 } }, { goods_type }
            ]
        }).limit(_pageSize * 1).skip(skip) : await Goods.find({ status: { $lte: 2 } }).limit(_pageSize * 1).skip(skip)
        const total = goods_type ? await Goods.find({
            $and: [
                { status: { $lte: 2 } }, { goods_type }
            ]
        }).countDocuments() : await Goods.find({ status: { $lte: 2 } }).countDocuments()
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
            ],
            status: { $lte: 2 }
        })
        const total = goodsList.length
        res.sendResult({ goodsList, total })
    } catch (err) {
        next(err)
    }
}

// 获取指定用户的商品列表
async function getOneUserGoodsList(req, res, next) {
    const state = tokenObj.verify(req.token)
    if (!state)
        return res.status(403).sendResult(null, 403, '无效token！')
    const { openid } = req.body
    if (openid === undefined) {
        return res.sendResult(null, 202, '缺少参数')
    }
    try {
        const data = await Goods.find({ seller_id: openid })
        res.sendResult(data)
    } catch (err) {
        next(err)
    }
}


// 删除指定商品信息
async function deleteGoodsByID(req, res, next) {
    const state = tokenObj.verify(req.token)
    if (!state) {
        return res.status(403).sendResult(null, 403, '无效token！')
    }
    const { goods_id } = req.body
    if (goods_id === undefined) {
        return res.status(404).sendResult(null, 202, '缺少参数')
    }
    try {
        const data = await Goods.deleteOne({ goods_id })
        res.sendResult(data, 200, '删除成功！')
    } catch (err) {
        next(err)
    }

}

//修改商品状态为 暂停出售 （2）
async function stopSelByID(req, res, next) {
    const state = tokenObj.verify(req.token)
    if (!state) {
        return res.status(403).sendResult(null, 403, '无效token！')
    }
    const { goods_id } = req.body
    if (goods_id === undefined) {
        return res.status(404).sendResult(null, 202, '缺少参数')
    }
    try {
        const data = await Goods.updateOne({ goods_id }, { status: 2 })
        res.sendResult(data, 200, '该商品已暂停出售')
    } catch (err) {
        next(err)
    }
}


//修改商品状态为 暂停出售 （2）
async function toNormalByID(req, res, next) {
    const state = tokenObj.verify(req.token)
    if (!state) {
        return res.status(403).sendResult(null, 403, '无效token！')
    }
    const { goods_id } = req.body
    if (goods_id === undefined) {
        return res.status(404).sendResult(null, 202, '缺少参数')
    }
    try {
        const data = await Goods.updateOne({ goods_id }, { status: 0 })
        res.sendResult(data, 200, '该商品可以正常出售')
    } catch (err) {
        next(err)
    }
}

// 增加商品数量  并重置商品状态为 0 
async function addStocksByID(req, res, next) {
    const state = tokenObj.verify(req.token)
    if (!state) {
        return res.status(403).sendResult(null, 403, '无效token！')
    }
    const { goods_id, addNum } = req.body
    // console.log(goods_id+'--------------'+addNum)
    if (goods_id === undefined || addNum === undefined) {
        return res.status(404).sendResult(null, 202, '缺少参数')
    }
    try {
        const data = await Goods.findOne({ goods_id }).lean()
        data.stocks += addNum
        const update = await Goods.updateOne({ goods_id }, { status: 0, stocks: data.stocks })
        // res.sendResult(data,200,'该商品可以正常出售')
        res.sendResult(update, 200, '更新商品数量成功！')
    } catch (err) {
        next(err)
    }

}

// 用户修改商品的信息 提交成功后状态为 待审核 （4）
async function editGoodsByID(req, res, next) {
    const state = tokenObj.verify(req.token)
    if (!state) {
        return res.status(403).sendResult(null, 403, '无效token！')
    }
    let editGoodsinfo = req.body
    editGoodsinfo.status = 4
    const goods_id = editGoodsinfo.goods_id
    try {
        const data = await Goods.updateOne({ goods_id }, editGoodsinfo)
        res.sendResult(data, 201, '成功提交修改后的商品信息！')
    } catch (err) {
        next(err)
    }
}

// 获取指定商家允许出售的商品列表
async function getSellerGoodsByID(req, res, next) {
    const { openid } = req.query
    if (openid === undefined) {
        return res.sendResult(null, 202, '缺少参数')
    }
    try {
        const data = await Goods.find({ seller_id: openid, status: { $lte: 2 } })
        res.sendResult(data)
    } catch (err) {
        next(err)
    }
}

// 获取商品审核列表数据
async function getAuditData(req, res, next) {
    const state = tokenObj.verify(req.token)
    if (!state) {
        return res.status(403).sendResult(null, 403, '无效token！')
    }
    let { pagenum, pagesize } = req.query
    pagenum = pagenum === undefined ? 0 : pagenum - 1
    pagesize = pagesize === undefined ? 4 : pagesize
    try {
        const skip = pagenum * pagesize * 1
        const auditList = await Goods.find({ status: 4 }).limit(pagesize * 1).skip(skip)
        const total = await Goods.find({ status: 4 }).countDocuments()
        const pageCounts = Math.ceil(total / pagesize)
        res.sendResult({
            auditList,
            total,
            pagenum: pagenum * 1,
            pagesize: pagesize * 1,
            pageCounts
        })
    } catch (err) {
        next(err)
    }
}

// 处理商品审核
async function goodsAudit(req, res, next) {
    const state = tokenObj.verify(req.token)
    if (!state) {
        return res.status(403).sendResult(null, 403, '无效token！')
    }
    try {
        let { goods_id, flag } = req.body
        if (goods_id === undefined || flag === undefined) {
            return res.sendResult(null, 202, '缺少参数')
        }
        const data = flag ? await Goods.updateOne({ goods_id }, { status: 0 }) : await Goods.updateOne({ goods_id }, { status: 5 })
        res.sendResult(data)
    } catch (err) {
        next(err)
    }
}

// 后台获取所有状态商品列表
async function getAllGoodsList(req, res, next) {
    const state = tokenObj.verify(req.token)
    if (!state) {
        return res.status(403).sendResult(null, 403, '无效token！')
    }
    let { query, pagenum, pagesize } = req.query
    query = query.trim()
    pagenum = pagenum === undefined ? 0 : pagenum - 1
    pagesize = pagesize === undefined ? 8 : pagesize
    const skip = pagenum * pagesize * 1
    try {
        // 通过判断query转成Number的数值型后的数据  来选择查询方式（这里混合查询）
        if (query * 1) {
            query = query * 1
            const goodsList = await Goods.find({ goods_id: query }).limit(pagesize * 1).skip(skip)
            const total = await Goods.find({ goods_id: query }).countDocuments()
            const pageCounts = Math.ceil(total / pagesize)
            res.sendResult({
                goodsList,
                total,
                pagenum: pagenum * 1,
                pagesize: pagesize * 1,
                pageCounts
            })
        } else {
            const reg = new RegExp(query, "gi")

            const goodsList = query ? await Goods.find({
                $or: [
                    { seller: reg },
                    { goods_name: reg }
                ]
            }).limit(pagesize * 1).skip(skip)
                : await Goods.find({}).limit(pagesize * 1).skip(skip)

            const total = query ? await Goods.find({
                $or: [
                    { seller: reg },
                    { goods_name: reg }
                ]
            }).countDocuments()
                : await Goods.find({}).countDocuments()
            const pageCounts = Math.ceil(total / pagesize)
            res.sendResult({
                goodsList,
                total,
                pagenum: pagenum * 1,
                pagesize: pagesize * 1,
                pageCounts
            })
        }
    } catch (err) {
        next(err)
        console.log(err);
    }
}

// 后台获取指定商品信息（不增加浏览量）
async function getGoodsDetail(req, res, next) {
    const state = tokenObj.verify(req.token)
    if (!state) {
        return res.status(403).sendResult(null, 403, '无效token！')
    }
    try {
        const { goods_id } = req.query
        if (goods_id === undefined)
            return res.sendResult(null, 202, '缺少参数！')
        let goodsInfos = await Goods.findOne({ goods_id })
        if (!goodsInfos) {
            return res.sendResult(null, 404, '没有该商品信息！')
        }
        res.sendResult(goodsInfos)
    } catch (err) {
        next(err)
    }
}

// 管理员修改商品信息
async function updateGoodsInfos(req, res, next) {
    const state = tokenObj.verify(req.token)
    if (!state) {
        return res.status(403).sendResult(null, 403, '无效token！')
    }
    let { editGoodsInfo } = req.body
    const { goods_id } = editGoodsInfo
    try {
        const data = await Goods.updateOne({ goods_id }, editGoodsInfo)
        res.sendResult(data, 200, '成功修改商品信息！')
    } catch (err) {
        next(err)
    }
}

// 管理员更改商品状态
async function editState(req, res, next) {
    const state = tokenObj.verify(req.token)
    if (!state) {
        return res.status(403).sendResult(null, 403, '无效token！')
    }
    const { goods_id, status } = req.body
    try {
        const data = await Goods.updateOne({ goods_id }, { status })
        res.sendResult(data, 200, '成功修改商品状态！')
    } catch (err) {
        next(err)

    }
}
// 获取本地存储的轮播图数据
async function getSeiperData(req, res, next) {
    const file = path.join(__dirname, '../model/static/swiper.json')
    fs.readFile(file, 'utf-8', function (err, data) {
        if (err) {
            res.sendResult(null, 500, '文件读取失败')
        } else {
            res.sendResult(JSON.parse(data))
        }
    })
}


// 更新轮播图数据
async function updateSwiperData(req, res, next) {
    const state = tokenObj.verify(req.token)
    if (!state) {
        return res.status(403).sendResult(null, 403, '无效token！')
    }
    try {
        const { swiperInfo, index } = req.body
        let file = path.join(__dirname, '../model/static/swiper.json')
        fs.readFile(file, 'utf-8', function (err, data) {
            if (err) {
                res.sendResult(null, 500, '文件读取失败')
            } else {
                let newData = JSON.parse(data)
                newData.swiper[index] = swiperInfo
                const _data = JSON.stringify(newData)
                fs.writeFile(file, _data, function (err) {
                    if (err) {
                        return next(err)
                    }
                    res.sendResult(null, 200, '修改成功')
                })
            }
        })
    } catch (err) {
        next(err)
    }
}

// 删除轮播项
async function deleteSwiperItem(req, res, next) {
    const state = tokenObj.verify(req.token)
    if (!state) {
        return res.status(403).sendResult(null, 403, '无效token！')
    }
    try {
        const { index } = req.body
        let file = path.join(__dirname, '../model/static/swiper.json')
        fs.readFile(file, 'utf-8', function (err, data) {
            if (err) {
                res.sendResult(null, 500, '文件读取失败')
            } else {
                let newData = JSON.parse(data)
                newData.swiper.splice(index, 1)
                const _data = JSON.stringify(newData)
                fs.writeFile(file, _data, function (err) {
                    if (err) {
                        return next(err)
                    }
                    res.sendResult(null, 200, '删除成功')
                })
            }
        })
    } catch (err) {
        next(err)
    }
}

// 增加轮播项
async function addSwiperItem(req, res, next) {
    const state = tokenObj.verify(req.token)
    if (!state) {
        return res.status(403).sendResult(null, 403, '无效token！')
    }
    try {
        const { newItem } = req.body
        let file = path.join(__dirname, '../model/static/swiper.json')
        fs.readFile(file, 'utf-8', function (err, data) {
            if (err) {
                res.sendResult(null, 500, '文件读取失败')
            } else {
                let newData = JSON.parse(data)
                newData.swiper.push(newItem)
                const _data = JSON.stringify(newData)
                fs.writeFile(file, _data, function (err) {
                    if (err) {
                        return next(err)
                    }
                    res.sendResult(null, 201, '添加成功')
                })
            }
        })
    } catch (err) {
        next(err)
    }
}


module.exports = {
    addGoods,
    getGoodsInfo,
    getGoodsList,
    SearchGoodsList,
    getOneUserGoodsList,
    deleteGoodsByID,
    toNormalByID,
    stopSelByID,
    addStocksByID,
    editGoodsByID,
    getSellerGoodsByID,
    getAuditData,
    goodsAudit,
    getAllGoodsList,
    getGoodsDetail,
    updateGoodsInfos,
    editState,
    getSeiperData,
    updateSwiperData,
    deleteSwiperItem,
    addSwiperItem
}