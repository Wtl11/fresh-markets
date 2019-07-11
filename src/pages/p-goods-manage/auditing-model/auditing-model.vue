<template>
  <default-modal ref="auditingMmodal">
    <div slot="content" class="default-input">
      <div class="title-input">
        <div class="title">审核</div>
        <div class="close-box" @click="hide">
          <div class="close hand"></div>
        </div>
      </div>
      <div class="content center">
        <span class="label"><em class="sign">*</em>审核标签</span>
        <div class="right">
          <span class="btn hand" :class="{'active': +status === 2}" @click="auditingResult(2)">审核通过</span>
          <span class="btn hand" :class="{'active': +status === 3}" @click="auditingResult(3)">审核失败</span>
        </div>
      </div>
      <div class="content margin-bottom">
        <span class="label">审核说明</span>
        <div class="right">
          <textarea v-model="reason" placeholder="请输入审核说明" class="textarea"></textarea>
        </div>
      </div>
      <div class="btn-group">
        <span class="btn cancel" @click="hide">取消</span>
        <span class="btn confirm" @click="confirm">确定</span>
      </div>
    </div>
  </default-modal>
</template>
<script type="text/ecmascript-6">
  import DefaultModal from '@components/default-modal/default-modal'
  const COMPONENT_NAME = 'CHANGE_MODEL'

  export default {
    name: COMPONENT_NAME,
    components: {DefaultModal},
    props: {
    },
    data() {
      return {
        status: 2,
        reason: ''
      }
    },
    methods: {
      show() {
        this.$refs.auditingMmodal && this.$refs.auditingMmodal.showModal()
      },
      hide() {
        this.$refs.auditingMmodal && this.$refs.auditingMmodal.hideModal()
        this.status = 2
        this.reason = ''
      },
      auditingResult(result) {
        this.status = result
      },
      confirm() {
        if (+this.status === 3 && this.reason === '') {
          this.$toast.show('请输入审核说明')
          return
        }
        this.$emit('confirm', {status: this.status, reason: this.reason})
      }
    }
  }
</script>


<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .default-input
    background: #fff
    width: 464px
    border-radius: 2px
    padding: 0 20px 60px
    .title-input
      display: flex
      box-sizing: border-box
      padding: 23px 0
      align-items: center
      justify-content: space-between
      .title
        font-size: $font-size-16
        font-family: $font-family-medium
        line-height: 1
        color: $color-text-main
      .close
        width: 12px
        height: @width
        icon-image('icon-close')
    .content
      display: flex
      margin-bottom: 10px
      .label
        width: 60px
        padding-left: 7px
        position: relative
        margin-top: 5px
        font-size: $font-size-14
        font-family: $font-family-regular
        color: $color-text-sub
        .sign
          font-style: normal
          position: absolute
          left: 0
          top: 2px
          color: #ed585b
      .right
        padding-left: 20px
        display: flex
        align-items: center
      .btn
        width: 96px
        height: 32px
        line-height: 32px
        color: $color-text-main
        text-align: center
        border-radius: 32px
        border: 1px solid $color-line
        transition: all 0.3s
        margin-right: 10px
      .active
        color: #ffffff
        background: $color-btn
        border: 1px solid $color-btn
      .textarea
        width: 340px
        max-width: 340px
        height: 76px
        background: #F7F9FB
        font-family: $font-family-regular
        border: 1px solid $color-line
        padding: 5px

    .content.margin-bottom
      margin-bottom: 40px
    .center
      align-items: center
      .label
        margin-top: 0
  .btn-group
    text-align: center
    display: flex
    justify-content: flex-end
    user-select :none
    .btn
      width: 96px
      height: 40px
      line-height: 40px
      border-radius: 4px
      color: $color-text-main
      border: 1px solid $color-main
      cursor: pointer
      transition: all 0.3s
    .cancel
      border: 1px solid $color-line
      &:hover
        color: #82899C
        border-color: #82899C
    .confirm
      border: 1px solid $color-main
      background: $color-main
      color: $color-white
      margin-left: 20px
      &:hover
        opacity: 0.8
    .one-btn
      margin-left :0
</style>
