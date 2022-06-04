import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import PortalVue from 'portal-vue';
import './assets/tailwind.css'

Vue.config.productionTip = false

Vue.use(PortalVue);

new Vue({
  router,
  store,
  render: h => h(App),
  beforeCreate() {
		this.$store.commit('initialiseSettings');
	}
}).$mount('#app')
