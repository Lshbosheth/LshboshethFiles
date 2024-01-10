import type { App } from 'vue';
import { createRouter, createWebHistory } from "vue-router";

const routes = [
    {
        path: '/',
        redirect: '/home',
    },
    {
        path: '/home',
        component: () => import('../views/home.vue'),
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export function setupRouter(app: App) {
    app.use(router);
}
export default router
