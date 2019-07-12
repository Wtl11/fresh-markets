<template>
  <div v-if="classifyData.length" class="select-classify" :class="{active: isOpen}" :style="{height: height + 'px'}">
    <article class="left-wrapper">{{title}}</article>
    <article ref="middle" class="middle-wrapper">
      <template v-for="(item, index) in classifyData">
        <div
          v-if="classifyData.length"
          :key="index"
          class="classify-item"
          :class="{active: selectId === index}"
          :style="classifyItemStyle(index)"
        >
          <span
            @click="selectHandle(item, index)"
          >{{item.name}}</span>
        </div>
      </template>
    </article>
    <article
      v-if="row > 1"
      class="right-wrapper"
      @click="openHandle"
    ><span
      class="text"
    >{{isOpen ? '收起' : '展开'}}</span><i
      class="triangle" :class="{active: isOpen}"
    ></i></article>
  </div>
</template>

<script type="text/ecmascript-6">
  const COMPONENT_NAME = 'SELECT_CLASSIFY'
  const DEFAULT_HEIGHT = 44
  const ADD_HEIGHT = 29
  export default {
    name: COMPONENT_NAME,
    props: {
      classifyData: {
        type: Array,
        default: () => []
      },
      title: {
        type: String,
        default: ''
      },
      defaultIndex: {
        type: Number,
        default: -1
      }
    },
    data() {
      return {
        isOpen: false,
        selectId: this.defaultIndex,
        height: DEFAULT_HEIGHT,
        row: 1,
        opacityIndex: 99999
      }
    },
    computed: {},
    watch: {
      isOpen(val) {
        this.height = (val ? Math.max(this.row - 1, 0) * ADD_HEIGHT : 0) + DEFAULT_HEIGHT
      },
      classifyData() {
        setTimeout(() => {
          this.getRow()
        }, 50)
      }
    },
    mounted() {},
    methods: {
      setSelectId(index) {
        this.selectId = index
      },
      openHandle() {
        this.isOpen = !this.isOpen
      },
      selectHandle(item, index) {
        this.getRow()
        this.selectId = index
        this.$emit('selectChange', this.selectId)
      },
      classifyItemStyle(index) {
        if (this.isOpen) {
          return {opacity: 1}
        } else {
          return {opacity: index < this.opacityIndex || index === 0? 1 : 0}
        }
      },
      getRow() {
        let parent = this.$refs.middle
        if (typeof parent !== 'object') return
        let children = parent.children
        let index = -1
        let pTop = parent.getBoundingClientRect().top
        let row = 1
        for (let item of children) {
          let rect = item.getBoundingClientRect()
          let cTop = rect.top
          if (cTop === pTop) {
            index++
          }
          if (cTop > pTop) {
            row = (cTop - pTop) / rect.height + 1
          }
        }
        this.opacityIndex = Math.max(0, index)
        this.row = row
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
    transition :all 0.2s ease-out
    overflow :hidden
    border-radius :1px
    &.active
      overflow :visible
    .left-wrapper
      padding-left :15px
      width :100px
      color: #999
    .middle-wrapper
      flex :1
      .classify-item
        float: left
        line-height :14px
        display :inline
        padding-right :40px
        padding-bottom :15px
        transition :opacity 0.5s
        &.active
          color: #ff520f
        & > span
          cursor :pointer
          opacity : 1
          transition :all 0.3s
          &:hover
            opacity : 0.6
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
        top: 3px
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
