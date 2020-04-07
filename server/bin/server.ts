import path from 'path'
import express, { ErrorRequestHandler, RequestHandler } from 'express'
import webpack from 'webpack'
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'
import homeRoute, { routerFactory } from '../routers'
import webpackConfig from '../../build/webpack.dev.config'
import { PORT } from '../../build/webpack.base.config'
const isDev = process.env.NODE_ENV === 'development'
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
app.use('/favicon.ico', express.static(path.resolve(__dirname, '../../favicon.ico')))
app.use(webpackConfig.output.publicPath, express.static(path.resolve(__dirname, isDev ? '../../src/tpls/' : '../../dist')))

// 构造路由
homeRoute(app)

// 错误处理
app.use((req, res, next) => {
    console.log(req);
    res.status(500)
    res.send(`Service Error`)
})

app.listen(PORT, () => console.log(`development is listening on port 8088`))
