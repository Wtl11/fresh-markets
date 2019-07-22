<template>
  <default-modal ref="modal" class="i-modal" @click.stop="">
    <div slot="content" class="information-login">
      <header class="header-wrapper">
        <span>登录查看商品采购价</span>
        <img src="./icon-close@2x.png" alt="" @click.stop="hide">
      </header>
      <article class="form">
        <div class="input-wrapper">
          <input v-model="tel"
                 type="tel"
                 maxlength="11"
                 placeholder="请输入11位手机号"
                 class="input"
                 :class="{active: checkTel}"
          >
          <section class="code-wrapper">
            <div class="input-wrapper left">
              <input v-model="code"
                     type="tel"
                     maxlength="6"
                     placeholder="请输入验证码"
                     class="input"
                     :class="{active: code}"
              >
            </div>
            <p class="input-wrapper right"
               :class="[{allow: checkTel}, {coding: codeText}]"
               @click="getCodeHandle"
            >{{codeText ? codeText + 's' : '获取验证码'}}</p>
          </section>
          <button class="submit-wrapper" :class="{active: checkTel && code}" @click.stop="loginHandle">登录</button>
        </div>
      </article>
    </div>
  </default-modal>
</template>

<script type="text/ecmascript-6">
  import DefaultModal from '@components/default-modal/default-modal'
  import {checkIsPhoneNumber} from '@utils/common'
  import {authMethod} from '@state/helpers'

  import API from '@api'

  const COMPONENT_NAME = 'INFORMATION_LOGIN'

  export default {
    name: COMPONENT_NAME,
    components: {
      DefaultModal
    },
    data() {
      return {
        tel: '',
        code: '',
        codeText: '',
        goodsInfo: {}
      }
    },
    computed: {
      checkTel() {
        return checkIsPhoneNumber(this.tel)
      }
    },
    beforeDestroy() {
      clearInterval(this._timer)
    },
    methods: {
      ...authMethod,
      show(goodsInfo) {
        this.goodsInfo = goodsInfo
        this.$refs.modal && this.$refs.modal.showModal()
      },
      hide() {
        this.$refs.modal && this.$refs.modal.hideModal()
      },
      getCodeHandle() {
        if (!this.checkTel) {
          this.$toast.show('请输入正确的手机号码')
          return
        }
        if (this.codeText) return
        this.codeText = 59
        this._timer = setInterval(() => {
          this.codeText--
          if (this.codeText <= 0) {
            clearInterval(this._timer)
            this.codeText = ''
          }
        }, 1000)
        this._getCode()
      },
      _getCode() {
        API.Auth.getCodeInformation({mobile: this.tel}).then(res => {
          this.$toast.show('验证码已发送,请注意查收!')
        })
      },
      loginHandle() {
        if (!this.checkTel) {
          this.$toast.show('请输入正确的手机号码')
          return
        }
        if (!this.code) {
          this.$toast.show('请输入验证码')
          return
        }
        if (this._logining) {
          this.$toast.show('请频繁复操作')
          return
        }
        this._logining = true
        setTimeout(() => {
          this._logining = false
        }, 1000)
        this._login()
      },
      _login() {
        API.Auth.loginInformation({mobile: this.tel, auth_code: this.code}).then(res => {
          this.setTokenInformation(res.data.access_token)
          this.hide()
          this.$emit('refresh', 'login')
          let routeUrl = this.$router.resolve({
            path: '/goods-detail',
            query: {goodsId: this.goodsInfo.id, supplierId: this.goodsInfo.supplier_id}
          })
          setTimeout(() => {
            window.open(routeUrl.href, '_blank')
          }, 100)
        })
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
  .i-modal
    left :0 !important
    background: rgba(0,0,0,.5)

  .input-wrapper
    background: #F7F9FB;
    border: 1px solid #E9ECF0;
    border-radius: 2px;
    height :44px
    width :100%
    box-sizing :border-box
    transition :all .1s
    .input
      font-family: $font-family-regular
      font-size: 14px;
      color: #333;
      line-height: 42px;
      background #F7F9FB;
      padding :0 14px
      width :100%
      box-sizing border-box
      transition :all .1s
      &::placeholder
        color: #ACACAC;
      &.active
        background :#fff

  .information-login
    width: 464px
    height: 277px
    background: #FFFFFF;
    box-shadow: 0 8px 14px 0 rgba(12,6,14,0.08);
    border-radius: 3px;
    padding :0 20px
    box-sizing :border-box
    .header-wrapper
      font-family: $font-family-medium
      font-size: 16px;
      color: #333333;
      line-height: 1
      padding :23px 0 26px
      layout(row)
      align-items:center
      justify-content :space-between
      & > img
        width: 12px
        height: @width
        cursor :pointer
        extend-click()
    .form
      .submit-wrapper
        height :40px
        width :100%
        background: #FF520F;
        border-radius: 4px;
        font-family: $font-family-regular
        font-size: 14px;
        color: #FFFFFF;
        text-align: center;
        line-height: @height
        cursor :pointer
        opacity : 0.5
        transition : opacity 0.1s
        &.active
          opacity : 1
      .code-wrapper
        margin-top :24px
        margin-bottom :30px
        layout(row)
        justify-content :space-between
        .left
          width: 277px
        .right
          width: 137px
          color: #ACACAC
          layout(row)
          align-items :center
          justify-content :center
          cursor :pointer
          user-select :none
          &.allow
            color: #4D77BD;
            border-color: #4D77BD
            background :#fff
          &.coding
            color: #ACACAC
            border-color :#E9ECF0
            background : #F7F9FB
</style>
