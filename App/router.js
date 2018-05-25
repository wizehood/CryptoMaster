import Vue from 'vue'
import Router from 'vue-router'
import store from './store'
import Login from './components/Login.vue'
import Signup from './components/Signup.vue'
import CurrencyList from './components/CurrencyList.vue'
import PurchaseList from './components/PurchaseList.vue'

Vue.use(Router)

function requireAuth (to, from, next) {
  if (!store.state.loggedIn) {
    next({
      path: '/login',
      query: { redirect: to.path }
    })
  } else {
    next()
  }
}

export default new Router({
  mode: 'history',
  base: __dirname,
  routes: [
    { path: '/', component: CurrencyList /*,beforeEnter: requireAuth*/ },
    { path: '/login', component: Login },
    { path: '/signup', component: Signup },
    { path: '/purchases', component: PurchaseList, beforeEnter: requireAuth },
    { path: '/logout',
      async beforeEnter (to, from, next) {
        await store.dispatch('logout')
      }
    }
  ]
})