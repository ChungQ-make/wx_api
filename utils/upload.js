/**
 *  负责文件上传操作的模块
 *  参考资料：http://codingdict.com/questions/76478
 *           https://www.cnblogs.com/wjlbk/p/12633320.html
 */

const multer = require('multer')
const path = require('path')


/**
 * 文件上传函数参数项
 * @param {String} uploadUrl 存储路径（默认为'./upload/files'）
 * @param {String} filesName 接受一个以 fieldname 命名的文件数组 这些文件的信息保存在 req.files
 * @param {Number} maxCount 可以配置 maxCount 来限制上传的最大数量（默认 1 ）
 * @param {Array} typeArr 设置允许的上传的文件类型
 * @param {Number} fileSize 设置允许的上传的文件大小（默认10m）
 */
function uploadSetting(uploadUrl, filesName, maxCount, typeArr, fileSize) {
    const _uploadUrl = uploadUrl || './upload/files'
    const _filesName = filesName || 'files'
    const _maxCount = maxCount || 1
    const _typaArr = typeArr || []
    const _fileSize = fileSize || 1024 * 1024 * 10

    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, _uploadUrl)
        },
        filename: function (req, file, cb) {
            cb(null, `${Date.now()}-${file.originalname}`)
        }
    })

    const upload = multer({ //multer settings
        storage: storage,
        fileFilter: function (req, file, callback) {
            const ext = path.extname(file.originalname)
            let state = false
            // console.log(ext)
            _typaArr.length ? _typaArr.forEach((value) => {
                // console.log(value)
                if (value === ext) {
                    state = true
                }
            }) : state = true

            state ? callback(null, true) : callback(new Error('File format error'), false)

            //  callback(null, true) 接受这个文件 callback(null, false) 拒绝这个文件 
            //  callback(new Error('Only images are allowed')) 抛出错误
        },
        limits: {
            fileSize: _fileSize
        }
    }).array(_filesName, _maxCount)

    return upload
}

module.exports = {
    uploadSetting,
    multer
}