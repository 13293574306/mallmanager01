// 插件模块

import axios from 'axios'

const MyHttpServer = {}

MyHttpServer.install = (Vue) => {
    axios.default.baseURL = 'http://localhost:3000/api/private/vl/'
    //  添加实例方法
    Vue.prototype.$http = axios
}

export default MyHttpServer