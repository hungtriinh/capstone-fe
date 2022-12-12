import _ from 'lodash'
import { handleApi } from '../utils/handleApi'

export const state = () => ({
  notifySuccess: { show: false, text: '', message: '' },
  notifyError: { show: false, text: '', message: '' },
  notifyWarning: { show: false, text: '', message: '' },
  loading: false,
  email: '',
  listFriends: [],
  roleMember: [],
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
  },
  setRoleMember(state, roleMember) {
    state.roleMember = roleMember
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
  closeEvent(context, data) {
    return new Promise((resolve, reject) => {
      handleApi(resolve, reject, this.$axios.get(`event/event-close/EventId=${data}`), context)
    })
  },
  editEvent(context, data) {
    return new Promise((resolve, reject) => {
      handleApi(resolve, reject, this.$axios.post('/event/edit-event', data), context)
    })
  },
  getShareLink(context, data) {
    return new Promise((resolve, reject) => {
      handleApi(resolve, reject, this.$axios.get(`event/shareablelink/EventID=${data}`), context)
    })
  },
  getListDocument(context, data) {
    return new Promise((resolve, reject) => {
      handleApi(resolve, reject, this.$axios.get(`receipt/receipt-sent/EventId=${data}`), context)
    })
  },
  getReceiptDetail(context, data) {
    return new Promise((resolve, reject) => {
      handleApi(resolve, reject, this.$axios.get(`receipt/receipt-detail/ReceiptId=${data}`), context)
    })
  },
  getListReceiptWaiting(context, data) {
    return new Promise((resolve, reject) => {
      handleApi(resolve, reject, this.$axios.get(`receipt/receiptSent-waiting/EventId=${data}`), context)
    })
  },
  acceptReceipt(context, data) {
    return new Promise((resolve, reject) => {
      handleApi(resolve, reject, this.$axios.post('receipt/receipt-approve', data), context)
    })
  },
  // yeu cau tra tien
  getDebtSent(context, data) {
    return new Promise((resolve, reject) => {
      handleApi(resolve, reject, this.$axios.get(`paidDebt/paid-sent/eventId=${data}`), context)
    })
  },
  getDebtCode(context, data) {
    return new Promise((resolve, reject) => {
      handleApi(resolve, reject, this.$axios.get('paidDebt/paid-code'), context)
    })
  },
  getDebtDetail(context, data) {
    return new Promise((resolve, reject) => {
      handleApi(resolve, reject, this.$axios.get(`paidDebt/paid-detail/PaidId=${data}`), context)
    })
  },
  getAllDebt(context, data) {
    return new Promise((resolve, reject) => {
      handleApi(resolve, reject, this.$axios.get(`DebtReceiveDetail/getDebt/EventId=${data}`), context)
    })
  },
  getAllReceipt(context, data) {
    return new Promise((resolve, reject) => {
      handleApi(resolve, reject, this.$axios.get(`DebtReceiveDetail/getReceive/EventId=${data}`), context)
    })
  },
  clickIbutton(context, data) {
    return new Promise((resolve, reject) => {
      handleApi(resolve, reject, this.$axios.get(`DebtReceiveDetail/showDetail/ReceipId=${data}`), context)
    })
  },
  clickRemind(context, data) {
    return new Promise((resolve, reject) => {
      handleApi(resolve, reject, this.$axios.post('DebtReceiveDetail/sendSMS', data), context)
    })
  },
  // danh sach thanh vien
  getAllMember(context, data) {
    return new Promise((resolve, reject) => {
      handleApi(resolve, reject, this.$axios.get(`member/eventId=${data}`), context)
    })
  },
  removeMember(context, data) {
    return new Promise((resolve, reject) => {
      handleApi(resolve, reject, this.$axios.post('/member/remove-member', data), context)
    })
  },
  promoteMember(context, data) {
    return new Promise((resolve, reject) => {
      handleApi(resolve, reject, this.$axios.post('/member/promote', data), context)
    })
  },
  removeRoleMember(context, data) {
    return new Promise((resolve, reject) => {
      handleApi(resolve, reject, this.$axios.post('/member/delete-promote', data), context)
    })
  },
  uploadReceipt(context, data) {
    return new Promise((resolve, reject) => {
      handleApi(resolve, reject, this.$axios.post('/image/receipt', data), context)
    })
  },
  uploadDebt(context, data) {
    return new Promise((resolve, reject) => {
      handleApi(resolve, reject, this.$axios.post('/image/paiddept', data), context)
    })
  },
  getListReport(context, data) {
    return new Promise((resolve, reject) => {
      handleApi(resolve, reject, this.$axios.get(`report?eventid=${data}`), context)
    })
  },
  approveReport(context, data) {
    return new Promise((resolve, reject) => {
      handleApi(resolve, reject, this.$axios.post('report/respone-report', data), context)
    })
  },
  createReport(context, data) {
    return new Promise((resolve, reject) => {
      handleApi(resolve, reject, this.$axios.post('report', data), context)
    })
  },
  getListReportHistory(context, data) {
    return new Promise((resolve, reject) => {
      handleApi(resolve, reject, this.$axios.get(`report/history?eventid=${data}`), context)
    })
  },
  getActivity(context, data) {
    return new Promise((resolve, reject) => {
      handleApi(resolve, reject, this.$axios.get('activity'), context)
    })
  },
  getProfile(context, data) {
    return new Promise((resolve, reject) => {
      handleApi(resolve, reject, this.$axios.get('profile'), context)
    })
  },
  updateProfile(context, data) {
    return new Promise((resolve, reject) => {
      handleApi(resolve, reject, this.$axios.post('user', data), context)
    })
  },
  checkJoinEvent(context, data) {
    return new Promise((resolve, reject) => {
      handleApi(resolve, reject, this.$axios.post(`event/join/eventid=${data}`), context)
    })
  },
  eventRequest(context, data) {
    return new Promise((resolve, reject) => {
      handleApi(resolve, reject, this.$axios.post(`event/JoinRequest/EventId=${data}`), context)
    })
  },
  getListFriend(context, data) {
    return new Promise((resolve, reject) => {
      handleApi(resolve, reject, this.$axios.get('friend'), context)
    })
  },
  getListFriendRequest(context, data) {
    return new Promise((resolve, reject) => {
      handleApi(resolve, reject, this.$axios.get('friend/friend-request'), context)
    })
  },
  sendFriendRequest(context, data) {
    return new Promise((resolve, reject) => {
      handleApi(resolve, reject, this.$axios.post('friend/friend-request', data), context)
    })
  },
  deleteFriendRequest(context, data) {
    return new Promise((resolve, reject) => {
      handleApi(resolve, reject, this.$axios.delete(`friend/${data}`), context)
    })
  },
  responseFriendRequest(context, data) {
    return new Promise((resolve, reject) => {
      handleApi(resolve, reject, this.$axios.post('friend/response-request', data), context)
    })
  },
  getFAQ(context, data) {
    return new Promise((resolve, reject) => {
      handleApi(resolve, reject, this.$axios.get('FAQ', data), context)
    })
  },
  getGroupRequest(context, data) {
    return new Promise((resolve, reject) => {
      handleApi(resolve, reject, this.$axios.get('/profile/request', data), context)
    })
  },
  getGroupInvited(context, data) {
    return new Promise((resolve, reject) => {
      handleApi(resolve, reject, this.$axios.get('/profile/invite', data), context)
    })
  },
  approveGroup(context, data) {
    return new Promise((resolve, reject) => {
      handleApi(resolve, reject, this.$axios.post('/profile/respond', data), context)
    })
  }
}
