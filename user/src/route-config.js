

import User from './views/User.vue'
import Login from './views/Login.vue'
import Center from './views/Center.vue'
import Register from './views/Register.vue'


export default [
    {
      name: 'user',
      path: '/',
      component: User
    },
    {
      name: 'login',
      path: '/login',
      component: Login
    },
    {
      name: 'center',
      path: '/center',
      component: Center
    },
    {
      name: 'register',
      path: '/register',
      component: Register
    },
  ]

