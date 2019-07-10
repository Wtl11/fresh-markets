<template>
  <div class="test-page1">
    test-page1
  </div>
</template>

<script type="text/ecmascript-6">
  const PAGE_NAME = 'TEST_PAGE1'

  export default {
    name: PAGE_NAME,
    data() {
      return {}
    },
    beforeRouteEnter(to, from, next) {
      console.log('test-1')
      setTimeout(() => {
        next()
      }, 6000)
    },
    created() {
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .test-page1
    width: 100%
    background aliceblue
</style>
