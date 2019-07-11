<template>
  <div class="apply-suppliers">
    <div class="logo"></div>
    <div class="title-con">
      <div class="icon"></div>
      <div class="title">申请成为供应商</div>
    </div>
    <div class="apply-content">
      <div class="content-header content-padding-top">
        <div class="content-title">基本信息</div>
      </div>
      <div class="leader-box">
        <div class="edit-item">
          <div class="edit-title">
            <span class="start">*</span>
            供应商名称
          </div>
          <div class="edit-input-box">
            <input v-model="applyData.name" type="text" class="edit-input" maxlength="29"
                   @mousewheel.native.prevent>
          </div>
        </div>
<!--        <div class="edit-item">-->
<!--          <div class="edit-title">-->
<!--            <span class="start">*</span>-->
<!--            类目-->
<!--          </div>-->
<!--          <div class="edit-input-box mini-edit-input-box">-->
<!--            <div class="mini-mr20">-->
<!--              <base-drop-down :height="40" :width="190" :select="stairSelect"-->
<!--                              @setValue="setStairValue"></base-drop-down>-->
<!--            </div>-->
<!--            <div class="mini-mr20">-->
<!--              <base-drop-down :height="40" :width="190" :select="secondSelect"-->
<!--                              @setValue="setSecondValue"></base-drop-down>-->
<!--            </div>-->
<!--            <base-drop-down :height="40" :width="190" :select="thirdlySelect"-->
<!--                            @setValue="setThirdlyValue"></base-drop-down>-->
<!--          </div>-->
<!--        </div>-->
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  // import * as Helpers from './helpers'
  // import API from '@api'
  const PAGE_NAME = 'APPLY_SUPPLIERS'
  const TITLE = '申请成为供应商'

  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    data() {
      return {
        applyData: {
          name
        }
      }
    },
    methods: {
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .apply-suppliers
    position: absolute
    width: 100%
    height: 100%
    background: #fff
    .logo
      width: 150px
      height: 48px
      margin: 26px 15px 33px
      bg-image('./pic-apply_logo')
      background-size: 100%
    .title-con
      height: 18px
      margin-left: 30px
      layout(row)
      align-items: center
      .icon
        width: 16px
        height: @width
        margin-right: 5px
        icon-image('./icon-newly_build')
      .title
        font-family: $font-family-medium
        font-size: 18px
        color: $color-text-main
        letter-spacing: 0
        line-height: 1
    .apply-content
      position: relative
      flex: 1
      background: $color-white
      padding: 0 20px 80px
      box-sizing: border-box
</style>
