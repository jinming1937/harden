import path, { resolve } from 'path'
import glob from 'glob'
import HtmlWebpackPlugin from 'html-webpack-plugin'

const Path_Reg = /(\/|\/\/|\\|\\\\)/g;

export const PORT = 9977;

export const publicPath = '/public/views/'

// webpack 入口文件
export const entry = ((filepathList) => {
  let __entry = {}
  filepathList.forEach(filepath => {
    const list = filepath.split(Path_Reg).pop() // 斜杠分割文件目录
    const key = list?.replace(/\.ts$/g, '') || '' // 拿到文件的 filename
    // 如果是开发环境，才需要引入 hot module
    Object.assign(__entry, {
      [key]: process.env.NODE_ENV === 'development' ? [filepath, 'webpack-hot-middleware/client?reload=true'] : filepath
    });
  })
  return __entry
})(glob.sync(resolve(__dirname, '../src/page/*.ts')))

export const hwpList = ((filepathList) => {
  // 打包文件
  return filepathList.map((filepath) => {
    const filename = filepath.split(Path_Reg).pop()                 // 斜杠分割文件目录 // 拿到文件的 filename
    const fileChunk = filename?.replace(/\.ejs$/, '') || ''         // 获取到对应视图文件的 chunkname
    const chunks = ['manifest', 'vendors', fileChunk]               // 组装 chunks 数组
    return new HtmlWebpackPlugin({ filename, template: filepath, chunks })    // 返回 HtmlWebpackPlugin 实例
  });
})(glob.sync(resolve(__dirname, '../src/tpls/*.ejs')))

export const rules = [
  {
    test: /\.ejs$/,
    use: [
      {
        loader: 'html-loader', // 使用 html-loader 处理图片资源的引用
        options: {
          attrs: ['img:src', 'img:data-src']
        }
      },
      {
        loader: 'ejs-html-loader', // 使用 ejs-html-loader 处理 .ejs 文件的 includes 语法
        options: {
          production: process.env.ENV === 'production'
        }
      }
    ]
  }
]

export default {
  entry,
  output: {
    filename: 'static/[name].js',
    publicPath,
  },
  // ...
  module: {
    rules: [...rules]
  },
  plugins: [
    // 打包文件
    ...glob.sync(resolve(__dirname, '../src/tpls/*.ejs')).map((filepath, i) => {
      const tempList = filepath.split(Path_Reg)           // 斜杠分割文件目录
      const filename = `views/${tempList[tempList.length - 1]}`       // 拿到文件的 filename
      const template = filepath                                       // 指定模板地址为对应的 ejs 视图文件路径
      const fileChunk = filename.split('.')[0].split(Path_Reg).pop() // 获取到对应视图文件的 chunkname
      const chunks = ['manifest', 'vendors', fileChunk || '']               // 组装 chunks 数组
      return new HtmlWebpackPlugin({ filename, template, chunks })    // 返回 HtmlWebpackPlugin 实例
    })
  ]
}
