import Vue from 'vue'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
import routes from './route-config'
import App from './App.vue'
// import store from './vuex/store'

Vue.use(VueRouter)
Vue.use(VueResource)

const router = new VueRouter(routes)

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
