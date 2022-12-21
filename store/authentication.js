import { handleApi } from '../utils/handleApi'

export const state = () => ({
})

export const getters = {}

export const mutations = {
}

export const actions = {
  changePass(context, data) {
    return new Promise((resolve, reject) => {
      handleApi(resolve, reject, this.$axios.post('/password/change-password', data), context)
    })
  },
  forgotPass(context, data) {
    return new Promise((resolve, reject) => {
      handleApi(resolve, reject, this.$axios.post('/password/new-password', data), context)
    })
  }

}
