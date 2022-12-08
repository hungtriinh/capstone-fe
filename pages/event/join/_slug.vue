<template>
  <div class="main-login">
    <div>
      <div class="login login-width login-mobile">
        <div class="d-flex justify-between">
          <div class="title-box d-flex">
            <!--          <img class="cursor-pointer" src="~/assets/images/icons/back.svg" alt="back" @click="handleRouter('/')">-->
            <i class="el-icon el-icon-back" @click="handleRouter('/')"></i>
            <div class="d-flex cursor-pointer items-center gap-5"  @click="handleRouter('/event/setting/' + id)">
              <ShowAvatarElement :event="{ name: listReceipt.eventName, color: listReceipt.color }"></ShowAvatarElement>

              <span class="d-flex items-center text-bold">{{ listReceipt.eventName }}<i class="el-icon event-navi el-icon-arrow-right"></i></span>
            </div>
          </div>
          <i class="el-icon el-icon-share" @click="getShareLink"></i>
        </div>
        <el-card :body-style="{ padding: '10px' }" class=" card-item mb-10 ">
          <div class="chart-title d-flex justify-center" >
            <div>
              <div class="bar-chart">
                <canvas id="myChart" width="90%" ></canvas>
              </div>
            </div>
            <div>
              <div class="d-flex justify-between gap-10 mt-10">
                <span class="text-normal-sm text-orange">Bạn đã chi: </span>
                <span class="text-bold-sm text-orange">{{ listReceipt.userAmountFormat }}</span>
              </div>
              <div class="d-flex justify-between gap-10">
                <span class="text-normal-sm text-blue">Nhóm đã chi: </span>
                <span class="text-bold-sm text-blue">{{ listReceipt.groupAmountFormat }}</span>
              </div>
              <div class="d-flex justify-between gap-10">
                <span class="text-normal-sm">Tổng: </span>
                <span class="text-bold-sm">{{ listReceipt.totalAmountFormat }}</span>
              </div>

            </div>
          </div>

          <el-card shadow="hover" :body-style="{ padding: '10px' }" class=" card-item mt-10 ">
            <div v-if="receiveOrPaidAmount.color === 'Green'" class="d-flex justify-between">
              <div class="d-flex justify-between gap-10 items-center">
                <span class="text-bold text-green">Chờ nhận lại: </span>
                <span class="text-bold text-green">{{ receiveOrPaidAmount.amountFormat }}</span>
              </div>
              <div>
                <el-button
                  type="primary"
                  @click="handleRouter('/event/debt-detail/' + id)"
                >Chi tiết</el-button>
              </div>
            </div>
            <div v-else-if="receiveOrPaidAmount.color === 'Red'" class="d-flex justify-between">
              <div class="d-flex justify-between gap-10 items-center">
                <span class="text-bold text-red">Phải trả nợ: </span>
                <span class="text-bold text-red">{{ receiveOrPaidAmount.amountFormat }}</span>
              </div>
              <div>
                <el-button
                  type="primary"
                  @click="handleRouter('/event/debt-detail/' + id)"
                >Chi tiết</el-button>
              </div>
            </div>
            <div v-else class="d-flex justify-center">
                <span class="text-bold"><el-button
                  type="primary"
                  @click="handleRouter('/event/debt-detail/' + id)"
                >Chi tiết</el-button></span>
            </div>

          </el-card>

        </el-card>
        <el-empty v-if="listReceipt.listReceipt && !listReceipt.listReceipt.length" description="Sự kiện không có chứng từ nào"></el-empty>

        <div v-else class="detail text-bold">
          <el-card v-for="(receipt, key) in listReceipt.listReceipt" :key="key" :body-style="{ padding: '10px' }" class=" card-item mb-10 ">
            <div v-if="receipt.receiptStatus !== 4" class="d-flex justify-between">
              <div class="d-flex gap-10 items-center">
                <img src="~/assets/images/icons/clipboard-text.svg" alt="">
                <div>
                  <span >{{ receipt.receiptName }}</span><br>
                  <span class="time">{{ receipt.createdAt }}</span>
                </div>
              </div>

              <div class="d-flex gap-5 items-center">
                <div class="text-blue text-end cursor-pointer" @click="openDetailDialog(receipt.id)">Tổng <br> {{ receipt.receiptAmountFormat }}</div>
                <i class="el-icon el-icon-arrow-right"></i>
              </div>
            </div>
            <div v-else class="d-flex justify-between">
              <div class="d-flex gap-10 items-center">
                <el-tooltip class="item" effect="dark" content="Đang bị report" placement="bottom">
                  <img src="~/assets/images/icons/warning.svg" alt="">
                </el-tooltip>
                <div>
                  <span class="text-yellow">{{ receipt.receiptName }}</span><br>
                  <span class="text-yellow time">{{ receipt.createdAt }}</span>
                </div>
              </div>

              <div class="d-flex gap-5 items-center cursor-pointer" @click="openDetailDialog(receipt.id)">
                <div class="text-yellow text-end">Tổng <br> {{ receipt.receiptAmountFormat }}</div>
                <i class="el-icon el-icon-arrow-right"></i>
              </div>
            </div>

          </el-card>
        </div>
        <div class="btn-group text-center">
          <el-button v-if="receiveOrPaidAmount.color !== 'Gray' && listReceipt.eventStatus !== 0" @click="handleRouter('/event/debt/' + $route.params.id )">{{ $t('home.pay') }}</el-button>
          <el-button v-if="listReceipt.eventStatus !== 0" type="primary" @click="handleRouter('/event/create-receipt/' + $route.params.id )">{{ $t('home.add_receipt') }}</el-button>
        </div>
      </div>
    </div>
    <el-dialog class="receipt-detail-dialog" :title="receiptDetail.receiptName" :visible.sync="dialogVisible">
      <div class="text-bold">Bạn có muốn tham gia event không?</div>
      <div style="padding-bottom: 30px" class="btn-group text-center">
        <el-button @click="handleRouter('/')">Từ chối</el-button>
        <el-button @click="joinRequest" type="primary" >Đồng ý</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Chart from 'chart.js/auto'
