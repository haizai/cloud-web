import Online from './views/Online.vue'
import Outline from './views/Outline.vue'
import Index from './views/Index.vue'
import Room from './views/Room.vue'
import Ai from './views/Ai.vue'


export default [
    {
      name: 'index',
      path: '/',
      component: Index
    },
    {
      name: 'online',
      path: '/online',
      component: Online
    },
    {
      name: 'room',
      path: '/online/room/:num',
      component: Room
    },
    {
      name: 'outline',
      path: '/outline',
      component: Outline
    },
    {
      name: 'ai',
      path: '/ai',
      component: Ai
    },
  ]

