import { createApp } from 'vue'
import App from './App.vue'
import router from "./router";
import i18n from './i18n'
import store from "./state/store";

import BootstrapVue3 from 'bootstrap-vue-3';
import VueApexCharts from "vue3-apexcharts";
import Maska from 'maska';
import 'vue-select/dist/vue-select.css';

import '@/assets/scss/config/saas/app.scss';

createApp(App)
    .use(store)
    .use(router)
    .use(VueApexCharts)
    .use(BootstrapVue3)
    .use(Maska)
    .use(i18n)
    .mount('#app')