<template>
  <div class="base-status-tab">
    <div v-for="(item, index) in statusList" :key="index" :ref="'tab-item'+item[valueKey]" class="status-tab-item hand"
         :class="{'status-tab-item-active': item[valueKey] === value}" @click="checkStatus(index, item)"
    >
      {{item[labelKey]}} ({{item[numKey]}})
    </div>
    <span class="status-slider" :style="style"></span>
  </div>
</template>

<script type="text/ecmascript-6">
  const COMPONENT_NAME = 'BASE_STATUS_TAB'

  export default {
    name: COMPONENT_NAME,
    props: {
      statusList: {
        // 组件数据数据
        type: Array,
        default: () => {
          return [{name: '全部', value: '', num: 0}]
        }
      },
      value: {
        // 当前选择值
        type: [String, Number],
        default: ''
      },
      valueKey: {
        // 默认键值(可使用自己所需键值)
        type: String,
        default: 'value'
      },
      labelKey: {
        // 默认label键值(可使用自己所需键值)
        type: String,
        default: 'name'
      },
      numKey: {
        // 默认num键值(可使用自己所需键值)
        type: String,
        default: 'num'
      }
    },
    data() {
      return {
        style: {}
      }
    },
    watch: {
      value(val) {
        this.getStyle()
        return val
      },
      statusList(val, old) {
        this.getStyle()
      }
    },
    created() {
      this.getStyle()
    },
    methods: {
      getStyle() {
        this.statusList.length > 0 &&
          this.$nextTick(() => {
            let el = this.$refs['tab-item' + this.value][0]
            this.style = `left: ${el.offsetLeft}px; width: ${el.offsetWidth}px`
          })
      },
      checkStatus(index, item) {
        this.$emit('change', item[this.valueKey])
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .base-status-tab
    margin-left: 30px
    display: flex
    background: #F6F6F6
    border-radius: 100px
    height: 30px
    box-sizing: border-box
    position: relative
    .status-tab-item
      border-radius: 100px
      min-width: 106px
      padding:0 5px
      color: $color-text-main
      line-height: 30px
      text-align: center
      transition: 0.2s all
      font-size: $font-size-14
      font-family: $font-family-regular
      background: transparent
      position: relative
      z-index: 1
    .status-tab-item-active
      color: $color-white
  .status-slider
    width: 106px
    position: absolute
    top: 0
    left: 0
    height: 30px
    border-radius: 100px
    transition: left 0.2s
    background: #64A0F7
</style>
