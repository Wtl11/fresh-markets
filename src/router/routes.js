import {USER_TYPE} from '@utils/constant'
export default [
  {
    path: '/user',
    component: {render: h => h('router-view')},
    redirect: '/user/login',
    children: [
      // 登陆
      {
        path: '/user/login',
        name: 'login',
        component: () => import('@pages/login/login')
      },
    ]
  },
  {
    path: '/',
    redirect: '/home',
    component: {render: h => h('router-view')},
    children: [
      {
        path: '/home',
        name: 'home',
        component: () => import('@pages/client-view/client-view'),
      }
    ]
  },
  {
    path: '/manager',
    component: () => import('@pages/basic-layout/basic-layout'),
    redirect: '/manager/test-page',
    children: [
      // 测试页面注释
      {
        path: '/manager/test-page',
        name: 'test-page',
        meta: {
          title: '商品管理',
          icon: require('./icon-goods_manage1@2x.png'),
          iconSelected: require('./icon-goods_manage2@2x.png'),
          crumbs: ['商城2', '营销2', '营销计划2'],
          authority: [USER_TYPE.MERCHANT]
        },
        component: () => import('@pages/test-page/test-page'),
        children: [
          {
            path: '/manager/test-page/sample',
            name: 'sample',
            meta: {
              authority: [USER_TYPE.SUPER]
            },
            component: () => import('@pages/sample/sample')
          },
          {
            path: '/manager/test-page/other-pages',
            name: 'other-pages',
            component: () => import('@pages/other-pages/other-pages')
          },
          // 测试页面配置
          {
            path: '/manager/test-page/test-page1',
            name: 'test-page1',
            component: () => import('@pages/test-page1/test-page1')
          },
        ]
      },
      // a
      {
        path: '/manager/two-page',
        name: 'two-page',
        meta: {
          title: '店铺管理',
          icon: require('./icon-store_Information1@2x.png'),
          iconSelected: require('./icon-store_Information2@2x.png'),
          crumbs: ['商城33', '营销3', '营销计划3'],
          authority: [USER_TYPE.SUPER]
        },
        component: () => import('@pages/two-page/two-page'),
        children: [

        ]
      },
      // asdad
      {
        path: '/manager/hello-world',
        name: 'hello-world',
        meta: {
          title: '店铺管理4444',
          icon: require('./icon-store_Information1@2x.png'),
          iconSelected: require('./icon-store_Information2@2x.png'),
          crumbs: ['商城33', '营销3', '营销计划3'],
          authority: [USER_TYPE.SUPER]
        },
        component: () => import('@pages/hello-world/hello-world')
      },
      // asda
      {
        path: '/manager/ttt-zzz',
        name: 'ttt-zzz',
        meta: {
          title: '店铺管理5555',
          icon: require('./icon-store_Information1@2x.png'),
          iconSelected: require('./icon-store_Information2@2x.png'),
          crumbs: ['商城33', '营销3', '营销计划3'],
          authority: [USER_TYPE.SUPER]
        },
        component: () => import('@pages/ttt-zzz/ttt-zzz')
      },
      // 店铺信息
      {
        path: '/manager/shop-info',
        name: 'shop-info',
        component: () => import('@pages/shop-info/shop-info')
      },
      // 新建/编辑商品
      {
        path: '/manager/edit-goods',
        name: 'edit-goods',
        component: () => import('@pages/edit-goods/edit-goods')
      },
    ]
  },
  {
    path: '*',
    name: 'NOT_FOUND',
    hideInMenu: true,
    component: require('@pages/_404/_404').default,
    props: true
  }
]

// function lazyLoadView(AsyncView) {
//   const AsyncHandler = () => ({
//     component: AsyncView,
//     loading: require('@pages/_loading/_loading').default,
//     delay: 400,
//     error: require('@pages/_timeout/_timeout').default,
//     timeout: 10000
//   })
//
//   return Promise.resolve({
//     functional: true,
//     render(h, {data, children}) {
//       // 将属性和方法传递给所有展示组件
//       return h(AsyncHandler, data, children)
//     }
//   })
// }
