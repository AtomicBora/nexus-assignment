import { createRouter, createWebHistory } from 'vue-router'
import VehiclePiniaView from '../views/VehiclePiniaView.vue'
import NotFoundView from '@/views/NotFoundView.vue'
import VehicleView from '@/views/VehicleView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/vehicle',
      name: 'vehicle-no-pinia',
      component: VehicleView,
    },
    {
      path: '/vehicle-pinia',
      name: 'vehicle-pinia',
      component: VehiclePiniaView,
    },
    {
      path: '/:pathMatch(.*)',
      name: 'not-found',
      component: NotFoundView,
    },
  ],
})

export default router
