import { createApp } from 'vue'
import App from './App.vue'
import store from './../src/components/store';
import { createRouter, createWebHistory } from 'vue-router';
import AppMain from "@/components/AppMain/AppMain";
import AppSelected from "@/components/AppSelected/AppSelected";
const router = createRouter({
    routes: [{
        path: '/',
        component: AppMain
    }, {
        path: '/selected',
        component: AppSelected
    },
    ],
    history: createWebHistory()
})


const app = createApp(App);
app.use(router);
app.use(store);
app.mount('#app');
console.log(store.state.searchQuery);

