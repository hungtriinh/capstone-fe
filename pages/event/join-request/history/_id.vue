<template>
  <div class="main-login setting-page">
    <div>
      <div class="login login-width login-mobile">
        <div class="d-flex justify-between">
          <el-page-header content="Lịch sử Yêu cầu tham gia" @back="goBack">
          </el-page-header>
        </div>

        <el-empty v-if="!listEvent.length" description="Không có yêu cầu tham gia nào"></el-empty>
        <div v-else>
          <div class="main-content">
            <el-checkbox-group v-model="listChecked" class="checkbox-group" @change="handleCheckedCitiesChange">

              <el-card v-for="(item, key) in listEvent" :key="key" shadow="hover" :body-style="{ padding: '2px 10px' }" class="card-item">
                <div class="">
                  <div style="padding-bottom: 12px;" class="flex-between">
                    <div class="d-flex items-center mt-10 gap-10">
                      <ShowAvatarElement :event="{ name: item.userName, color: item.color }"></ShowAvatarElement>
                      <div>
                        <span class="text-bold">{{ item.userName }}</span>
                        <br><span class="time">{{ item.phone }}</span>
                      </div>
                    </div>
                    <el-tag v-if="item.status === 4" type="success">Đồng ý</el-tag>
                    <el-tag v-else type="danger">Từ chối</el-tag>
                  </div>
                </div>
              </el-card>
            </el-checkbox-group>
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
import { REQUEST_APPROVE, GET_REQUEST_HISTORY, INDEX_SET_LOADING, INDEX_SET_SUCCESS } from '~/store/store.const'

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
      listEvent: {},
      listChecked: [],
      checkAll: false,
      isIndeterminate: true,
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
        const response = await this.$store.dispatch(GET_REQUEST_HISTORY, this.id)
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
        }
      } catch (e) {
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
