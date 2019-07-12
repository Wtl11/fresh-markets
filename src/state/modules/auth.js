import storage from 'storage-controller'

export const state = {
  currentUserType: storage.get('auth.currentUser', {}).identity // 当前用户类型
}

export const getters = {
  currentUserType: (state) => state.currentUserType
}

export const mutations = {
  // 设置用户类型
  SET_USER_TYPE(state, userType) {
    state.currentUserType = userType
  }
}

export const actions = {}
