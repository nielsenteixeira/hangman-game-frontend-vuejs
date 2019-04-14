import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login.vue'
import Hangman from '@/components/Hangman.vue'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            redirect: {
                name: "Login",
            }
        },
        {
            path: "/auth",
            name: "Login",
            component: Login
        },
        {
            path: "/hangman",
            name: "Hangman",
            component: Hangman
        }
    ]
})