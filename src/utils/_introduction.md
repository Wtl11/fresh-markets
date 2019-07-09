# http文档说明

> 本次优化采用单例模式;
> 优化了异常code码处理,设置头部信息,对该工具类的侵入性;
> 增加了全局处理toast的函数以及对应钩子函数
> 增加了对后台格式化数据的函数
> 增加了请求前loading的钩子函数

- 设置头部信息

```js
import HTTP from '@utils/http'

HTTP.setHeaders({TOKEN: 'token', CURRENT_SHOP: 'shopId'})

// 参数的key值对应头部的key值

```

- 异常处理

```js
// 查看http-handler文件

const AUTHORITY_LOST = 10000 // 权限失效

HTTP.handleError((code) => {
  switch (code) {
    case AUTHORITY_LOST:
      break
    default:
      break
  }
})

```

- toast的函数以及对应钩子函数

```js
// toast 默认值为true
API.Global.jssdkConfig({toast: true})
.then(res => {
  console.log(res)
})

// toast 为function时可以调用对应的钩子函数,原本的默认函数不会执行
API.Global.jssdkConfig({toast: (res) => {
  // ...to do some thing
  this.$toast.show(res.message)
})
.then(res => {
  console.log(res)
})

```
> 请求前loading的钩子函数和toast的使用方法和形式一直


- 对后台格式化数据的函数

> 可以对后台返回的数据劫持并进行处理,已实现页面的效果

``` js
function formatterData(data) {
  return {data, h: 123}
}

API.Global.jssdkConfig({formatter: formatterData, toast: true})
.then(res => {
  console.log(res)
})
// res = {data, h: 123}
```

----
