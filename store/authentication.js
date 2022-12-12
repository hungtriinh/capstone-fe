import { handleApi } from '../utils/handleApi'

export const state = () => ({
})

export const getters = {}

export const mutations = {
}

export const actions = {
  changePass(context, data) {
    return new Promise((resolve, reject) => {
      handleApi(resolve, reject, this.$axios.get('/profile/request', data), context)
    })
  }
}
