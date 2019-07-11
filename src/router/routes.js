import {USER_TYPE} from '@utils/constant'
export default [
  {
    path: '/user',
    component: {render: (h) => h('router-view')},
    redirect: '/user/login',
    children: [
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
      // 店铺信息
      {
        path: '/manager/shop-info',
        name: 'shop-info',
        meta: {
          title: '店铺信息',
          icon: require('./icon-store_Information1@2x.png'),
          iconSelected: require('./icon-store_Information2@2x.png'),
          crumbs: ['店铺信息'],
          authority: [USER_TYPE.MERCHANT]
        },
        component: () => import('@pages/shop-info/shop-info')
      },
      // 商品管理
      {
        path: '/manager/goods-manage',
        name: 'goods-manage',
        meta: {
          title: '编辑商品',
          icon: require('./icon-store_Information1@2x.png'),
          iconSelected: require('./icon-store_Information2@2x.png'),
          crumbs: ['商品', '商品管理'],
          authority: [USER_TYPE.MERCHANT]
        },
        component: () => import('@pages/goods-manage/goods-manage')
      },
      // 新建/编辑商品
      {
        path: '/manager/edit-goods',
        name: 'edit-goods',
        meta: {
          title: '编辑商品',
          icon: require('./icon-store_Information1@2x.png'),
          iconSelected: require('./icon-store_Information2@2x.png'),
          crumbs: ['商品', '商品管理', '编辑商品'],
          authority: [USER_TYPE.MERCHANT]
        },
        component: () => import('@pages/edit-goods/edit-goods')
      }
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
    name: 'NOT_FOUND',
    hideInMenu: true,
    component: require('@pages/_404/_404').default,
    props: true
  }
]
