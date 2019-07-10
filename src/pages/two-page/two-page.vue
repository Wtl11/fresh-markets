<template>
  <div class="two-page">
    two-page
  </div>
</template>

<script type="text/ecmascript-6">
  const PAGE_NAME = 'TWO_PAGE'
  const TITLE = 'a'

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
      console.log('two page created')
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .two-page
    width: 100%
    background aliceblue
</style>
