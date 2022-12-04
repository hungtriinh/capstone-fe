import _ from 'lodash'
import { handleApi } from '../utils/handleApi'

export const state = () => ({
  notifySuccess: { show: false, text: '', message: '' },
  notifyError: { show: false, text: '', message: '' },
  notifyWarning: { show: false, text: '', message: '' },
  loading: false,
  email: '',
  listFriends: [],
  isOtpPage: false
})

export const getters = {}

export const mutations = {
  setNotifySuccess(state, notify) {
    state.notifySuccess = _.cloneDeep(notify)
  },
  setNotifyError(state, notify) {
    state.notifyError = _.cloneDeep(notify)
  },
  setNotifyWarning(state, notify) {
    state.notifyWarning = _.cloneDeep(notify)
  },
  setLoading(state, loading) {
    state.loading = loading
  },
  setIsOtpPage(state, isOtpPage) {
    state.isOtpPage = isOtpPage
  },
  setEmail(state, email) {
    state.email = email
  },
  setListFriends(state, listFriends) {
    state.listFriends = listFriends
  }
}

export const actions = {
  uploadFile(context, data) {
    return new Promise((resolve, reject) => {
      handleApi(resolve, reject, this.$axios.post('/upload-image', data), context)
    })
  },
  getEventList(context, data) {
    return new Promise((resolve, reject) => {
      handleApi(resolve, reject, this.$axios.get('event'), context)
    })
  },
  getFriendList(context, data) {
    return new Promise((resolve, reject) => {
      handleApi(resolve, reject, this.$axios.get('friend'), context)
    })
  },
  createEvent(context, data) {
    return new Promise((resolve, reject) => {
      handleApi(resolve, reject, this.$axios.post('event', data), context)
    })
  },
  createReceipt(context, data) {
    return new Promise((resolve, reject) => {
      handleApi(resolve, reject, this.$axios.post('receipt/create', data), context)
    })
  },
  getReceiptList(context, data) {
    return new Promise((resolve, reject) => {
      handleApi(resolve, reject, this.$axios.get(`receipt?eventID=${data}`), context)
    })
  },
  getMemberList(context, data) {
    return new Promise((resolve, reject) => {
      handleApi(resolve, reject, this.$axios.get(`receipt/create?eventID=${data}`), context)
    })
  },
  getDebtList(context, data) {
    return new Promise((resolve, reject) => {
      handleApi(resolve, reject, this.$axios.post('paidDebt/listDebt', data), context)
    })
  },
  payDebt(context, data) {
    return new Promise((resolve, reject) => {
      handleApi(resolve, reject, this.$axios.post('paidDebt/paidDebt', data), context)
    })
  },
  getEventDetail(context, data) {
    return new Promise((resolve, reject) => {
      handleApi(resolve, reject, this.$axios.get(`event/eventDetail/eventID=${data}`), context)
    })
  },
  getRequestWaiting(context, data) {
    return new Promise((resolve, reject) => {
      handleApi(resolve, reject, this.$axios.get(`event/joinRequest-waiting/eventID=${data}`), context)
    })
  },
  getRequestHistory(context, data) {
    return new Promise((resolve, reject) => {
      handleApi(resolve, reject, this.$axios.get(`event/joinRequest-history/eventID=${data}`), context)
    })
  },
  approveRequest(context, data) {
    return new Promise((resolve, reject) => {
      handleApi(resolve, reject, this.$axios.post('/event/event-approve', data), context)
    })
  },
  getListDocument(context, data) {
    return new Promise((resolve, reject) => {
      handleApi(resolve, reject, this.$axios.get(`receipt/receipt-sent/EventId=${data}`), context)
    })
  }
}
