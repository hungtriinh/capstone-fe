<template>
  <div class="main-login list-receipt-page">
    <div>
      <div class="login login-width login-mobile">

        <div class="d-flex justify-between">
          <el-page-header content="Chứng từ chờ duyệt" @back="goBack">
          </el-page-header>
          <el-tooltip class="item" effect="dark" content="History" placement="bottom">
            <i @click="handleRouter('/event/list-receipt/' + id)" class="el-icon el-icon-time" ></i>
          </el-tooltip>
        </div>
        <el-empty v-if="!listEvent.length" description="Không có chứng từ nào"></el-empty>
        <div v-else>
          <div class="main-content">
            <el-checkbox-group v-model="listChecked" class="checkbox-group cb-group-hide-label" @change="handleCheckedCitiesChange">

              <div v-for="(item, key) in listEvent" :key="key" class="d-flex items-center gap-10">
                <el-checkbox class="cb-hide-label" :label="item.receiptId" :value="item.receiptId"></el-checkbox>
                <el-card :body-style="{ padding: '10px' }" class="card-item">
                <div class="d-flex justify-between">
                <div class="list-image d-flex gap-10 flex-wrap">
                  <el-image v-show="!item.imageLinks.length" class="image" :preview-src-list="['https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png']" :src="'https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png'"/>
                  <el-image v-for="(img, key) in item.imageLinks" :key="key" :src="img" :preview-src-list="item.imageLinks" class="image"/>
                </div>
                <!--                <span class="text-bold money">{{ item.receiptAmount }}<i class="el-icon el-icon-arrow-right"></i></span>-->
                <span @click="openDetailDialog(item.receiptId)" class="text-bold d-flex money">{{ item.receiptAmountFormat }}<i class="el-icon el-icon-arrow-right"></i></span>
              </div>
              <div class="">
                <div class="flex-between">
                  <div class="avatar-name d-flex items-center mt-10 gap-5">
                    <el-badge is-dot class="event-status item" :type="item.user.role === 4 ?  'danger' : 'success'">
                      <div v-if="item.user.avatar">
                        <el-image class="image-avatar" :preview-src-list="[item.user.avatar]" :src="item.user.avatar"/>
                      </div>
                      <div v-else>

                        <ShowAvatarElement :event="{ name: item.user.name }"></ShowAvatarElement>
                      </div>
                    </el-badge>
                    <div>
                      <span>{{ item.user.name }}</span> <br>
                      <p class="time">{{ item.user.phone}}</p>
                    </div>
                  </div>
                </div>
                <div class="bottom">
                  <div>
                    <time class="time">{{ item.date }}</time>
                    <br>
                    <!--                    <div><span class="text-bold">{{ item.receiptName }}</span>: <span class="text-bold money">{{ item.receiptAmount }}</span></div>-->
                    <div><span class="text-bold">{{ item.receiptName }}</span></div>

                  </div>
                  <el-tag effect="dark" v-if="item.receiptStatus === 2" type="success">Đồng ý</el-tag>
                  <el-tag effect="dark" v-else-if="item.receiptStatus === 3" type="danger">Từ chối</el-tag>
                  <el-tag effect="dark" v-else-if="item.receiptStatus === 1" type="warning">Đang chờ</el-tag>
                  <el-tag effect="dark" v-else type="">Trả hết</el-tag>
                </div>
              </div>
            </el-card>
              </div>
            </el-checkbox-group>
            <el-checkbox class="check-all mt-10" v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange"><span class="text-bold">{{ $t('event.check_all')}}</span></el-checkbox>
            <div class="btn-group justify-center d-flex items-center">
              <el-button type="danger" icon="el-icon-delete" @click="openConfirmDialog(3)">Từ chối</el-button>
              <el-button type="success" icon="el-icon-check" @click="openConfirmDialog(2)">Đồng ý</el-button>
            </div>
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
              <el-badge is-dot class="event-status item" :type="user.role === 4 ?  'danger' : 'success'">
                <div v-if="user.avatar">
                  <el-image class="image-avatar" :preview-src-list="[user.avatar]" :src="user.avatar"/>
                </div>
                <div v-else>

                  <ShowAvatarElement :event="{ name: user.name }"></ShowAvatarElement>
                </div>
              </el-badge>
              <div class="event-content">
                <h4 class="title text-bold">{{ user.name }}</h4>
                <span class="time">{{ user.phone}}</span>
              </div>
            </div>
            <div class="d-flex items-center ">
              <span class="text-bold" :class="user.totalAmount >= 0 ? 'text-green' : 'text-red'">{{user.totalAmountFormat}}</span>
            </div>
          </div>
          <el-timeline-item v-for="(user, key) in receiptDetail.userDepts" :key="key" placement="top">
            <el-card>
              <div class="d-flex justify-between flex-wrap">
<!--                <span class="text-normal-sm">{{ user.name }}</span>-->
                <div class="d-flex gap-5 items-center event-name">
                  <el-badge is-dot class="event-status item" :type="user.role === 4 ?  'danger' : 'success'">
                    <div v-if="user.avatar">
                      <el-image class="image-avatar" :preview-src-list="[user.avatar]" :src="user.avatar"/>
                    </div>
                    <div v-else>

                      <ShowAvatarElement :event="{ name: user.name }"></ShowAvatarElement>
                    </div>
                  </el-badge>
                  <div class="event-content">
                    <h4 class="title text-bold">{{ user.name }}</h4>
                    <span class="time">{{ user.phone}}</span>
                  </div>
                </div>
                <span class="text-normal-sm"> </span><span :class="user.totalAmount >= 0 ? 'text-green' : 'text-red'">{{user.totalAmountFormat}}</span>
              </div>
            </el-card>
          </el-timeline-item>
          <el-divider class="divider"></el-divider>
        </el-timeline>
        <div>
          <div style="padding-bottom: 30px" class="list-image d-flex gap-10 flex-wrap">
            <el-image v-for="(img, key) in receiptDetail.imgLink" :key="key" :src="img" :preview-src-list="receiptDetail.imgLink" class="image"/>
          </div>
        </div>
      </div>

    </el-dialog>
  </div>
</template>
<script>
import {
  RECEIPT_ACCEPT,
  RECEIPT_WAITING,
  INDEX_SET_LOADING,
  INDEX_SET_SUCCESS,
  RECEIPT_DETAIL,
  INDEX_SET_ERROR
} from '~/store/store.const'

export default {
  name: 'ListReceiptPage',
  middleware: 'auth',
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
        const response = await this.$store.dispatch(RECEIPT_WAITING, this.id)
        const { data, statusCode } = response
        if (statusCode === 202) {
          this.listEvent = data
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
    async eventAppoveSelect(status) {
      this.$store.commit(INDEX_SET_LOADING, true)
      try {
        const response = await this.$store.dispatch(RECEIPT_ACCEPT, {
          ListId: this.listChecked,
          status
        })
        if (response.statusCode === 202) {
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
