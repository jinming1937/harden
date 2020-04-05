// server/bin/server.js 文件代码
import path from 'path'
import express, { ErrorRequestHandler, RequestHandler } from 'express'
import webpack from 'webpack'
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'
import homeRoute, { routerFactory } from '../routers'
import webpackConfig from'../../build/webpack.dev.config'
const isDev = process.env.NODE_ENV === 'development'
const port = 8088;
let app = express()
let compiler = webpack(webpackConfig)

// 开发环境下才需要启用实时编译和热更新
if (isDev) {
    // 用 webpack-dev-middleware 启动 webpack 编译
    app.use(webpackDevMiddleware(compiler, {
        publicPath: webpackConfig.output.publicPath,
    }))

    // 使用 webpack-hot-middleware 支持热更新
    app.use(webpackHotMiddleware(compiler, {
        noInfo: true
    }))
}

// 添加静态资源拦截转发
app.use(webpackConfig.output.publicPath, express.static(path.resolve(__dirname, isDev ? '../../src' : '../../dist')))

// 构造路由
homeRoute(app)

// 错误处理
app.use((req, res, next) => {
    res.status(500)
    res.send('Service Error')
})

app.listen(port, () => console.log(`development is listening on port 8888`))
