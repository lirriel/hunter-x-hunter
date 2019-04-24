import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'
import BootstrapVue from 'bootstrap-vue'
// app.js
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import VueApexCharts from 'vue-apexcharts'
import VueSidebarMenu from 'vue-sidebar-menu'
import 'vue-sidebar-menu/dist/vue-sidebar-menu.css'
import '@fortawesome/fontawesome-free/css/all.css'
import '@fortawesome/fontawesome-svg-core'
import VueP5 from 'vue-p5';

Vue.use(VueSidebarMenu);
Vue.use(BootstrapVue);
Vue.use('apexchart', VueApexCharts);
Vue.use(VueP5);
if (!process.env.IS_WEB) Vue.use(require('vue-electron'));
Vue.http = Vue.prototype.$http = axios;

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
    components: {App},
    router,
    store,
    template: '<App/>'
}).$mount('#app');
