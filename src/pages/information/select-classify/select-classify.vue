<template>
  <div class="select-classify" :class="{active: isOpen}">
    <article class="left-wrapper">一级分类：</article>
    <article ref="middle" class="middle-wrapper">
      <span v-for="(item, index) in classifyData" :key="index" class="classify-item">时令鲜果</span>
    </article>
    <article class="right-wrapper" @click="openHandle"><span class="text">{{isOpen ? '收起' : '展开'}}</span><i class="triangle" :class="{active: isOpen}"></i></article>
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
        isOpen: false,
        heightAuto: false
      }
    },
    computed: {
    },
    watch: {
      isOpen(val) {
        setTimeout(() => {
          this.heightAuto = val
        }, 300)
      }
    },
    methods: {
      openHandle() {
        this.isOpen = !this.isOpen
        setTimeout(() => {
          console.log(this.$refs.middle.getBoundingClientRect())
        }, 300)
        // console.log(this.$refs.middle.getBoundingClientRect())
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .select-classify
    background :$color-white
    padding :15px 15px 0
    font-family: $font-family-regular
    font-size: 14px;
    color: #333
    line-height: 1
    display :flex
    box-sizing border-box
    transition :all 0.3s ease-in-out
    height:44px
    .left-wrapper
      padding-left :15px
      width :100px
      color: #999
    .middle-wrapper
      flex :1
      overflow :hidden
      .classify-item
        float: left
        line-height :14px
        display :inline
        cursor :pointer
        margin-right :40px
        margin-bottom :15px
    .right-wrapper
      cursor :pointer
      position :relative
      font-size: 12px;
      color: #4D77BD;
      .text
        padding-right:3px
      .triangle
        display: inline-block
        position :relative
        top: 5px
        border: 5px solid #4D77BD
        height :0
        width :0
        border-bottom-color : transparent
        border-left-color : transparent
        border-right-color : transparent
        transform: rotate(0deg)
        transform-origin: 5px 2.5px
        transition : transform 0.3s
        &.active
          transform: rotate(180deg)

</style>
