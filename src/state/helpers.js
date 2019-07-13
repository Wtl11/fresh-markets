import {mapGetters, mapActions} from 'vuex'

export const authComputed = {
  ...mapGetters('auth', ['currentUserType', 'currentUser'])
}

export const authMethod = {
  // ...mapMutations('auth', ['SET_USER_TYPE', 'SET_USER']),
  ...mapActions('auth', ['setAuth', 'clearAuth'])
}
