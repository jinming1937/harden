// server/common/utils.js 文件
import axios from 'axios'
// import CONFIG from '../../build/config'

export function getTemplate (filename: string) {
    return new Promise((resolve, reject) => {
        axios.get(`http://localhost:8888/public/views/${filename}`) // 注意这个 'public' 公共资源前缀非常重要
        .then(res => {
            resolve(res.data)
        })
        .catch(reject)
    })
}
