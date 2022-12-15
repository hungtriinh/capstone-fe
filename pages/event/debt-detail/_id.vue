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
              <span @click="step = 1" :class="step === 1 ? 'debt-detail-btn' : ''" class="cursor-pointer de-btn text-bold text-red">Phải trả</span>
            </div>
            <div class="d-flex justify-between gap-10 items-center">
              <span @click="step = 2" :class="step !== 1 ? 'debt-detail-btn' : ''" class="cursor-pointer de-btn text-bold text-green">Nhận lại</span>
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
                  <ShowAvatarElement :event="{ name: receipt.name }"></ShowAvatarElement>
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
            <el-button v-if="step === 1 && this.money !== '0 ₫'" type="danger" @click="handleRouter('/event/debt/' + $route.params.id )">{{ $t('home.pay') }}</el-button>
          </div>

        </div>
      </div>
    </div>
    <el-dialog class="receipt-detail-dialog" :title="receiptDetail.receiptName" :visible.sync="dialogVisible">
      <span class="time">{{ receiptDetail.date }}</span>
      <div class="event-item">
        <el-timeline class="receipt-detail-card">
          <div class="event-title d-flex flex-wrap justify-between items-center cursor-pointer">
            <div class="d-flex gap-5 items-center event-name">
              <ShowAvatarElement :event="{ name: user.name, color: receiptDetail.color }"></ShowAvatarElement>
              <div class="event-content">
                <h4 class="title text-bold">{{ user.name }}</h4>
              </div>
            </div>
            <div class="d-flex items-center ">
              <span class="text-bold" :class="user.totalAmount >= 0 ? 'text-green' : 'text-red'">{{user.totalAmountFormat}}</span>
            </div>
          </div>
          <el-timeline-item v-for="(user, key) in receiptDetail.userDepts" :key="key" placement="top">
            <el-card>
              <div class="d-flex justify-between flex-wrap">
                <span class="text-normal-sm">{{ user.name }}</span>
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
  INDEX_SET_SUCCESS, INDEX_SET_ERROR
} from '~/store/store.const'

export default {
  name: 'MainPage',
  components: {
  },
  data() {
    return {
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
  async created() {
    await this.getListEvent()
  },
  watch: {
    async step(newValue, oldValue) {
      if (this.step === 1) {
        await this.getListEvent()
      } else {
        await this.getListReceipt()
      }
    }
  },
  methods: {
    async getListEvent() {
      this.$store.commit(INDEX_SET_LOADING, true)
      try {
        const response = await this.$store.dispatch(DEBT_GET_ALL_DEBT, this.$route.params.id)
        const { data, statusCode } = response
        if (statusCode === 202) {
          this.listReceipt = data
          this.money = data.amount
          console.log(this.money)
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
        console.log(this.receiptDetail)
        console.log(this.user)
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
