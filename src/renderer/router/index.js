import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            name: 'home',
            component: require('@/components/LandingPage').default
        },
        {
            path: '/kermack-makkendrick',
            name: 'kermackMakKendrick',
            component: require('@/components/KermackMakKendrick').default
        },
        {
            path: '/lotka-volterra',
            name: 'LotkaVolterra',
            component: require('@/components/LotkaVolterra').default
        },
        {
            path: '/jacob-monod',
            name: 'JacobMonod',
            component: require('@/components/JacobMonod').default
        },
        {
            path: '/game',
            name: 'Game',
            component: require('@/components/PredatorPreyApp').default
        },
        {
            path: '*',
            redirect: '/'
        }
    ]
})
