import Vue from 'vue'
import App from './App'
// 导入 store 的实例对象
import store from './store/store.js'
// 1.导入网络请求的包
import { $http } from '@escook/request-miniprogram'
uni.$http = $http
// 请求的根路径
$http.baseUrl = 'https://www.uinav.com'
// 请求拦截器
$http.beforeRequest = function(options) {
  console.log(options)
  //loding的弹窗
  uni.showLoading({
    title: '数据加载中...'
  })
  // 判断请求的是否为有权限的 API 接口
  //原因说明：只有在登录之后才允许调用支付相关的接口，所以必须为有权限的接口添加身份认证的请求头字段
    if (options.url.indexOf('/my/') !== -1) {
      // 为请求头添加身份认证字段
      options.header = {
        // 字段的值可以直接从 vuex 中进行获取
        Authorization: store.state.m_user.token
      }
    }
}
// 响应拦截器
$http.afterRequest = function() {
  //关闭loding
  uni.hideLoading()
}

//2. 封装弹框的方法
uni.$showMsg = function(title = '数据请求失败！', duration = 1500) {
  uni.showToast({
    title,
    duration,
    icon: 'none'
  })
}

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App,
    store
})
app.$mount()
