<template>
  <div class="forbid">
    403
  </div>
</template>

<script type="text/ecmascript-6">
// import * as Helpers from './helpers'
// import API from '@api'
  const PAGE_NAME = 'FORBID'
  const TITLE = '权限受限'

  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    data() {
      return {}
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .forbid
    width: 100%
</style>
