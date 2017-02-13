import Vue from 'vue'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
import routes from './route-config'
import App from './App.vue'
// import store from './vuex/store'

import './css/reset.css'
import './css/login.css'
import './css/center.css'

Vue.use(VueRouter)
Vue.use(VueResource)

// cookie跨域
Vue.http.interceptors.push(function(req, next) {
  req.credentials = true
  next()
});


const router = new VueRouter({routes})

// Vue.http.options.root = '/root';
// Vue.http.headers.common['Authorization'] = 'Basic YXBpOnBhc3N3b3Jk';

new Vue({
  el: '#app',
  // store,
  router,
  // http: {
  //   root: '/root',
  //   headers: {
  //     Authorization: 'Basic YXBpOnBhc3N3b3Jk'
  //   }
  // },
  render: h => h(App)
})


