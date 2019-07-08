<template>
  <div class="hello-world">
    hello-world
  </div>
</template>

<script type="text/ecmascript-6">
  const PAGE_NAME = 'HELLO_WORLD'
  const TITLE = 'asdad'

  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    data() {
      return {

      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .hello-world
    width: 100%
</style>
