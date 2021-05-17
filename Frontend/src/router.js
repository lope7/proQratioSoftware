import Vue from 'vue'
import Router from 'vue-router'
import Categorie from './components/Categorie.vue'
import store from './store'
import Home from './components/Home.vue'
import Login from './components/Login.vue'
import User from './components/User.vue'
import Article from './components/Article.vue'
import Client from './components/Client.vue'
import Creditor from './components/Creditor.vue'
import Employee from './components/Employee.vue'
import Provider from './components/Provider.vue'
import Order from './components/Order.vue'
import Sale from './components/Sale.vue'
import Bank from './components/Bank.vue'
import Meeting from './components/Meeting.vue'
import Loan from './components/Loan.vue'


Vue.use(Router)

var router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      meta: {
        admin: true,
        warehouseManager: true,
        salesManager: true
      }
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: {
        freeAccess: true
      }
    },
    {
      path: '/categorie',
      name: 'categorie',
      component: Categorie,
      meta: {
        admin: true,
        warehouseManager: true,
      }
    },

   {
      path: '/meeting',
      name: 'meeting',
      component: Meeting,
      meta: {
        admin: true
      }
    },
    {
      path: '/bank',
      name: 'bank',
      component: Bank,
      meta: {
        admin: true,
        warehouseManager: true,
      }
    },
    {
      path: '/article',
      name: 'article',
      component: Article,
      meta: {
        admin: true,
        warehouseManager: true,
      }
    },
    {
      path: '/order',
      name: 'order',
      component: Order,
      meta: {
        admin: true,
        warehouseManager: true,
      }
    },
    {
      path: '/loan',
      name: 'loan',
      component: Loan,
      meta: {
        admin: true,
      }
    },
    {
      path: '/client',
      name: 'client',
      component: Client,
      meta: {
        admin: true,
        salesManager: true,
      }
    },
    {
      path: '/employee',
      name: 'employee',
      component: Employee,
      meta: {
        admin: true
      }
    },
    {
      path: '/creditor',
      name: 'creditor',
      component: Creditor,
      meta: {
        admin: true,
        salesManager: true,
      }
    },
    {
      path: '/sale',
      name: 'sale',
      component: Sale,
      meta: {
        admin: true,
        salesManager: true,
      }
    },
    {
      path: '/provider',
      name: 'provider',
      component: Provider,
      meta: {
        admin: true,
        warehouseManager: true,
      }
    },
    {
      path: '/user',
      name: 'user',
      component: User,
      meta: {
        admin: true,
      }
    }
  ]
})
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.freeAccess)) {
    next();
  } else if (store.state.user && store.state.user.role == 'Administrador') {
    if (to.matched.some(record => record.meta.admin)) {
      next();
    }
  } else if (store.state.user && store.state.user.role == 'Ventas') {
    if (to.matched.some(record => record.meta.warehouseManager)) {
      next();
    }
  } else if (store.state.user && store.state.user.role == 'Almacen') {
    if (to.matched.some(record => record.meta.salesManager)) {
      next();
    }
  } else {
    next({ name: 'login' });
  }
})
export default router
