import { RouteRecordRaw, createWebHistory, createRouter } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/fighter',
    name: 'fighter',
    component: () => import('@/components/fighter/index.vue'),
    meta: {
      title: '飞机大战'
    }
  },
  {
    path: '/snake',
    name: 'snake',
    component: () => import('@/components/snake/index.vue'),
    meta: {
      title: '贪吃蛇'
    }
  }
]

const router = createRouter({
  routes,
  history: createWebHistory()
})

export default router
