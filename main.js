import App from './App'

// #ifndef VUE3
import Vue from 'vue'
import uView from 'uview-ui'
import filter from '@/common/filters'

Vue.use(uView)
import { VueJsonp } from 'vue-jsonp' 
Vue.use(VueJsonp)
// 如此配置即可
// uni.$u.config.unit = 'rpx'
Vue.config.productionTip = false
import store from './store'
Vue.prototype.$store = store
import util from '@/common/utils'
Vue.prototype.$util = util

import config from '@/common/config.js';
//全局注入图片服务器地址，使用的时候直接用
//服务器图片
Vue.prototype.$baseUrl = config.base_url;
Vue.prototype.$baseTit = config.base_tit;
Vue.prototype.$baseWxMapKey = config.base_wx_map_key;
import wLoading from "@/components/w-loading.vue";
Vue.component('w-loading',wLoading)
//小程序邀请分享
// 导入并挂载全局的分享方法
import share from '@/mixins/share.js'
Vue.mixin(share)

App.mpType = 'app'
const app = new Vue({
    ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif