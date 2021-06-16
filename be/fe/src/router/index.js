import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Review from '../views/Review.vue'
import FreeBoard from '../views/FreeBoard.vue'
import FreeBoard2 from '../views/FreeBoard2.vue'
import SearchRank from '../views/SearchRank.vue'
import E404 from '../views/e404.vue'
Vue.use(VueRouter)

const routes = [
  {
    path: '/review',
    name: 'Review',
    component:  Review
  },
  {
    path: '/board',
    name: 'FreeBoard',
    component:  FreeBoard
  },
  {
    path: '/board2',
    name: 'FreeBoard2',
    component:  FreeBoard2
  },
  {
    path: '/rank',
    name: 'Rank',
    component:  SearchRank
  },
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '*',
    name: 'error',
    component: E404
  }

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
