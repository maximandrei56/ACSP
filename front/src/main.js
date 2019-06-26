// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import router from './router'
import App from './App'
import axios from 'axios'
import VueAxios from 'vue-axios'
import Vuetify from 'vuetify'
import VueHighlightJS from 'vue-highlightjs'
import 'vuetify/dist/vuetify.min.css'

Vue.config.productionTip = false

import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default.css'


// Tell Vue.js to use vue-highlightjs
Vue.use(VueHighlightJS)
Vue.use(VueMaterial)
Vue.use(VueAxios, axios)
Vue.use(Vuetify)


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {App},
  template: '<App/>'
})

// Vue.component('file-upload', VueUploadComp)
