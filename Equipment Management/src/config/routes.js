import { createRouter, createWebHashHistory } from 'vue-router'
const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/', name: 'home',
            component: () => import('../components/views/Home.vue')
        },
        {
            path: '/register', name: 'register',
            component: () => import('../components/views/Register.vue')
        },
        {
            path: '/sign-in', name: 'sign-in',
            component: () => import('../components/views/SignIn.vue')
        },
        { 
            path: '/dashboard', name: 'dashboard',
            component: () => import('../components/views/Dashboard.vue'),
        },
        {
            path: '/equipmentProfile/:id', name: 'equipmentProfile',
            component: () => import('../components/views/EquipmentProfile.vue'),
        },
        {
            path: '/locationProfile/:id', name: 'locationProfile',
            component: () => import('../components/views/LocationProfile.vue'),
        },
        { 
            path: '/equipmentAddNew', name: 'equipmentAddNew',
            component: () => import('../components/views/EquipmentAddNew.vue'),
        },
        {
            path: '/user/:id', name: 'user',
            component: () => import('../components/views/User.vue'),
        }
    ]
})

export default router