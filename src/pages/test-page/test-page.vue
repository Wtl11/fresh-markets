<template>
  <div class="test-page">
    test-page
    <router-link to="/test-page/sample" tag="h1" style="">to sample</router-link>
    <div style="width: 300vw;text-align: right">asdadasdads</div>
    <router-view class="basic-router" style="z-index: 10"></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  const PAGE_NAME = 'TEST_PAGE'

  export default {
    name: PAGE_NAME,
    data() {
      return {}
    },
    beforeRouteEnter(to, from, next) {
      setTimeout(() => {
        next(vm => vm.getList())
      }, 100)
    },
    created() {
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
    .basic-router
      fill-box(absolute)
      height :100vh
      overflow-y :scroll
</style>
