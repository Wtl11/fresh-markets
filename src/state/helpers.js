import {mapGetters, mapMutations} from 'vuex'

export const authComputed = {
  ...mapGetters('auth', ['currentUserType'])
}

export const authMethod = {
  ...mapMutations('auth', ['SET_USER_TYPE'])
}
