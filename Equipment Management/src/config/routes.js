import { createRouter, createWebHistory } from 'vue-router'
const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: () => import('../components/views/Home.vue')
        },
        {
            path: '/register',
            component: () => import('../components/views/Register.vue')
        },
        {
            path: '/sign-in',
            component: () => import('../components/views/SignIn.vue')
        },
        {
            path: '/dashboard',
            component: () => import('../components/views/Dashboard.vue'),
        }
    ]
})

export default router