/* 
     负责处理分类信息的模块
*/

const tokenObj = require('../utils/token')
const Goods = require('../model/goods')
const Sort = require('../model/sort')
// const lodash = require('lodash')
const moment = require('moment')


// 主页楼层的商品数据
async function getFloorData(req, res, next) {
    try {
        let { count } = req.query
        count = count ? count : 3
        const floorData = await Sort.find({ category_show: true }).lean()
        if (floorData.length === 0) {
            return res.sendResult(null, 404, '没有任何分类数据！')
        }
        // const sortNameArray = []
        // 终极版本
        floorData.forEach(async (v, i) => {
            // v._created_time = moment(v.created_time).format("YYYY-MM-DD HH:mm")
            const data = await Goods.find({ goods_type: v.sort_name,status: {$lte:2}}).sort({ _id: -1 }).limit(count).lean()
            v.children = data
            v.goodsCount = data.length
            if (floorData.length - 1 === i) {
                res.sendResult({ floorData, count })
            }
        })
        // 原来的写法
        // sortNameArray.forEach((v, i) => {
        //     Goods.find({ goods_type: v }, (err, data) => {
        //         if (err)
        //             next(err)
        //         sortsData[i].children = data
        //         if (sortNameArray.length - 1 === i) {
        //             res.sendResult({ sortsData, count, sortNameArray })
        //         }
        //     }).lean()
        // })

        // 优化后的写法 
        // sortNameArray.forEach(async (v, i) => {
        //     const data = await Goods.find({ goods_type: v }).lean()
        //     sortsData[i].children = data
        //     if (sortNameArray.length - 1 === i) {
        //         res.sendResult({ sortsData, count, sortNameArray })
        //     }
        // })

        // 终极版本直接在数据里面循环插入异步数据 在执行完后返回结果
        // sortsData.forEach(async (v, i) => {
        //     sortNameArray.push(v.sort_name)
        //     // v._created_time = moment(v.created_time).format("YYYY-MM-DD HH:mm")
        //     const data = await Goods.find({ goods_type: v.sort_name }).sort({ _id: -1 }).limit(count).lean()
        //     v.children = data
        //     if (sortsData.length - 1 === i) {
        //         res.sendResult({ sortsData, count, sortNameArray })
        //     }
        // })

    } catch (err) {
        next(err)
    }
}

// 分类数据
async function getCategoriesData(req, res, next) {
    try {
        const sortsData = await Sort.find({ category_show: true }).lean()
        if (sortsData.length === 0) {
            return res.sendResult(null, 404, '没有任何分类数据！')
        }
        sortsData.forEach(async (v, i) => {
            // v._created_time = moment(v.created_time).format("YYYY-MM-DD HH:mm")
            const data = await Goods.find({ goods_type: v.sort_name,status: {$lte:2}}).sort({ _id: -1 }).lean()
            v.children = data
            if (sortsData.length - 1 === i) {
                res.sendResult(sortsData)
            }
        })
    } catch (err) {
        next(err)
    }
}

// 添加分类 (测试用)
async function addNewSort(req, res, next) {
    const state = tokenObj.verify(req.token)
    if (!state) {
        return res.status(403).sendResult(null, 403, '无效token！')
    }
    const { sort_name } = req.body
    try {
        const data = await new Sort({ sort_name }).save()
        res.sendResult(data)
    } catch (err) {
        next(err)
    }
}


async function getCategoriesName(req,res,next){
    try {
        const sortsData = await Sort.find({ category_show: true },{sort_name: 1}).lean()
        if (sortsData.length === 0) {
            return res.sendResult(null, 404, '没有任何分类数据！')
        }
        let names = []
        sortsData.forEach((item,index)=>{
            names.push(item.sort_name)
        })
        res.sendResult(names)
    } catch (err) {
        next(err)
    }
}


module.exports = {
    getFloorData, getCategoriesData, addNewSort,getCategoriesName
}