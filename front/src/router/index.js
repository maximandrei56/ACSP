import Vue from 'vue'
import Router from 'vue-router'
import AddFirstProjectHome from '@/components/AddFirstProjectHome'
import NewProject from '@/components/NewProject'
import MyProjects from '@/components/MyProjects'
import MainMenu from '@/components/MainMenu'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'MainMenu',
      component: MainMenu
    },
    {
      path: '/addFirst',
      name: 'AddFirstProjectHome',
      component: AddFirstProjectHome
    },
    {
      path: '/NewProject',
      name: 'NewProject',
      component: NewProject
    },
    {
      path: '/MyProjects',
      name: 'MyProjects',
      component: MyProjects
    }
  ],
  mode: 'history'
})