import {
  EVENT_CHECK_JOIN,
  INDEX_SET_LOADING,
  GET_SHARE_LINK,
  RECEIPT_DETAIL,
  DEBT_GET_DETAIL,
  REPORT_CREATE,
  INDEX_SET_ERROR, INDEX_SET_SUCCESS,
  EVENT_JOIN_REQUEST
} from '~/store/store.const'

export default {
  name: 'MainPage',
  components: {
  },
  data() {
    return {
      search: '',
      reportContent: '',
      receiptId: '',
      listReceipt: {},
      receiptDetail: {},
      list: [],
      user: {},
      detailDebt: {},
      receiveOrPaidAmount: {},
      hideTotal: false,
      innerVisible: false,
      id: this.$route.params.id,
      percent: '',
      dialogVisible: false,
      debtVisible: false
    }
  },
  async created() {
    await this.getListEvent()
  },
  async mounted() {
    await this.getListEvent()
    const ctx = document.getElementById('myChart')
    const label = [];
    (() => new Chart(ctx, {
      type: 'pie',
      data: {
        labels: label,
        datasets: [{
          label: '',
          data: [this.percent, (100 - this.percent)],
          backgroundColor: [
            '#FF731D',
            '#28A8D7',
            '#767575'
          ]
        }]
      }
    }))()
    Chart.defaults.font.size = 14
    Chart.defaults.font.color = '#FFFFFF'
  },
  methods: {
    async getListEvent() {
      this.$store.commit(INDEX_SET_LOADING, true)
      try {
        const response = await this.$store.dispatch(EVENT_CHECK_JOIN, this.$route.query.eventId)
        if (response.statusCode === 202) {
          this.$router.push('/event/detail/' + this.$route.query.eventId)
        } else if (response.statusCode === 406) {
          this.dialogVisible = true
        }
      } catch (e) {
        this.$store.commit(INDEX_SET_LOADING, false)
      }
      this.$store.commit(INDEX_SET_LOADING, false)
    },
    async joinRequest() {
      this.$store.commit(INDEX_SET_LOADING, true)
      try {
        const response = await this.$store.dispatch(EVENT_JOIN_REQUEST, this.$route.query.eventId)
        if (response.statusCode === 202) {
          await this.$store.commit(INDEX_SET_SUCCESS, {
            show: true,
            text: response.data
          })
          this.$router.push('/')
        } else if (response.statusCode === 400) {
          await this.$store.commit(INDEX_SET_ERROR, {
            show: true,
            text: 'Nhóm không tồn tại'
          })
        } else {
          await this.$store.commit(INDEX_SET_ERROR, {
            show: true,
            text: 'Có lỗi xảy ra'
          })
        }
      } catch (e) {
        this.$store.commit(INDEX_SET_LOADING, false)
        await this.$store.commit(INDEX_SET_ERROR, {
          show: true,
          text: 'Nhóm không tồn tại'
        })
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
      } catch (e) {
        this.$store.commit(INDEX_SET_LOADING, false)
      }
      this.$store.commit(INDEX_SET_LOADING, false)
    },
    async openDetailDialog(id) {
      this.receiptId = id
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
        const response = await this.$store.dispatch(DEBT_GET_DETAIL, id)
        if (response.statusCode === 202) {
          this.detailDebt = response.data
        }
      } catch (e) {
        this.$store.commit(INDEX_SET_LOADING, false)
      }
      this.$store.commit(INDEX_SET_LOADING, false)
    },
    async createReport(id) {
      if (!this.reportContent.trim()) {
        this.$store.commit(INDEX_SET_ERROR, { show: true, text: 'Vui lòng điền nội dung' })
        return
      }
      this.$store.commit(INDEX_SET_LOADING, true)
      try {
        const data = await this.$store.dispatch(REPORT_CREATE, {
          receiptid: id,
          reportreason: this.reportContent
        })

        switch (data.statusCode) {
          case 202:
            this.$store.commit(INDEX_SET_SUCCESS, {
              show: true,
              text: data.message
            })
            this.innerVisible = false
            this.reportContent = ''
            this.getListEvent()
            break
          case 500:
            this.$store.commit(INDEX_SET_ERROR, { show: true, text: data.error })
            break
          default:
            this.$store.commit(INDEX_SET_ERROR, { show: true, text: data.error })
            break
        }
      } catch (e) {
        this.$store.commit(INDEX_SET_ERROR, { show: true, text: 'Có lỗi xảy ra' })
        this.$store.commit(INDEX_SET_LOADING, false)
      }
      this.$store.commit(INDEX_SET_LOADING, false)
    }
  }
}
</script>
