<template>
  <div class="select-classify">
    <article class="left-wrapper">一级分类：</article>
    <article class="middle-wrapper">
      <span v-for="(item, index) in classifyData" :key="index" class="item">时令鲜果</span>
    </article>
    <article class="right-wrapper">展开</article>
  </div>
</template>

<script type="text/ecmascript-6">
  const COMPONENT_NAME = 'SELECT_CLASSIFY'

  export default {
    name: COMPONENT_NAME,
    props: {
      classifyData: {
        type: Array,
        default: () => new Array(30).fill(1)
      }
    },
    data() {
      return {

      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .select-classify
    background :$color-white
    padding :15px
    font-family: $font-family-regular
    font-size: 14px;
    color: #333
    line-height: 1
    display :flex
    flex-wrap nowrap
    .left-wrapper
      padding-left :15px
      width :100px
      color: #999
    .middle-wrapper
      position :relative
      display :flex
      flex-wrap :wrap
      flex: 1
      .item
        cursor :pointer
        margin-right :40px
        margin-bottom :15px
    .right-wrapper
      cursor :pointer
      position :relative
      font-size: 12px;
      color: #4D77BD;
</style>
