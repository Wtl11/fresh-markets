<template>
  <div class="basic-layout">
    <aside class="aside">
      <ul class="menu">
        <template v-for="(item, index) in menuList">
          <router-link :key="index" tag="li" class="m-item" :to="item.path">{{item.name}}</router-link>
        </template>
      </ul>
    </aside>
    <header class="header-wrapper">
      <layout-crumb></layout-crumb>
    </header>
    <section class="content-wrapper">
      <router-view></router-view>
    </section>
  </div>
</template>

<script type="text/ecmascript-6">
  import LayoutCrumb from './layout-crumb/layout-crumb'
  const PAGE_NAME = 'BASIC_LAYOUT'
  const TITLE = '基布局'

  export default {
    name: PAGE_NAME,
    components: {
      LayoutCrumb
    },
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
  $asideWidth = 210px
  $topHeight = 40px
  @import "~@design"

  .basic-layout
    position :relative
    display flex
    .aside
      position :fixed
      width :$asideWidth
      z-index :999
      .menu
        height :100vh
        width :100%
        background aliceblue
        .m-item
          height :30px
          text-align :center
          font-size :16px
    .header-wrapper
      position :fixed
      left :$asideWidth
      right :0
      height :$topHeight
      background :red
      z-index :999
    .content-wrapper
      flex: 1
      border-left : $asideWidth solid transparent
      border-top : $topHeight solid transparent
      box-sizing :border-box
      min-height :100vh
      background darkgray
      padding :20px
</style>
