<template>
  <div class="main-login list-receipt-page">
    <div>
      <div class="login login-width login-mobile">

        <div class="d-flex justify-between">
          <el-page-header content="Yêu cầu trả tiền chờ duyệt" @back="goBack">
          </el-page-header>
          <el-tooltip class="item" effect="dark" content="History" placement="bottom">
            <i @click="handleRouter('/event/paid-handle/' + id)" class="el-icon el-icon-time" ></i>
          </el-tooltip>
        </div>
        <el-empty v-if="!listEvent.length" description="Không có chứng từ nào"></el-empty>
        <div v-else>
          <div class="main-content">
            <el-checkbox-group v-model="listChecked" class="checkbox-group cb-group-hide-label" @change="handleCheckedCitiesChange">

              <div v-for="(item, key) in listEvent" :key="key" class="d-flex items-center gap-5">
                <el-checkbox class="cb-hide-label" :label="item.paidDebtId" :value="item.paidDebtId"></el-checkbox>
                <el-card :body-style="{ padding: '10px' }" class="card-item">
                  <div class="d-flex justify-between">
                    <div class="list-image d-flex gap-10 flex-wrap">
                      <el-image :src="item.imageLink" :preview-src-list="[ item.imageLink ]" class="image"/>
                    </div>
                    <!--                <span class="text-bold money">{{ item.receiptAmount }}<i class="el-icon el-icon-arrow-right"></i></span>-->
                    <span class="text-bold d-flex money" @click="openDetailDialog(item.paidDebtId)">Chi tiết<i class="el-icon el-icon-arrow-right"></i></span>
                  </div>
                  <div class="">
                    <div class="flex-between">
                      <div class="avatar-name d-flex items-center mt-10 gap-5">
                        <ShowAvatarElement :event="{ name: item.user.name, color: item.color }"></ShowAvatarElement>
                        <div>

                          <span>{{ item.user.name }}</span>
                          <p class="time">{{ item.user.phone }}</p>
                        </div>
                      </div>
                    </div>
                    <div class="bottom">
                      <div>
                        <time class="time">{{ item.date }}</time>
                        <br>
                        <div>
                          <span class="text-bold">{{ item.code }}: </span>
                          <span class="text-bold money"> {{ item.totalMoneyFormat }}</span>
                        </div>

                      </div>
                      <el-tag v-show="item.type" effect="dark" type="info">{{ item.type }}</el-tag>

                      <!--                      <el-tag effect="dark" v-if="item.receiptStatus === 2" type="success">Đồng ý</el-tag>-->
<!--                      <el-tag effect="dark" v-else-if="item.receiptStatus === 3" type="danger">Từ chối</el-tag>-->
<!--                      <el-tag effect="dark" v-else-if="item.receiptStatus === 1" type="warning">Đang chờ</el-tag>-->
<!--                      <el-tag effect="dark" v-else type="">Trả hết</el-tag>-->
                    </div>
                  </div>
                </el-card>
              </div>
            </el-checkbox-group>
            <el-checkbox class="check-all" v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange"><span class="text-bold">{{ $t('event.check_all')}}</span></el-checkbox>
            <div class="btn-group justify-center d-flex items-center">
              <el-button type="danger" icon="el-icon-delete" @click="openConfirmDialog(3)">Từ chối</el-button>
              <el-button type="success" icon="el-icon-check" @click="openConfirmDialog(2)">Đồng ý</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog class="receipt-detail-dialog" :title="receiptDetail.receiptName" :visible.sync="dialogVisible">
      <span class="text-bold">{{ receiptDetail.code }}</span> <br>
      <span class="time">{{ receiptDetail.date }}</span>
      <div class="event-item">
        <el-timeline class="receipt-detail-card">
          <div class="event-title d-flex justify-between items-center cursor-pointer">
            <div class="d-flex gap-5 items-center event-name">
              <div class="event-content">
                <h4 class="title text-bold">{{ user.name }}</h4>
              </div>
            </div>
            <div class="d-flex items-center ">
              <span class="text-bold" :class="user.totalAmount >= 0 ? 'text-green' : 'text-red'">{{user.totalAmountFormat}}</span>
            </div>
          </div>
          <el-card class="mb-10" v-for="(user, key) in receiptDetail.users" :key="key" placement="top">
            <div class="d-flex justify-between">
              <div class="d-flex gap-10 items-center">
                <div>
                  <ShowAvatarElement :event="{ name: user.name }"></ShowAvatarElement>
                </div>
                <div>
                  <span class="text-bold">{{ user.name }}</span><br>
                  <span class="time">{{ user.phone }}</span>
                </div>
              </div>
              <span class="text-normal-sm"> </span><span :class="user.totalAmount >= 0 ? 'text-green' : 'text-red'">{{user.totalAmountFormat}}</span>
            </div>
          </el-card>
          <el-divider class="divider"></el-divider>
          <div>
            <div class="list-image d-flex gap-10 pb-10">
              <el-image :src="user.imageLink" :preview-src-list='user.imgLink' class="image"/>
            </div>
          </div>
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
  PAID_ACCEPT,
  PAID_WAITING,
  INDEX_SET_LOADING,
  INDEX_SET_SUCCESS,
  DEBT_GET_DETAIL,
  INDEX_SET_ERROR
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
        const response = await this.$store.dispatch(PAID_WAITING, this.id)
        const { data, statusCode } = response
        if (statusCode === 202) {
          this.listEvent = data
          this.listEvent.forEach((element) => {
            this.listRequestId.push(element.paidDebtId)
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
    async eventAppoveSelect(status) {
      this.$store.commit(INDEX_SET_LOADING, true)
      try {
        const response = await this.$store.dispatch(PAID_ACCEPT, {
          ListId: this.listChecked,
          status
        })
        if (response.statusCode === 202) {
          await this.$store.commit(INDEX_SET_SUCCESS, {
            show: true,
            text: response.data
          })
          this.getListEvent()
        } else if (response.statusCode === 406) {
          await this.$store.commit(INDEX_SET_SUCCESS, {
            show: true,
            text: response.data
          })
          this.getListEvent()
        } else {
          await this.$store.commit(INDEX_SET_ERROR, {
            show: true,
            text: response.data
          })
        }
      } catch (e) {
        await this.$store.commit(INDEX_SET_ERROR, {
          show: true,
          text: 'Có lỗi xảy ra'
        })
        this.$store.commit(INDEX_SET_LOADING, false)
      }
      this.$store.commit(INDEX_SET_LOADING, false)
    },
    async getReceiptDetail(id) {
      this.$store.commit(INDEX_SET_LOADING, true)
      try {
        const response = await this.$store.dispatch(DEBT_GET_DETAIL, id)
        if (response.statusCode === 202) {
          this.receiptDetail = response.data
          this.user = response.data.users
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
        this.eventAppoveSelect(status)
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
