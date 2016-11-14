
import Anime from './views/Anime.vue'
import Animes from './views/Animes.vue'


export default [
    {
      name: 'animes',
      path: '/',
      component: Animes
    },
    {
      name: 'anime',
      path: '/:id',
      component: Anime
    }
  ]

