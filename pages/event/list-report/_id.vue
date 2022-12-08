<template>
  <div class="main-login list-receipt-page">
    <div>
      <div class="login login-width login-mobile">
        <div class="d-flex justify-between">
          <el-page-header content="Danh sách Yêu cầu trả tiền" @back="goBack">
          </el-page-header>
          <el-tooltip class="item" effect="dark" content="History" placement="bottom">
            <i @click="handleRouter('/event/list-report-history/' + id)" class="el-icon el-icon-time" ></i>
          </el-tooltip>
        </div>

        <el-empty v-if="!listEvent.length" description="Không có chứng từ nào"></el-empty>
        <div v-else>
          <div class="main-content">

            <el-card v-for="(item, key) in listEvent" :key="key" :body-style="{ padding: '10px' }" class="card-item">
              <div class="">
                <div class="d-flex justify-between " style="flex-wrap: wrap;">
                  <div>
                    <span class="text-bold">Sự kiện: {{item.reportReceiptName}}</span>
                    <br>
                    <time class="time"> {{ item.createdAt }}</time>
                    <br>
                    <br>
                    <!--                    <div><span class="text-bold">{{ item.receiptName }}</span>: <span class="text-bold money">{{ item.receiptAmount }}</span></div>-->
                    <div class=""><span class="text-bold">Nội dung: {{ item.reportReason }}</span></div>
                  </div>
                  <div class="  items-center">
                    <el-button type="danger" icon="el-icon-delete" @click="openConfirmDialog(2, item.id)"></el-button>
                    <el-button type="success" icon="el-icon-check" @click="openConfirmDialog(1, item.id)"></el-button>
                  </div>
                </div>
              </div>
            </el-card>
          </div>
        </div>
      </div>
    </div>
    <el-dialog class="receipt-detail-dialog" :title="receiptDetail.receiptName" :visible.sync="dialogVisible">
      <span class="time">{{ receiptDetail.date }}</span>
      <div class="event-item">
        <el-timeline class="receipt-detail-card">
          <div class="event-title d-flex justify-between items-center cursor-pointer">
            <div class="d-flex gap-5 items-center event-name">
              <ShowAvatarElement :event="{ name: user.name, color: receiptDetail.color }"></ShowAvatarElement>
              <div class="event-content">
                <h4 class="title text-bold">{{ user.name }}</h4>
              </div>
            </div>
            <div class="d-flex items-center ">
              <span class="text-bold" :class="user.totalAmount >= 0 ? 'text-green' : 'text-red'">{{user.totalAmount}}</span>
            </div>
          </div>
          <el-timeline-item v-for="(user, key) in receiptDetail.userDepts" :key="key" placement="top">
            <el-card>
              <div class="d-flex justify-between">
                <span class="text-normal-sm">{{ user.name }}</span>
                <span class="text-normal-sm"> </span><span :class="user.totalAmount >= 0 ? 'text-green' : 'text-red'">{{user.totalAmount}}</span>
              </div>
            </el-card>
          </el-timeline-item>
          <el-divider class="divider"></el-divider>
        </el-timeline>
        <div>
          <!--              <img class="status-img" src="~/assets/images/icons/circle-red.svg" alt="status">-->
          <!--              <img src="~/assets/images/icons/dots.svg" alt="status">-->
        </div>
      </div>

    </el-dialog>
  </div>
</template>
<script>
import {
  REPORT_APPROVE,
  REPORT_GET_LIST,
  INDEX_SET_LOADING,
  INDEX_SET_SUCCESS,
  INDEX_SET_ERROR,
  RECEIPT_DETAIL
} from '~/store/store.const'

export default {
  name: 'ListReceiptPage',
  // middleware: 'auth',
  components: {
    // ShowAvatarElement
  },
  data() {
    return {
      id: this.$route.params.id,
      search: '',
      listEvent: [],
      listRequestId: [],
      ListId: [],
      listChecked: [],
      checkAll: false,
      isIndeterminate: false,
      receiptDetail: {},
      user: {},
      dialogVisible: false
    }
  },
  watch: {
    listEvent(newValue, oldValue) {
    }
  },
  created() {
    this.getListEvent()
  },
  mounted() {
  },
  methods: {
    errorHandler() {
      return true
    },
    async getListEvent() {
      this.$store.commit(INDEX_SET_LOADING, true)
      try {
        const response = await this.$store.dispatch(REPORT_GET_LIST, this.id)
        if (response.statusCode === 202) {
          this.listEvent = response.data
          this.listEvent.forEach((element) => {
            this.listRequestId.push(element.receiptId)
          })
        }
      } catch (e) {
        this.$store.commit(INDEX_SET_LOADING, false)
      }
      this.$store.commit(INDEX_SET_LOADING, false)
    },
    handleRouter(route) {
      this.$router.push(route)
    },
    handleCheckedCitiesChange(value) {
      const checkedCount = value.length
      this.checkAll = checkedCount === this.listEvent.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.listEvent.length
    },
    handleCheckAllChange(val) {
      this.listChecked = val ? this.listRequestId : []
      this.isIndeterminate = false
    },
    goBack() {
      this.handleRouter('/event/setting/' + this.id)
    },
    async eventAppoveSelect(status, id) {
      this.$store.commit(INDEX_SET_LOADING, true)
      try {
        const response = await this.$store.dispatch(REPORT_APPROVE, {
          id,
          reportstatus: status
        })
        if (response.statusCode === 202) {
          await this.$store.commit(INDEX_SET_SUCCESS, {
            show: true,
            text: response.message
          })
          this.getListEvent()
        } else if (response.statusCode === 400) {
          await this.$store.commit(INDEX_SET_ERROR, {
            show: true,
            text: response.message
          })
        } else {
          await this.$store.commit(INDEX_SET_ERROR, {
            show: true,
            text: response.message
          })
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
    openConfirmDialog(status, id) {
      this.$confirm('Bạn có chắc chắn thực hiện thao tác này?', 'Xác nhận', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        this.eventAppoveSelect(status, id)
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
