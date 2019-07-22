import storage from 'storage-controller'
import HTTP from '@utils/http'

export const state = {
  currentUserType: undefined, // 当前用户类型
  currentUser: undefined,
  token: undefined,
  // 集市
  tokenInformation: undefined
}

export const getters = {
  currentUserType: (state) => state.currentUserType,
  currentUser: (state) => state.currentUser,
  tokenInformation: (state) => state.tokenInformation
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
  },
  SET_TOKEN_INFORMATION(state, token) {
    state.tokenInformation = token
  }
}

export const actions = {
  init({commit}) {
    const auth = storage.get('auth', {})
    const tokenInformation = storage.get('tokenInformation')
    setAuthConfig({auth, commit})
    setTokenInformation({tokenInformation, commit})
  },
  setAuth({commit, state}, auth) {
    storage.set('auth', auth)
    setAuthConfig({auth, commit})
  },
  clearAuth({commit, state}) {
    storage.remove('auth')
    setAuthConfig({auth: undefined, commit})
  },
  setTokenInformation({commit, state}, tokenInformation) {
    storage.set('tokenInformation', tokenInformation)
    setTokenInformation({tokenInformation, commit})
    commit('SET_TOKEN_INFORMATION', tokenInformation)
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

// 设置头部信息-集市
function setTokenInformation({tokenInformation, commit}) {
  commit('SET_TOKEN_INFORMATION', tokenInformation)
  HTTP.setHeaders({
    'Authorization-Franch': tokenInformation,
    'Current-Corp': process.env.VUE_APP_CURRENT_CORP
  })
}
