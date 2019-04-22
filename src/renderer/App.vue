<template>
    <div id="app">
        <sidebar-menu :collapsed="true"
                      :menu="menu"
                      :show-one-child="true"
                      />
        <div style="margin-left: 100px; margin-top: 20px">
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'hunter1',
        data() {
            return {
                menu: [
                    {
                        header: true,
                        title: 'Main navigation'
                    },
                    {
                        href: '/lotka-volterra',
                        title: 'Lotka-Volterra',
                        icon: 'fa fa-dragon'
                    },
                    {
                        href: '/kermack-makkendrick',
                        title: 'Kermack-MakKendrick',
                        icon: 'fa fa-procedures'
                    },
                    {
                        href: '/jacob-monod',
                        title: 'Jacob-Monod',
                        icon: 'fa fa-bug'
                    },
                ],
                props: {
                    menu: {
                        type: Array,
                        required: true
                    },
                    collapsed: {
                        type: Boolean,
                        default: false
                    },
                    width: {
                        type: String,
                        default: '350px'
                    },
                    widthCollapsed: {
                        type: String,
                        default: '50px'
                    },
                    showChild: {
                        type: Boolean,
                        default: false
                    },
                    theme: { // available themes: 'white-theme'
                        type: String,
                        default: ''
                    },
                    showOneChild: {
                        type: Boolean,
                        default: false
                    },
                    rtl: {
                        type: Boolean,
                        default: false
                    }
                }
            }
        },
    }
</script>

<style lang="scss">
    @import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro:400,600');
    body,
    html {
        margin: 0;
        padding: 0;
    }
    body {
        font-family: 'Source Sans Pro', sans-serif;
        background-color: #f2f4f7;
    }
    #demo {
        padding-left: 350px;
    }
    #demo.collapsed {
        padding-left: 50px;
    }
    .demo {
        padding: 50px;
    }
    .badge-danger {
        background-color: #ff2a2a;
        color: #fff;
    }
    .container {
        max-width: 600px;
    }
    pre {
        color: #2a2a2e;
        background: #fff;
        border-radius: 2px;
        padding: 10px;
        overflow: auto;
    }
</style>
