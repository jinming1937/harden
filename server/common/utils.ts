import axios from 'axios'
import { PORT, publicPath } from '../../build/webpack.base.config';

export function getTemplate(filename: string) {
  return axios.get<string>(`http://localhost:${PORT}${publicPath}${filename}`) // 注意这个 'publicPath' 公共资源前缀非常重要
    .then(res => {
      return res.data;
    })
}
