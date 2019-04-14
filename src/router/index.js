import Vue from 'vue'
import Router from 'vue-router'
import Hangman from '@/components/Hangman.vue'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            redirect: {
                name: "Hangman",
            }
        },
        {
            path: "/hangman",
            name: "Hangman",
            component: Hangman
        }
    ]
})