import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/Homeview.vue'
import LoginView from '../views/LoginView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/home',
      name: 'HomeView',
      component: HomeView
    },
    {
      path: '/',
      name: 'LoginView',
      component: LoginView
    },
  ]
})

export default router
