<template>
  <div class="client-view">
    <div class="left-menu">

    </div>
    <div class="view-container">
      <div class="view-container-top">

      </div>
      <div class="container">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  // import * as Helpers from './helpers'
  import API from '@api'
  import Http from '@utils/http'
  const PAGE_NAME = 'CLIENT_VIEW'
  const TITLE = 'casdad'

  function formatterData(data) {
    return {data, h: 123}
  }

  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    data() {
      return {

      }
    },
    created() {
      API.Global.jssdkConfig({formatter: formatterData, toast: true}).then(res => {
        console.log(res)
      }).catch((err) => {
        console.log(err)
        this.$loading.hide()
      })
      // Http.GodMode((http, context) => {
      //   http.defaults.headers.common['TTT'] = 'TTTT'
      //   console.log(context)
      // })
      // Http.setHeaders({HELLO: 'WOLDD', ASD: 'ASDASD'})
      Http.get({
        url: 'https://fresh-manager.jkweixin.com/scm/api/backend/statistics/base-data',
        data: {hello: 123, q: 55},
        toast: (res) => {
          console.log(123)
        },
        loading: () => {
          console.log(666)
        }
      }).then(res => {
        console.log(res)
      })
      // Http.post({url: 'https://fresh-manager.jkweixin.com/social-shopping/api/backend/activity-manage/activity-fixed', data: {hello: 123, q: 55}})
      // Http.handleError(code => {
      //   console.log(code, 1111)
      // })
      // Http.handleError(code => {
      //   console.log(code, 222)
      // })
    },
    mounted() {
      // setTimeout(() => {
      //   Http.get({url: 'https://fresh-manager.jkweixin.com/social-shopping/api/backend/data-center/goods/purchase-data?order_by=sales_num&limit=6&date_type=day&start_date=2019-07-08&end_date=&group_by=cate&cate=&spu=', data: {hello: 123, q: 55}})
      // }, 1000)
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .client-view
    width: 100%
  .left-menu
    width: 130px
    min-height: 100vh
    position: fixed
    left: 0
    top: 0
    background: #ccc
  .view-container
    min-width: 1000px
    margin-left: 220px
    min-height: 100vh
    display: flex
    flex-direction: column
  .view-container-top
    height: 80px
    background: #ddd
  .container
    display: flex
    flex-direction: column
    margin-top: 20px
    background: #aaa
    flex: 1

</style>
