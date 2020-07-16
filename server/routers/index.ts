import e from 'express'
import ejs from 'ejs'
import {getTemplate} from '../common/utils'

const json_data = {errors: null, message: '', status: 200, data: []}

const homeRoute = function (app: e.Express) {
	app.get('/', async (req, res, next) => {
		try {
			const template = await getTemplate('index.ejs') // 获取 ejs 模板文件
			let html = ejs.render(template, {title: '首页'})
			res.send(html)
		} catch (e) {
			next(e)
		}
	})
	app.get('/home', async (req, res, next) => {
		try {
			const template = await getTemplate('home.ejs') // 获取 ejs 模板文件
			let html = ejs.render(template, {title: '首页'})
			res.send(html)
		} catch (e) {
			next(e)
		}
	})
	app.get('/consult', async (req, res, next) => {
		try {
			// const template = await getTemplate('home.ejs') // 获取 ejs 模板文件
			// let html = ejs.render(template, { title: '首页' })
			res.send(json_data)
		} catch (e) {
			next(e)
		}
	})
	app.get('/get_city', async (req, res, next) => {
		try {
			// const template = await getTemplate('home.ejs') // 获取 ejs 模板文件
			// let html = ejs.render(template, { title: '首页' })
			res.send(json_data)
		} catch (e) {
			next(e)
		}
	})
}
export function routerFactory() {
	console.log(1)
}
export default homeRoute
