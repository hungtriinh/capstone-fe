<template>
  <div class="main-login setting-page">
    <div>
      <div class="login login-width login-mobile">
        <div class="d-flex justify-between">
          <el-page-header content="Yêu cầu tham gia chờ duyệt" @back="goBack">
          </el-page-header>
          <el-tooltip class="item" effect="dark" content="History" placement="bottom">
            <i @click="handleRouter('history/' + id)" class="el-icon el-icon-time" ></i>
          </el-tooltip>
        </div>

        <el-empty v-if="!listEvent.length" description="Không có yêu cầu tham gia nào"></el-empty>
        <div v-else>
          <div class="main-content">
            <el-checkbox-group v-model="listChecked" class="checkbox-group" @change="handleCheckedCitiesChange">

              <el-card v-for="(item, key) in listEvent" :key="key" :body-style="{ padding: '2px 10px' }" class="card-item">
                <div class="card-box">
                  <el-checkbox class="cb-hide-label" :label="item.requestId" :value="item.requestId"></el-checkbox>
                  <div style="padding-bottom: 12px;">
                    <div class="d-flex items-center mt-10 gap-10">
                      <ShowAvatarElement :event="{ name: item.userName, color: item.color }"></ShowAvatarElement>
                      <div>
                        <span class="text-bold">{{ item.userName }}</span>
                        <br><span class="time">{{ item.phone }}</span>
                      </div>
                    </div>
                  </div>
                  <div class="bottom d-flex items-center">
                    <el-button type="success" icon="el-icon-check" circle @click="openConfirmDialog(4, item.requestId)"></el-button>
                    <el-button type="danger" icon="el-icon-delete" circle @click="openConfirmDialog(5, item.requestId)"></el-button>
                  </div>
                </div>
              </el-card>
            </el-checkbox-group>
            <el-checkbox class="check-all" v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange"><span class="text-bold">{{ $t('event.check_all')}}</span></el-checkbox>
            <div class="btn-group justify-center bottom d-flex items-center">
              <el-button type="danger" icon="el-icon-delete" @click="openConfirmDialog(5)">Từ chối</el-button>
              <el-button type="success" icon="el-icon-check" @click="openConfirmDialog(4)">Đồng ý</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// import { AUTH_REGISTER, INDEX_SET_ERROR, INDEX_SET_LOADING, INDEX_SET_SUCCESS, SET_EMAIL } from '@/store/store.const'
// import { TYPE_REGISTER_OTP } from '@/store/store.const.js'
// import { validPhoneNoPrefix } from '@/utils/validate'
import {
  REQUEST_APPROVE,
  GET_REQUEST_WAITING,
  INDEX_SET_LOADING,
  INDEX_SET_SUCCESS,
  INDEX_SET_ERROR
} from '~/store/store.const'

export default {
  name: 'RequestPage',
  // middleware: 'auth',
  components: {
    // ShowAvatarElement
  },
  data() {
    return {
      id: this.$route.params.id,
      search: '',
      listEvent: [],
      listChecked: [],
      checkAll: false,
      isIndeterminate: false,
      listRequestId: [],
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
    async getListEvent() {
      this.$store.commit(INDEX_SET_LOADING, true)
      try {
        const response = await this.$store.dispatch(GET_REQUEST_WAITING, this.id)
        const { data, statusCode } = response
        if (statusCode === 202) {
          this.listEvent = data
          this.listEvent.forEach((element) => {
            this.listRequestId.push(element.requestId)
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
    async eventAppove(status, id) {
      this.$store.commit(INDEX_SET_LOADING, true)
      try {
        this.ListId.push(id)
        const response = await this.$store.dispatch(REQUEST_APPROVE, {
          ListId: this.ListId,
          status
        })
        if (response.statusCode === 202) {
          await this.$store.commit(INDEX_SET_SUCCESS, {
            show: true,
            text: response.message
          })
          this.getListEvent()
        }
      } catch (e) {
        this.$store.commit(INDEX_SET_LOADING, false)
      }
      this.$store.commit(INDEX_SET_LOADING, false)
    },
    async eventAppoveSelect(status) {
      this.$store.commit(INDEX_SET_LOADING, true)
      try {
        const response = await this.$store.dispatch(REQUEST_APPROVE, {
          ListId: this.listChecked,
          status
        })
        if (response.statusCode === 202) {
          await this.$store.commit(INDEX_SET_SUCCESS, {
            show: true,
            text: response.message
          })
          this.getListEvent()
        } else if (response.statusCode === 406) {
          await this.$store.commit(INDEX_SET_SUCCESS, {
            show: true,
            text: response.message
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
    openConfirmDialog(status, id) {
      this.$confirm('Bạn có chắc chắn thực hiện thao tác này?', 'Xác nhận', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        if (id) {
          this.eventAppove(status, id)
        } else {
          this.eventAppoveSelect(status)
        }
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
