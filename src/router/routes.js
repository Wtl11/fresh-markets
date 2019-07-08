export default [
  {
    path: '/',
    component: () => import('@pages/basic-layout/basic-layout'),
    redirect: '/test-page',
    children: [
      // 测试页面注释
      {
        path: '/test-page',
        name: 'test-page',
        component: () => import('@pages/test-page/test-page'),
        children: [
          {
            path: '/test-page/sample',
            name: 'sample',
            component: () => import('@pages/sample/sample')
          },
          {
            path: '/test-page/other-pages',
            name: 'other-pages',
            component: () => import('@pages/other-pages/other-pages')
          },
          // 测试页面配置
          {
            path: '/test-page/test-page1',
            name: 'test-page1',
            component: () => import('@pages/test-page1/test-page1')
          },
        ]
      },
      // a
      {
        path: '/two-page',
        name: 'two-page',
        component: () => import('@pages/two-page/two-page'),
        children: [

        ]
      },
      // asdad
      {
        path: '/hello-world',
        name: 'hello-world',
        component: () => import('@pages/hello-world/hello-world')
      },
      // asda
      {
        path: '/ttt-zzz',
        name: 'ttt-zzz',
        component: () => import('@pages/ttt-zzz/ttt-zzz')
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
