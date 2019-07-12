<template>
  <div class="404">
    <img class="icon" src="./404.svg" alt="">
  </div>
</template>

<script type="text/ecmascript-6">
  const PAGE_NAME = 'NOT_FOUND'

  export default {
    name: PAGE_NAME,
    page: {
      title: '404',
      meta: [{name: 'description', content: '404'}]
    },
    props: {
      resource: {
        type: String,
        default: ''
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .icon
    display block
    margin :30px auto

</style>
