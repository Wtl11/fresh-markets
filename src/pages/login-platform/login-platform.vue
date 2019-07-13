<template>
  <div class="login">
    <img src="./pic-login_background@1x.png" alt="" class="login-background">
    <div class="logo"></div>
    <div class="login-con">
      <div class="header">集市平台管理系统 </div>
      <div class="item">
        <input v-model="loginMsg.keyword" type="text" placeholder="请输入账号" class="input" @keyup.enter="_tryLogin">
      </div>
      <div class="item">
        <input v-model="loginMsg.password" type="password" placeholder="请输入密码" class="input" @keyup.enter="_tryLogin">
      </div>
      <div class="item button hand" @click="_tryLogin">登录</div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  // import {loginMethods} from './modules/helpers'
  import API from '@api'
  import Login from '@mixins/login'
  import store from '@state/store'

  const PAGE_NAME = 'LOGIN'
  const TITLE = '登录|平台'

  export default {
    name: PAGE_NAME,
    mixins: [Login],
    page: {
      title: TITLE
    },
    beforeRouteEnter(to, from, next) {
      // 判断用户是否已经登录
      if (store.state.auth.token) {
        API.Auth.validatePlatform()
          .then(() => {
            next((vm) => {
              vm._goToMain()
            })
          })
          .catch(() => {
            next()
          })
      } else {
        next()
      }
    },
    methods: {
      _tryLogin() {
        if (!this._checkLogin()) {
          return
        }
        this._tryingLogin = true
        API.Auth.loginPlatform(this.loginMsg)
          .then((res) => {
            this.setAuth(res.data)
            this._goToMain()
          })
          .finally(() => {
            this._tryingLogin = false
          })
      },
      _goToMain() {
        this.$router.push(`/manager`)
      },
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../../design/login.styl"

</style>
