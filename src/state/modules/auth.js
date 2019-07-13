import storage from 'storage-controller'
import HTTP from '@utils/http'

export const state = {
  currentUserType: undefined, // 当前用户类型
  currentUser: undefined,
  token: 0
}

export const getters = {
  currentUserType: (state) => state.currentUserType,
  currentUser: (state) => state.currentUser
}

export const mutations = {
  // 设置用户类型
  SET_USER_TYPE(state, userType) {
    state.currentUserType = userType
  },
  SET_USER(state, user) {
    state.currentUser = user
  },
  SET_TOKEN(state, token) {
    state.token = token
  }
}

export const actions = {
  init({commit}) {
    const auth = storage.get('auth', {})
    setAuthConfig({auth, commit})
  },
  setAuth({commit, state}, auth) {
    storage.set('auth', auth)
    setAuthConfig({auth, commit})
  },
  clearAuth({commit, state}) {
    storage.remove('auth')
    setAuthConfig({auth: undefined, commit})
  }
}

// 设置信息
function setAuthConfig({auth = {}, commit}) {
  const user = auth.info || {}
  const token = auth.access_token
  commit('SET_USER', user)
  commit('SET_USER_TYPE', user.identity)
  commit('SET_TOKEN', token)
  HTTP.setHeaders({
    Authorization: token,
    'Current-Corp': process.env.VUE_APP_CURRENT_CORP
  })
}


