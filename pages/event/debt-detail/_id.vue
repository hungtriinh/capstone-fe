<template>
  <div class="main-login">
    <div>
      <div class="login login-width login-mobile debt-detail">
        <el-page-header content="Chi tiết nợ" @back="handleRouter('/event/detail/' + id)">
        </el-page-header>
        <div class="main-content"></div>
        <el-card :body-style="{ padding: '10px' }" class=" card-item mb-10 ">

          <div class="d-flex justify-between">
            <div class="d-flex justify-between gap-10 items-center">
              <span :class="step === 1 ? 'debt-detail-btn' : ''" class="cursor-pointer de-btn text-bold text-red" @click="step = 1">Phải trả</span>
            </div>
            <div class="d-flex justify-between gap-10 items-center">
              <span :class="step !== 1 ? 'debt-detail-btn' : ''" class="cursor-pointer de-btn text-bold text-green" @click="step = 2">Nhận lại</span>
            </div>
          </div>
        </el-card>
        <div class="detail text-bold ">
          <div v-if="step === 1" class="d-flex justify-center items-center mb-10" style="width: 100%">
            <span :class="step === 1 ? 'debt-detail-btn' : ''" class="cursor-pointer de-btn text-bold text-red">Tổng phải trả {{ listReceipt.amount }}</span>
          </div>
          <div v-if="step !== 1" class="d-flex justify-center items-center mb-10" style="width: 100%">
            <span :class="step !== 1 ? 'debt-detail-btn' : ''" class="cursor-pointer de-btn text-bold text-green">Tổng nhận lại {{ listReceipt.amount }}</span>
          </div>

          <el-card  v-for="(receipt, key) in listReceipt.list" :key="key" :body-style="{ padding: '10px' }" class=" card-item mb-10 ">
            <div class="d-flex justify-between">
              <div class="d-flex gap-10 items-center">
                <div>
                  <el-badge is-dot class="event-status item" type="success">
                    <div v-if="receipt.avatar">
                      <el-image class="image-avatar" :preview-src-list="[receipt.avatar]" :src="receipt.avatar"/>
                    </div>
                    <div v-else>
                      <ShowAvatarElement :event="{ name: receipt.name }"></ShowAvatarElement>
                    </div>
                  </el-badge>
                </div>
                <div>
                  <span class="text-bold">{{ receipt.name }}</span><br>
                  <span class="time">{{ receipt.phone }}</span>
                </div>
              </div>

              <div class="d-flex gap-5 items-center">
                <i v-if="step !== 1" class="el-icon el-icon-alarm-clock" @click="openConfirmDialog(receipt)"></i>

                <div class="text-blue text-end cursor-pointer" >{{receipt.money}} <br> </div>
                <i class="el-icon el-icon-info" @click="openDetailDialog(receipt.receiptId)"></i>
              </div>
            </div>
          </el-card>
          <div class="text-center" style="margin-top: 30px">
            <el-button v-if="step === 1 && money !== '0 ₫'" type="danger" @click="handlePaidCheckClick">{{ $t('home.pay') }}</el-button>
          </div>

        </div>
      </div>
    </div>
    <el-dialog class="receipt-detail-dialog" :title="receiptDetail.receiptName" :visible.sync="dialogVisible">
      <span class="time">{{ receiptDetail.date }}</span>
      <div class="event-item">
        <el-timeline class="receipt-detail-card">
          <div class="event-title d-flex flex-wrap justify-between items-center cursor-pointer">
            <div class="d-flex gap-10 items-center event-name">
            <el-badge is-dot class="event-status item" :type="user.role === 4 ?  'danger' : 'success'">
              <div v-if="user.avatar">
                <el-image class="image-avatar" :preview-src-list="[user.avatar]" :src="user.avatar"/>
              </div>
              <div v-else>
                <ShowAvatarElement :event="{ name: user.name, color: receiptDetail.color }"></ShowAvatarElement>
              </div>
            </el-badge>
            <div class="event-content">
              <h4 class="title text-bold">{{ user.name }}</h4>
              <span class="time">{{ user.phone }}</span>
            </div>
          </div>
            <div class="d-flex items-center ">
              <span class="text-bold" :class="user.totalAmount >= 0 ? 'text-green' : 'text-red'">{{user.totalAmountFormat}}</span>
            </div>
          </div>
          <el-timeline-item v-for="(user, key) in receiptDetail.userDepts" :key="key" placement="top">
            <el-card>
              <div class="d-flex justify-between flex-wrap">
                <div class="d-flex gap-10 items-center event-name">
                  <el-badge is-dot class="event-status item" :type="user.role === 4 ?  'danger' : 'success'">
                    <div v-if="user.avatar">
                      <el-image class="image-avatar" :preview-src-list="[user.avatar]" :src="user.avatar"/>
                    </div>
                    <div v-else>
                      <ShowAvatarElement :event="{ name: user.name, color: receiptDetail.color }"></ShowAvatarElement>
                    </div>
                  </el-badge>
                  <div class="event-content">
                    <h4 class="title text-bold">{{ user.name }}</h4>
                    <span class="time">{{ user.phone }}</span>
                  </div>
                </div>
