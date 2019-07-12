import storage from 'storage-controller'

export const state = {
  currentUserType: storage.get('auth.currentUser', {}).identity, // 当前用户类型
  currentUser: storage.get('auth.currentUser', {})
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
  }
}

export const actions = {}
