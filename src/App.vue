<template>
  <transition name="fade">
    <div id="app">
      <router-view></router-view>
    </div>
  </transition>
</template>

<script>
  import appConfig from '@src/app.config'

  export default {
    page: {
      titleTemplate(title) {
        title = typeof title === 'function' ? title(this.$store) : title
        return title || appConfig.title
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "./design/_globals.styl"
  @import "~nprogress/nprogress.css"

  #nprogress .bar
    background: #64a0f7 !important

  #nprogress .peg
    box-shadow: 0 0 10px #64a0f7, 0 0 5px #64a0f7 !important
</style>
