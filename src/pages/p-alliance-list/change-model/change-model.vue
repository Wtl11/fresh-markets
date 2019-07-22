<template>
  <default-modal ref="passwordModal">
    <div slot="content" class="default-input">
      <div class="title-input">
        <div class="title">创建账号白名单</div>
        <div class="close-box" @click="hide">
          <div class="close hand"></div>
        </div>
      </div>
      <div class="main-input">
        <div class="main-model-box">
          <div class="text">加盟商名称</div>
          <input v-model="name" type="text" maxlength="30" class="main-input-box" placeholder="请输入加盟商名称">
        </div>
        <div class="main-model-box">
          <div class="text">加盟商账号</div>
          <input v-model="tel" type="tel" maxlength="11" class="main-input-box" placeholder="请输入11位手机号">
        </div>
        <div class="btn-group">
          <div class="btn cancel" @click="hide">取消</div>
          <div class="btn confirm" @click="confirm">确定</div>
        </div>
      </div>
    </div>
  </default-modal>
</template>
<script type="text/ecmascript-6">
  import DefaultModal from '@components/default-modal/default-modal'
  import {checkIsPhoneNumber} from '@utils/common'
  import API from '@api'

  const COMPONENT_NAME = 'CHANGE_MODEL'

  export default {
    name: COMPONENT_NAME,
    components: {DefaultModal},
    props: {},
    data() {
      return {
        name: '',
        tel: ''
      }
    },
    computed: {
      checkTel() {
        return checkIsPhoneNumber(this.tel)
      }
    },
    methods: {
      show() {
        this.$refs.passwordModal && this.$refs.passwordModal.showModal()
      },
      hide() {
        this.$refs.passwordModal && this.$refs.passwordModal.hideModal()
        this.name = ''
        this.tel = ''
      },
      confirm() {
        if (!this.name) {
          this.$toast.show('请输入加盟商名称')
          return
        }
        if (!this.checkTel) {
          this.$toast.show('请输入正确的加盟商账号')
          return
        }
        if (this._clicking) {
          this.$toast.show('请勿频繁操作!')
          return
        }
        this._clicking = true
        setTimeout(() => {
          this._clicking = false
        }, 1000)
        API.Alliance.pushAlliance({name: this.name, mobile: this.tel}).then((res) => {
          this.$emit('refresh')
          this.hide()
        })
      }
    }
  }
</script>


<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .default-input
    background: #fff
    width: 534px
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
    .main-input
      padding: 10px 0 16px
      .main-input-box
        width: 310px
        height: 44px
        border: 1px solid $color-line
        border-radius: 1px
        font-family: $font-family-regular
        color: $color-text-main
        font-size: $font-size-14
        padding-left: 14px
        transition: all 0.3s
        &::-webkit-inner-spin-button
          appearance: none
        &:hover
          border: 1px solid #ACACAC
        &::placeholder
          font-family: $font-family-regular
          color: $color-text-assist
        &:focus
          border-color: $color-main !important
  .btn-group
    margin-top: 40px
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
      border: 1px solid $color-line
      cursor: pointer
      transition: all 0.3s
    .cancel
      border: 1px solid $color-line
      &:hover
        color: $color-text-sub
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
  .main-model-box
    layout(row)
    align-items: center
    margin-bottom: 24px
    .text
      color: #666
      text-align: right
      font-size: $font-size-14
      font-family: $font-family-regular
      width: 95px
      margin-right: 20px
      &:before
        content: "*"
        color: #F52424
    .no-before
      padding-left: 7px
      box-sizing: border-box
      &:before
        content: ""

</style>
