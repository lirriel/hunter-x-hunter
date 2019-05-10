<template>
    <div id="app">
        <sidebar-menu :collapsed="true"
                      :menu="menu"
                      :show-one-child="true"
        ></sidebar-menu>
        <div style="margin-left: 80px; margin-top: 20px">
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'hunter-x-hunter',
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
                    {
                        href: '/game',
                        title: 'Game',
                        icon: 'fa fa-chess-board'
                    }
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
    @import url('https://fonts.googleapis.com/css?family=Karla');

    body,
    html {
        margin: 0;
        font-family: 'Karla', sans-serif;
        padding: 0;
    }

    body {
        font-family: 'Karla', sans-serif;
        /*font-family: 'Source Sans Pro', sans-serif;*/
        background-color: #f77070;
    }

    label {
        font-family: 'Karla', sans-serif;
        color: black;
    }

    h1, h2, h3, h4, h5 {
        font-family: 'Karla', sans-serif;
        color: black;
    }

    #b-row {
        margin-top: 10px;
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
        color: #ff30aa;
    }

    .container {
        max-width: 600px;
    }

    pre {
        color: #2a2a2e;
        background: #ff2f7e;
        border-radius: 2px;
        padding: 10px;
        overflow: auto;
    }
</style>
