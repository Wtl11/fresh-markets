import Vue from 'vue'
import VueRouter from 'vue-router'
import VueMeta from 'vue-meta'
import NProgress from 'nprogress/nprogress'
import routes from './routes'
import {findLast} from 'lodash'
import {USER_TYPE} from '@utils/constant'
import store from '@state/store'
import API from '@api'
// import storage from 'storage-controller'
// import HTTP from '@utils/http'
// import {app as APP} from '../main'

NProgress.configure({showSpinner: false})

Vue.use(VueRouter)
Vue.use(VueMeta, {
  keyName: 'page'
})

// const LOGIN_PATH = '/user/login'
// const FORBID_PATH = '/forbid'

const router = new VueRouter({
  routes,
  mode: process.env.NODE_ENV === 'production' ? 'history' : '',
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return {x: 0, y: 0}
    }
  }
})

router.beforeEach(async (routeTo, routeFrom, next) => {
  if (routeFrom.name !== null) {
    NProgress.start()
  }
  // let identity = store.getters['auth/currentUserType']
  let record = findLast(routeTo.matched, (record) => record.meta.authority)
  if (record && record.meta.authority.some((val) => val === USER_TYPE.INFORMATION)) {
    API.Auth.validateInformation().then(res => {
      store.dispatch('auth/setTokenInformation', res.data && res.data.access_token)
    })
  }
  // if (record && !identity && routeTo.path !== LOGIN_PATH) {
  //   try {
  //     let res = await API.Auth.validate()
  //     setGlobalParams(res.data)
  //     return next()
  //   } catch (e) {
  //     if (routeTo.path !== LOGIN_PATH) {
  //       NProgress.done()
  //       return next({path: LOGIN_PATH})
  //     }
  //   }
  // }
  // if (record && !record.meta.authority.some((val) => val === identity)) {
  //   if (routeTo.path !== LOGIN_PATH) {
  //     NProgress.done()
  //     routeTo.path === routeFrom.path && APP && APP.$toast.show('权限不足,请联系管理员.')
  //     return next({path: LOGIN_PATH})
  //   }
  // }
  return next()
})

router.beforeResolve(async (routeTo, routeFrom, next) => {
  try {
    for (const route of routeTo.matched) {
      await new Promise((resolve, reject) => {
        if (route.meta && route.meta.beforeResolve) {
          route.meta.beforeResolve(routeTo, routeFrom, (...args) => {
            if (args.length) {
              if (routeFrom.name === args[0].name) {
                NProgress.done()
              }
              next(...args)
              reject(new Error('Redirected'))
            } else {
              resolve()
            }
          })
        } else {
          resolve()
        }
      })
    }
  } catch (error) {
    return
  }
  next()
})

router.afterEach((routeTo, routeFrom) => {
  NProgress.done()
})

export default router
