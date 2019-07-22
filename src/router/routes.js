import {USER_TYPE} from '@utils/constant'

/**
 * 权限说明:
 *  请在对应的路由meta里添加authority: [USER_TYPE.XXX],
 *  表示哪种身份可以进入该路由,否则跳转至登录页面
 */
export default [
  {
    path: '/user',
    component: {render: (h) => h('router-view')},
    redirect: '/user/login',
    children: [
      // 登陆-平台
      {
        path: '/user/login-platform',
        name: 'login-platform',
        component: () => import('@pages/login-platform/login-platform')
      },
      // 登陆
      {
        path: '/user/login',
        name: 'login',
        component: () => import('@pages/login/login')
      },
      // 成为供应商
      {
        path: '/user/apply-suppliers',
        name: 'apply-suppliers',
        component: () => import('@pages/apply-suppliers/apply-suppliers')
      }
    ]
  },
  {
    path: '/',
    redirect: '/information',
    component: {render: (h) => h('router-view')},
    meta: {
      authority: [USER_TYPE.INFORMATION]
    },
    children: [
      // 信息平台
      {
        path: '/information',
        name: 'information',
        component: () => import('@pages/information/information')
      },
      {
        path: '/goods-detail',
        name: 'goods-detail',
        component: () => import('@pages/goods-detail/goods-detail')
      },
      {
        path: '/business-detail',
        name: 'business-detail',
        component: () => import('@pages/business-detail/business-detail')
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
          crumbs: ['商品管理'],
          authority: [USER_TYPE.SUPER]
        },
        component: () => import('@pages/p-goods-manage/p-goods-manage')
      },
      {
        path: '/manager/p-supplier-manage',
        name: 'p-supplier-manage',
        meta: {
          title: '供应商管理',
          icon: require('./icon-supplier_1@2x.png'),
          iconSelected: require('./icon-supplier_2@2x.png'),
          crumbs: ['供应商管理'],
          authority: [USER_TYPE.SUPER]
        },
        component: () => import('@pages/p-supplier-manage/p-supplier-manage')
      },
      // 加盟商白名单
      {
        path: '/manager/p-alliance-list',
        name: 'p-alliance-list',
        meta: {
          title: '账号白名单',
          icon: require('./icon-white_roster1@2x.png'),
          iconSelected: require('./icon-white_roster2@2x.png'),
          crumbs: ['账号白名单'],
          authority: [USER_TYPE.SUPER]
        },
        component: () => import('@pages/p-alliance-list/p-alliance-list')
      },
      // 商品管理
      {
        path: '/manager/goods-manage',
        name: 'goods-manage',
        meta: {
          title: '商品管理',
          icon: require('./icon-goods_manage1@2x.png'),
          iconSelected: require('./icon-goods_manage2@2x.png'),
          crumbs: ['商品管理'],
          authority: [USER_TYPE.MERCHANT]
        },
        component: () => import('@pages/goods-manage/goods-manage'),
        children: [
          // 新建/编辑商品
          {
            path: '/manager/goods-manage/edit-goods',
            name: 'edit-goods',
            meta: {
              title: '编辑商品',
              crumbs: ['商品管理', '编辑商品'],
              authority: [USER_TYPE.MERCHANT]
            },
            component: () => import('@pages/edit-goods/edit-goods')
          }
        ]
      },
      // 店铺信息
      {
        path: '/manager/shop-info',
        name: 'shop-info',
        meta: {
          title: '店铺信息',
          icon: require('./icon-shop_message1@2x.png'),
          iconSelected: require('./icon-shop_message2@2x.png'),
          crumbs: ['店铺信息'],
          authority: [USER_TYPE.MERCHANT]
        },
        component: () => import('@pages/shop-info/shop-info')
      },
    ]
  },
  // 权限受限
  {
    path: '/forbid',
    name: 'forbid',
    component: () => import('@pages/forbid/forbid')
  },
  {
    path: '*',
    redirect: '/'
  }
  // {
  //   path: '*',
  //   name: 'NOT_FOUND',
  //   hideInMenu: true,
  //   component: require('@pages/_404/_404').default,
  //   props: true
  // }
]
