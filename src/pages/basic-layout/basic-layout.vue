<template>
  <div class="basic-layout">
    <ul class="menu">
      <template v-for="(item, index) in menuList">
        <router-link :key="index" tag="li" class="m-item" :to="item.path">{{item.name}}</router-link>
      </template>
    </ul>
    <div class="content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  const PAGE_NAME = 'BASIC_LAYOUT'
  const TITLE = '基布局'

  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    data() {
      const menuList = this.$router.options.routes.find(val => val.path === '/manager').children // todo
      console.log(menuList)
      return {
        menuList
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .basic-layout
    display :flex
    .menu
      height :100vh
      width :150px
      background aliceblue
      .m-item
        height :30px
        text-align :center
        font-size :16px
    .content
      flex: 1
      overflow :hidden
</style>
