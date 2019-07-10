<template>
  <div class="information">
    information
  </div>
</template>

<script type="text/ecmascript-6">
  // import * as Helpers from './helpers'
  // import API from '@api'
  const PAGE_NAME = 'INFORMATION'
  const TITLE = '信息平台'

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

  .information
    width: 100%
</style>
