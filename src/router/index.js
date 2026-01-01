import { createRouter, createWebHistory } from 'vue-router'

import Adm from '../components/Adm.vue'
import List from '../components/List.vue'

const routes = [
  {
    path: '/',
    component: List
  },
  {
    path: '/adm',
    component: Adm
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
