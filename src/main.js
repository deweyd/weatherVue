import { createApp } from 'vue'
import App from './App.vue'
import store from './../src/components/store';
import { createRouter, createWebHistory } from 'vue-router';
import AppUser from "@/components/AppUser/AppUser";
import AppMain from "@/components/AppMain/AppMain";
import AppVideo from "@/components/AppVideo/AppVideo";
import AppLike from "@/components/AppLike/AppLike";
const router = createRouter({
    routes: [{
        path: '/',
        component: AppMain
    }, {
        path: '/user',
        component: AppUser
    }, {
        path: '/likes',
        component: AppLike
    },
        {
            path: '/video',
            component: AppVideo
        }
    ],
    history: createWebHistory()
})


const app = createApp(App);
app.use(router);
app.use(store);
app.mount('#app');
console.log(store.state.searchQuery);

