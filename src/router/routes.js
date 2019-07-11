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
      }
    ]
  },
  {
    path: '/',
    redirect: '/information',
    component: {render: h => h('router-view')},
    children: [
      {
        path: '/home',
        name: 'home',
        component: () => import('@pages/client-view/client-view')
      },
      {
        path: '/information',
        name: 'information',
        component: () => import('@pages/information/information')
      },
      {
        path: '/goods-detail',
        name: 'goods-detail',
        component: () => import('@pages/goods-detail/goods-detail')
      }
    ]
  },
  {
    path: '/manager',
    component: () => import('@pages/basic-layout/basic-layout'),
    redirect: '/manager/p-goods-manage',
    children: [
      // 测试页面注释
      {
        path: '/manager/p-goods-manage',
        name: 'p-goods-manage',
        meta: {
          title: '商品管理',
          icon: require('./icon-goods_manage1@2x.png'),
          iconSelected: require('./icon-goods_manage2@2x.png'),
          crumbs: ['管理后台', '商品管理'],
          authority: [USER_TYPE.SUPER]
        },
        component: () => import('@pages/p-goods-manage/p-goods-manage')
      },
      {
        path: '/manager/p-supplier-manage',
        name: 'p-supplier-manage',
        meta: {
          title: '供应商管理',
          icon: require('./icon-goods_manage1@2x.png'),
          iconSelected: require('./icon-goods_manage2@2x.png'),
          crumbs: ['管理后台', '供应商管理'],
          authority: [USER_TYPE.SUPER]
        },
        component: () => import('@pages/p-supplier-manage/p-supplier-manage')
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
