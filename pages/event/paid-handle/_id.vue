<template>
  <div class="main-login list-receipt-page">
    <div>
      <div class="login login-width login-mobile">
        <el-page-header content="Lịch sử Yêu cầu trả tiền đã duyệt" @back="goBack">
        </el-page-header>
        <el-empty v-if="!listEvent.length" description="Không có chứng từ nào"></el-empty>
        <div v-else>
          <div class="main-content">
            <el-card v-for="(item, key) in listEvent" :key="key" :body-style="{ padding: '10px' }" class="card-item">
              <div class="d-flex justify-between">
                <div class="list-image d-flex gap-10">
                  <el-image v-if="!item.imageLink" class="image" :preview-src-list="['https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png']" :src="'https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png'"/>
                  <el-image v-else :key="key" :src="item.imageLink" :preview-src-list="[ item.imageLink ]" class="image"/>
                </div>
                <div class="list-image d-flex gap-10">
                </div>
                <!--                <span class="text-bold money">{{ item.receiptAmount }}<i class="el-icon el-icon-arrow-right"></i></span>-->
                <span class="text-bold d-flex money" @click="openDetailDialog(item.paidDebtId)">Chi tiết<i class="el-icon el-icon-arrow-right"></i></span>
              </div>
              <div class="">
                <div class="flex-between">
                  <div class="avatar-name d-flex items-center mt-10 gap-5">
                    <ShowAvatarElement :event="{ name: item.user.name, color: item.color }"></ShowAvatarElement>
                    <span>{{ item.user.name }}</span>
                  </div>
                </div>
                <div class="bottom">
                  <div>
                    <time class="time">{{ item.date }}</time>
                    <br>
                    <div><span class="text-bold">{{ item.code }}</span><span v-if="item.code">:</span> <span class="text-bold money">{{ item.totalMoneyFormat }}</span></div>

                  </div>
                  <div>
                    <el-tag v-show="item.type" effect="dark" type="info">{{ item.type }}</el-tag>
                                        <el-tag v-if="item.status === 2" effect="dark" type="success">Đồng ý</el-tag>
                                        <el-tag v-else-if="item.status === 3" effect="dark" type="danger">Từ chối</el-tag>
<!--                                        <el-tag v-else-if="item.receiptStatus === 1" type="warning">Đang chờ</el-tag>-->
<!--                                        <el-tag v-else effect="dark" type="">Trả hết</el-tag>-->
                  </div>
                </div>
              </div>
            </el-card>
          </div>
        </div>
      </div>
    </div>
    <el-dialog class="receipt-detail-dialog" :title="receiptDetail.receiptName" :visible.sync="dialogVisible">
      <span class="text-bold">{{ receiptDetail.code }}</span> <br>
      <span class="time">{{ receiptDetail.date }}</span>
      <div class="event-item">
        <el-timeline class="receipt-detail-card">
          <div class="event-title d-flex flex-wrap justify-between items-center cursor-pointer">
            <div class="d-flex gap-10 items-center">
              <div>
                <ShowAvatarElement :event="{ name: user.name }"></ShowAvatarElement>
              </div>
              <div>
                <span class="text-bold">{{ user.name }}</span><br>
                <span class="time">{{ user.phone }}</span>
              </div>
            </div>
            <div class="d-flex items-center ">
              <span class="text-bold" :class="user.totalAmount >= 0 ? 'text-green' : 'text-red'">{{user.totalAmountFormat}}</span>
            </div>
          </div>
          <el-timeline-item placement="top">
            <el-card class="mb-10" v-for="(user, key) in receiptDetail.users" :key="key" placement="top">
              <div class="d-flex flex-wrap justify-between">
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
          </el-timeline-item>
          <el-divider class="divider"></el-divider>
          <div>
            <div class="list-image d-flex gap-10 pb-10">
              <el-image :src="receiptDetail.imgLink" :preview-src-list="[receiptDetail.imgLink]" class="image img-100"/>
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
  REQUEST_APPROVE,
  GET_PAID_HANDLE,
  INDEX_SET_LOADING,
  INDEX_SET_SUCCESS, DEBT_GET_DETAIL
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
      receiptDetail: {},
      user: {},
      dialogVisible: false,
      ListId: []
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
        const response = await this.$store.dispatch(GET_PAID_HANDLE, this.id)
        const { data, statusCode } = response
        if (statusCode === 202) {
          this.listEvent = data
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
      this.checkAll = checkedCount === this.listFriend.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.listFriend.length
    },
    handleCheckAllChange(val) {
      this.checkedFriends = val ? this.listId : []
      this.isIndeterminate = false
    },
    goBack() {
      this.handleRouter('/event/paid-request/' + this.id)
    },
    async eventAppove(id, status) {
      this.$store.commit(INDEX_SET_LOADING, true)
      try {
        this.ListId.push(id)
        const response = await this.$store.dispatch(REQUEST_APPROVE, {
          ListId: this.ListId,
          status
        })
        const { data, statusCode } = response
        if (statusCode === 202) {
          await this.$store.commit(INDEX_SET_SUCCESS, {
            show: true,
            text: data.message
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
        const response = await this.$store.dispatch(DEBT_GET_DETAIL, id)
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
    }

  }
}
</script>
