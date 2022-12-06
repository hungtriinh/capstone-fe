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
          <i @click="getShareLink" class="el-icon el-icon-share"></i>
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
                <span class="text-bold-sm text-orange">{{ listReceipt.userAmount }}</span>
              </div>
              <div class="d-flex justify-between gap-10">
                <span class="text-normal-sm text-blue">Nhóm đã chi: </span>
                <span class="text-bold-sm text-blue">{{ listReceipt.groupAmount }}</span>
              </div>
              <div class="d-flex justify-between gap-10">
                <span class="text-normal-sm">Tổng: </span>
                <span class="text-bold-sm">{{ listReceipt.totalAmount }}</span>
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
                >Chi tiết</el-button>
              </div>
            </div>
            <div v-else class="d-flex justify-center">
                <span class="text-bold">Bạn đã trả hết nợ!</span>
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
                  <span class="time">23:05 - 5/10/2022</span>
                </div>
              </div>

              <div class="d-flex gap-5 items-center">
                <div class="text-blue text-end">Tổng <br> {{ receipt.receiptAmountFormat }}</div>
                <i class="el-icon el-icon-arrow-right"></i>
              </div>
            </div>
            <div v-else class="d-flex justify-between">
              <div class="d-flex gap-10 items-center">
                <el-tooltip class="item" effect="dark" content="Bị report" placement="bottom">
                  <img src="~/assets/images/icons/warning.svg" alt="">
                </el-tooltip>
                <div>
                  <span class="text-yellow">{{ receipt.receiptName }}</span><br>
                  <span class="text-yellow time">23:05 - 5/10/2022</span>
                </div>
              </div>

              <div class="d-flex gap-5 items-center">
                <div class="text-yellow text-end">Tổng <br> {{ receipt.receiptAmountFormat }}</div>
                <i class="el-icon el-icon-arrow-right"></i>
              </div>
            </div>

          </el-card>
        </div>
        <div class="btn-group text-center">
          <el-button v-if="receiveOrPaidAmount.color !== 'Gray'" @click="handleRouter('/event/debt/' + $route.params.id )">{{ $t('home.pay') }}</el-button>
          <el-button type="primary" @click="handleRouter('/event/create-receipt/' + $route.params.id )">{{ $t('home.add_receipt') }}</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// import { AUTH_REGISTER, INDEX_SET_ERROR, INDEX_SET_LOADING, INDEX_SET_SUCCESS, SET_EMAIL } from '@/store/store.const'
// import { TYPE_REGISTER_OTP } from '@/store/store.const.js'
// import { validPhoneNoPrefix } from '@/utils/validate'
import Chart from 'chart.js/auto'
import { GET_RECEIPT_LIST, INDEX_SET_LOADING, GET_SHARE_LINK } from '~/store/store.const'

export default {
  name: 'MainPage',
  components: {
  },
  data() {
    return {
      search: '',
      listReceipt: {},
      list: [],
      receiveOrPaidAmount: {},
      hideTotal: false,
      id: this.$route.params.id
    }
  },
  computed: {
    percent() {
      if (this.listReceipt.totalAmount) {
        return this.listReceipt.userAmount / this.listReceipt.totalAmount
      } else {
        return 0
      }
    }
  },
  async created() {
    await this.getListEvent()
  },
  mounted() {
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
        const response = await this.$store.dispatch(GET_RECEIPT_LIST, this.$route.params.id)
        const { data, statusCode } = response
        if (statusCode === 202) {
          this.listReceipt = data
          this.list = data.listReceipt
          this.receiveOrPaidAmount = data.receiveOrPaidAmount
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
    }
  }
}
</script>