<!--                <span class="text-normal-sm">{{ user.name }}</span>-->
                <span class="text-normal-sm"> </span><span :class="user.totalAmount >= 0 ? 'text-green' : 'text-red'">{{user.totalAmountFormat}}</span>
              </div>
            </el-card>
          </el-timeline-item>
          <el-divider class="divider"></el-divider>
        </el-timeline>
      </div>

    </el-dialog>

  </div>
</template>
<script>

import {
  INDEX_SET_LOADING,
  GET_SHARE_LINK,
  RECEIPT_DETAIL,
  DEBT_GET_ALL_DEBT,
  DEBT_CLICK_I,
  DEBT_GET_ALL_RECEIPT,
  DEBT_REMIND,
  INDEX_SET_SUCCESS, INDEX_SET_ERROR, GET_RECEIPT_LIST, GET_PAID_CHECK
} from '~/store/store.const'

export default {
  name: 'MainPage',
  middleware: 'auth',
  components: {
  },
  data() {
    return {
      paidCheck: false,
      search: '',
      listReceipt: {},
      receiptDetail: {},
      list: [],
      user: {},
      detailDebt: {},
      receiveOrPaidAmount: {},
      hideTotal: false,
      id: this.$route.params.id,
      percent: '',
      step: 1,
      money: '',
      dialogVisible: false,
      debtVisible: false
    }
  },
  watch: {
    async receiveOrPaidAmount() {
      // if (this.receiveOrPaidAmount.color === 'Green') {
      //   this.step = 2
      //   await this.getListReceipt()
      // } else {
      //   this.step = 1
      //   await this.getListEvent()
      // }
    },
    async step(newValue, oldValue) {
      if (this.step === 1) {
        await this.getListEvent()
      } else {
        await this.getListReceipt()
      }
    }
  },
  async created() {
    await this.getStatus()
    await this.getListEvent()
  },
  methods: {
    async handlePaidCheckClick() {
      await this.handlePaidCheck()
      if (this.paidCheck) {
        return
      }
      this.handleRouter('/event/debt/' + this.$route.params.id)
    },
    async handlePaidCheck() {
      this.paidCheck = false
      try {
        const data = await this.$store.dispatch(GET_PAID_CHECK, this.id)
        switch (data.statusCode) {
          case 406:
            this.$store.commit(INDEX_SET_ERROR, {
              show: true,
              text: data.message
            })
            this.paidCheck = true
            break
        }
      } catch (e) {
        this.$store.commit(INDEX_SET_ERROR, { show: true, text: this.$t('message.message_error') })
        this.$store.commit(INDEX_SET_LOADING, false)
      }
      this.$store.commit(INDEX_SET_LOADING, false)
    },
    async getListEvent() {
      this.$store.commit(INDEX_SET_LOADING, true)
      try {
        const response = await this.$store.dispatch(DEBT_GET_ALL_DEBT, this.$route.params.id)
        const { data, statusCode } = response
        if (statusCode === 202) {
          this.listReceipt = data
          this.money = data.amount
        }
      } catch (e) {
        this.$store.commit(INDEX_SET_LOADING, false)
      }
      this.$store.commit(INDEX_SET_LOADING, false)
    },
    async getListReceipt() {
      this.$store.commit(INDEX_SET_LOADING, true)
      try {
        const response = await this.$store.dispatch(DEBT_GET_ALL_RECEIPT, this.$route.params.id)
        const { data, statusCode } = response
        if (statusCode === 202) {
          this.listReceipt = data
        }
      } catch (e) {
        this.$store.commit(INDEX_SET_LOADING, false)
      }
      this.$store.commit(INDEX_SET_LOADING, false)
    },
    handleRouter(router) {
      this.$router.push(router)
    },
    async getStatus() {
      this.$store.commit(INDEX_SET_LOADING, true)
      try {
        const response = await this.$store.dispatch(GET_RECEIPT_LIST, this.$route.params.id)
        const { data, statusCode } = response
        if (statusCode === 202) {
          this.receiveOrPaidAmount = data.receiveOrPaidAmount
        }
      } catch (e) {
        this.$store.commit(INDEX_SET_LOADING, false)
      }
      this.$store.commit(INDEX_SET_LOADING, false)
    },
    async getShareLink() {
      this.$store.commit(INDEX_SET_LOADING, true)
      try {
        const response = await this.$store.dispatch(GET_SHARE_LINK, this.id)
        if (response.statusCode === 202) {
          this.$cookies.set('eventUrl', response.data)
          this.$router.push('/qr')
        }
      } catch (e) {
        this.$store.commit(INDEX_SET_LOADING, false)
      }
      this.$store.commit(INDEX_SET_LOADING, false)
    },
    async getReceiptDetail(id) {
      this.$store.commit(INDEX_SET_LOADING, true)
      try {
        const response = await this.$store.dispatch(RECEIPT_DETAIL, id)
        if (response.statusCode === 202) {
          this.receiptDetail = response.data
          this.user = response.data.user
        }
      } catch (e) {
        this.$store.commit(INDEX_SET_LOADING, false)
      }
      this.$store.commit(INDEX_SET_LOADING, false)
    },
    async openDetailDialog(id) {
      await this.getReceiptDetail(id)
      this.dialogVisible = true
    },
    async openDetailDebtDialog(id) {
      await this.getDebtDetail(id)
      this.debtVisible = true
    },
    async getDebtDetail(id) {
      this.$store.commit(INDEX_SET_LOADING, true)
      try {
        const response = await this.$store.dispatch(DEBT_CLICK_I, id)
        if (response.statusCode === 202) {
          this.detailDebt = response.data
        }
      } catch (e) {
        this.$store.commit(INDEX_SET_LOADING, false)
      }
      this.$store.commit(INDEX_SET_LOADING, false)
    },
    async sendRemind(user) {
      this.$store.commit(INDEX_SET_LOADING, true)
      try {
        const data = await this.$store.dispatch(DEBT_REMIND, user)
        switch (data.status_code) {
          case 200:
            this.$store.commit(INDEX_SET_SUCCESS, {
              show: true,
              text: data.message
            })
            break
          default:
            this.$store.commit(INDEX_SET_ERROR, { show: true, text: data.data })
            break
        }
      } catch (e) {
        this.$store.commit(INDEX_SET_LOADING, false)
      }
      this.$store.commit(INDEX_SET_LOADING, false)
    },
    openConfirmDialog(user) {
      this.$confirm('Bạn có muốn nhắc người này trả tiền?', 'Xác nhận', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        this.sendRemind(user)
      }).catch(() => {
        // this.$message({
        //   type: 'info',
        //   message: 'Delete canceled'
        // })
      })
    }

  }
}
</script>
