import Vue from 'vue'
import VueResource from 'vue-resource'
import App from './App.vue'

import './style.css'

Vue.use(VueResource)

// cookie跨域
Vue.http.interceptors.push(function(req, next) {
  req.credentials = true
  next()
});



// Vue.http.options.root = '/root';
// Vue.http.headers.common['Authorization'] = 'Basic YXBpOnBhc3N3b3Jk';

new Vue({
  el: '#app',
  // store,
  // http: {
  //   root: '/root',
  //   headers: {
  //     Authorization: 'Basic YXBpOnBhc3N3b3Jk'
  //   }
  // },
  render: h => h(App)
})


