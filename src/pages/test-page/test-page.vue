<template>
  <div class="test-page">
    test-page
    <router-link to="/manager/test-page/sample" tag="h1" style="">to sample</router-link>
<!--    <div style="width: 300vw;height:200vh;text-align: right; background: yellowgreen">asdadasdads</div>-->
    <router-view class="basic-router" style="z-index: 10"></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  const PAGE_NAME = 'TEST_PAGE'

  export default {
    name: PAGE_NAME,
    data() {
      return {
        isShow: true
      }
    },
    beforeRouteEnter(to, from, next) {
      console.log(to, from)
      setTimeout(() => {
        next(vm => vm.getList())
      }, 100)
    },
    beforeRouteLeave(to, from, next) {
      this.isShow = false
      console.log(123)
      next()
    },
    created() {
      this.isShow = true
      console.log(this.$route.path, 111)
      console.log('test-page created')
    },
    methods: {
      getList() {
        console.log('entry test page')
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .test-page
    position :relative
    background rebeccapurple
    height :300vh
    .basic-router
      fill-box(absolute)
      z-index :50
</style>
