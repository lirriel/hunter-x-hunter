import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/game'
        },
        {
            path: '/kermack-makkendrick',
            name: 'kermackMakKendrick',
            component: require('@/components/main-frames/KermackMakKendrick').default
        },
        {
            path: '/lotka-volterra',
            name: 'LotkaVolterra',
            component: require('@/components/main-frames/LotkaVolterra').default
        },
        {
            path: '/jacob-monod',
            name: 'JacobMonod',
            component: require('@/components/main-frames/JacobMonod').default
        },
        {
            path: '/game',
            name: 'Game',
            component: require('@/components/main-frames/PredatorPreyApp').default
        },
        {
            path: '*',
            redirect: '/'
        }
    ]
})
