<template>
  <div class="login">
    <div class="logo"></div>
    <div class="login-con">
      <div class="header">登录/Login</div>
      <div class="item">
        <input v-model="loginMsg.keyword" type="text" placeholder="请输入账号" class="input" @keyup.enter="_tryLogin">
      </div>
      <div class="item">
        <input v-model="loginMsg.password" type="password" placeholder="请输入密码" class="input" @keyup.enter="_tryLogin">
      </div>
      <div class="item button hand" @click="_tryLogin">登录</div>
      <span class="tips hand" @click="_becomeSuppliers">成为供应商</span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  // import {loginMethods} from './modules/helpers'
  import storage from 'storage-controller'
  import API from '@api'

  const PAGE_NAME = 'LOGIN'
  const TITLE = '登录'
  let _tryingLogin = false

  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    data() {
      return {
        loginMsg: {
          keyword: 'super',
          password: 'jike2018!'
        }
      }
    },
    beforeRouteEnter(to, from, next) {
      console.log(to, from)
      // 判断用户是否已经登录
      next((vw) => {
        if (storage.get('auth.currentUser', 0)) {
          API.Auth.validate()
            .then((res) => {
              const user = res.data
              storage.set('auth.currentUser', user)
              vw._goToMain()
            })
            .finally(() => {
              vw.$loading.hide()
            })
        }
      })
    },
    methods: {
      _checkLogin() {
        if (_tryingLogin) {
          return false
        }
        if (!this.loginMsg.keyword) {
          this.$toast.show('请输入账号')
          return false
        }
        if (!this.loginMsg.password) {
          this.$toast.show('请输入密码')
          return false
        }
        return true
      },
      _tryLogin() {
        if (!this._checkLogin()){
          return
        }
        _tryingLogin = true
        API.Auth.logIn(this.loginMsg)
          .then((res) => {
            const user = res.data
            storage.set('auth.currentUser', user)
            this._goToMain()
          })
          .catch(() => {
            this.$toast.show('登录失败!')
          })
          .finally(() => {
            _tryingLogin = false
            this.$loading.hide()
          })
      },
      _goToMain() {
        this.$router.push(`/manager/shop-info`)
      },
      _becomeSuppliers() {
        this.$router.push(`/user/apply-suppliers`)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .login
    position: absolute
    width: 100%
    height: 100%
    bg-image('./pic-login_background')
    background-repeat: no-repeat
    background-size: cover
    background-position: center center
    layout()
    align-items: center
    justify-content: center
    .logo
      position: absolute
      top: 35px
      left: 94px
      width: 150px
      height: 48px
      bg-image('./pic-login_logo')
      background-size: 100%
    .login-con
      width: 360px
      layout()
      justify-content: center
      .header
        margin-bottom: 30px
        font-family: $font-family-regular
        font-size: 20px
        color: #FFFFFF
        letter-spacing: 0
        line-height: 1
      .item
        width: 100%
        height: 44px
        padding: 0 14px
        background: #fff
        border-radius: 4px
        margin-bottom: 24px
        .input
          width: 100%
          height: 44px
          background: #fff
          font-family: $font-family-regular
          font-size: 14px
          color: $color-text-main
          letter-spacing: 0
          outline: none
          &::placeholder
            font-family: $font-family-regular
            color: #82899C
        &.button
          width: 100%
          height: 44px
          line-height: 44px
          margin: 16px 0 30px 0
          background: #1FBB91
          text-align: center
          font-family: $font-family-regular
          font-size: 14px
          color: #fff
          letter-spacing: 0
      .tips
        text-align: center
        font-family: $font-family-regular
        font-size: 14px
        color: #FFFFFF
        letter-spacing: 0
        line-height: 14px
        text-decoration: underline
</style>
