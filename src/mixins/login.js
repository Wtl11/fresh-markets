import {authMethod} from '@state/helpers'

export default {
  data() {
    this._tryingLogin = false
    return {
      loginMsg: {
        keyword: '',
        password: ''
      }
    }
  },
  created() {
    this.$loading.hide()
  },
  methods: {
    ...authMethod,
    _checkLogin() {
      if (this._tryingLogin) {
        return false
      }
      if (!this.loginMsg.keyword) {
        this.$toast.show('请输入正确的用户名')
        return false
      }
      if (!this.loginMsg.password) {
        this.$toast.show('请输入正确的密码')
        return false
      }
      return true
    }
  }
}
