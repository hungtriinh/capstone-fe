<template>
  <div class="main-login setting-page">
    <div>
      <div class="login login-width login-mobile">
        <div class="main-content">
          <!--          <el-avatar class="avatar" :size="100" :src="circleUrl"></el-avatar>-->
          <div class="main-setting-avatar d-flex justify-center">
            <ShowAvatarElement :event="{ name: listEvent.EventName, color: listEvent.color }"></ShowAvatarElement>
          </div>
          <h3 class="title text-center text-[#011A51] font-semibold">{{listEvent.EventName}}</h3>
          <el-card :body-style="{ padding: '10px' }" class=" card-item mb-10 ">
              <div class="text-center text-bold">{{listEvent.EventDescript}}</div>
          </el-card>
          <el-card :body-style="{ padding: '10px' }" class="card-item">
            <div v-for="(item, key) in listEvent.ListMembers" :key="key">
              <div v-if="listEvent.ListMembers.length">
                <div class="flex-between">
                  <div class="member-avatar d-flex items-center mt-10 gap-10">
                    <ShowAvatarElement :event="{ name: item.name }"></ShowAvatarElement>
                    <div>
                      <span class="text-bold">{{ item.name }}</span>
                      <br><span class="time">{{ item.phone }}</span>
                    </div>
                  </div>
                  <div>
                  </div>
                </div>
              </div>
            </div>
          </el-card>
          <div class="main-content"></div>
          <div class="d-flex justify-center items-center">
            <el-button type="primary text-center">
              Gửi yêu cầu tham gia
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {
  EVENT_CHECK_JOIN,
  INDEX_SET_LOADING,
  GET_SHARE_LINK,
  RECEIPT_DETAIL,
  DEBT_GET_DETAIL,
  REPORT_CREATE,
  INDEX_SET_ERROR, INDEX_SET_SUCCESS,
  EVENT_JOIN_REQUEST,
  EVENT_INTRODUCE
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
      listEvent: [],
      detailDebt: {},
      receiveOrPaidAmount: {},
      hideTotal: false,
      innerVisible: false,
      id: this.$route.params.slug,
      percent: '',
      dialogVisible: false,
      debtVisible: false
    }
  },
  async created() {
    await this.getListEvent()
    await this.checkJoin()
  },
  async mounted() {
  },
  methods: {
    async getListEvent() {
      this.$store.commit(INDEX_SET_LOADING, true)
      try {
        const response = await this.$store.dispatch(EVENT_INTRODUCE, 11)
        const { data, statusCode } = response
        if (statusCode === 202) {
          this.listEvent = data
        }
      } catch (e) {
        this.$store.commit(INDEX_SET_LOADING, false)
      }
      this.$store.commit(INDEX_SET_LOADING, false)
    },

    async checkJoin() {
      this.$store.commit(INDEX_SET_LOADING, true)
      try {
        const response = await this.$store.dispatch(EVENT_CHECK_JOIN, this.$route.query.eventId)
        if (response.statusCode === 202) {
          this.$router.push('/event/detail/' + response.data.EventId)
        } else if (response.statusCode === 404) {
          console.log(response)
          this.$router.push('/404-not-found')
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
