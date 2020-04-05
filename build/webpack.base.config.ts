// webpack.base.config.js 部分代码
import path, { resolve } from 'path'
import webpack from 'webpack'
import glob from 'glob'

// webpack 入口文件
const entry = ((filepathList) => {
    let __entry = {}
    filepathList.forEach(filepath => {
        const list = filepath.split(/[\/|\/\/|\\|\\\\]/g) // 斜杠分割文件目录
        const key = list[list.length - 1].replace(/\.js/g, '') // 拿到文件的 filename
        // 如果是开发环境，才需要引入 hot module
        Object.assign(__entry, {
            [key]: process.env.NODE_ENV === 'development' ? [filepath, 'webpack-hot-middleware/client?reload=true'] : filepath
        });
    })
    return __entry
})(glob.sync(resolve(__dirname, '../src/js/*.js')))

export default {
    entry: entry,
    // ...
}
