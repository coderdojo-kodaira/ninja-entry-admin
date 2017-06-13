import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import EntryList from '@/components/EntryList'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/entries',
      name: 'Entries',
      component: EntryList
    }
  ]
})
