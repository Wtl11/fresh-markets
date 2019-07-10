<template>
  <div class="information">
    <section class="banner-wrapper">
      <img src="https://img.alicdn.com/tfs/TB1etRMaUuF3KVjSZK9XXbVtXXa-2000-660.jpg" alt="" class="banner-img">
    </section>
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
    .banner-wrapper
      margin : 0 auto
      max-width :1980px
      height :614px
      .banner-img
        width :100%
        height :100%
        object-fit :cover
</style>
