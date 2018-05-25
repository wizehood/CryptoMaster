import Vue from 'vue'
import Vue2Filters from 'vue2-filters'
import App from './components/App'
import router from './router'
import store from './store'
import { sync } from 'vuex-router-sync'

Vue.use(Vue2Filters)

// Sync Vue router and the Vuex store
sync(store, router)

new Vue({
  el: '#app',
  store,
  router,
  template: '<App/>',
  components: { App }
})

store.dispatch('checkLoggedIn')