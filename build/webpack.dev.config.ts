// import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import ForkTsCheckerNotifierWebpackPlugin from 'fork-ts-checker-notifier-webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import FriendlyErrorsPlugin, {Severity} from 'friendly-errors-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import path from 'path';
import webpack, { Configuration, Options, Node } from 'webpack'
import { EMode } from './type';

function resolve(dir: string): string {
    return path.join(__dirname, '..', dir);
}

export default {
    context: path.resolve(__dirname, '../'),
    entry: {
        main: './src/main.ts'
    },
    output: {
        filename: 'static/[name].js',
        publicPath: '/'
    },
    resolve: {
        extensions: ['.ts', '.js', '.less'],
        alias: {
            'cvs': resolve('src')
        }
    },
    module: {
        rules: [
            // {
            //     test: /\.less$/,
            //     use: [
            //         MiniCssExtractPlugin.loader,
            //         "less-loader"
            //     ]
            // },
            {
                test: /\.ts?$/,
                use: [
                    'cache-loader',
                    {
                        loader: 'ts-loader',
                        options: {
                            transpileOnly: true,
                            configFile: resolve('tsconfig.json'),
                            compilerOptions: {
                                module: 'commonjs',
                                target: 'es2016',
                                jsx: 'react'
                            }
                        }
                    }
                ],
                include: [
                    resolve('lit'),
                    resolve('src'),
                    resolve('static'),
                    resolve('util'),
                ],
                exclude: [
                    resolve('node_modules')
                ]
            },
            {
                test: /\.less$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: 'css-loader!less-loader?javascriptEnabled=true'
                })
            },
            {
                test: /\.(jpeg|jpg|png|gif|svg)$/,
                loader: ['url-loader?limit=10000&name=static/img/[name].[hash:8].[ext]']
            },
            {
                test: /\.(eot|ttf|woff|woff2)$/,
                loader: ['file-loader?name=static/font/[name].[hash:8].[ext]']
            }
        ]
    },
    plugins: [
        new ForkTsCheckerWebpackPlugin({}),
        new ForkTsCheckerNotifierWebpackPlugin({title: 'TypeScript', excludeWarnings: false}),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"development"'
            }
        }),

        new ExtractTextPlugin({
            filename: 'static/css/[name].[hash:8].css',
            allChunks: true
        }),
        // new MiniCssExtractPlugin({
        // // Options similar to the same options in webpackOptions.output
        // // both options are optional
        //     filename: "[name].css",
        //     chunkFilename: "[id].css"
        // }),

        new HtmlWebpackPlugin({
            title: 'Knowledge',
            filename: 'index.html',
            chunks: ['main'],
            template: path.join(__dirname, 'index.html'),
            inject: true
        }),

        new webpack.HotModuleReplacementPlugin(),

        new FriendlyErrorsPlugin({
            compilationSuccessInfo: {
                messages: [`Your application is running here: http://127.0.0.1:9961`],
                notes: []
            },
            onErrors(_: Severity, errors: string) {
                console.error(errors);
            }
        }),

        // new CopyWebpackPlugin([
        //     {
        //         from: resolve('static'),
        //         to: 'static',
        //         ignore: ['.*']
        //     }
        // ])
    ],
    devServer: {
        clientLogLevel: 'warning',
        historyApiFallback: {
            rewrites: [{
                from: /^\/$/,
                to: '/index.html'
            }]
        },
        hot: true,
        contentBase: false,
        compress: true,
        host: 'localhost',
        port: 9961,
        overlay: {warnings: false, errors: true},
        publicPath: '/',
        quiet: true,
        watchOptions: {
            poll: true
        },
        disableHostCheck: true
    },
    mode: EMode.dev,
    devtool: 'eval-source-map' as Options.Devtool,
    optimization: {
        minimize: false,
        namedModules: true,
        noEmitOnErrors: true
    },
    node: {
        console: false,
        process: true,
        // global: false,
        // __filename: false,
        // __dirname: false,
        // Buffer: false,
        setImmediate: false,
        dgram: 'empty',
        fs: 'empty',
        net: 'empty',
        tls: 'empty',
        child_process: 'empty'
    } as (false | Node)
};
