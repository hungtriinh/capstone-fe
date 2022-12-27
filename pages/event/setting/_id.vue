<template>
  <div class="main-login setting-page">
    <div>
      <div class="login login-width login-mobile">
        <el-page-header class="header-receipt" content="Cài đặt sự kiện" @back="handleRouter('/event/detail/' + id)">
        </el-page-header>
        <div class="main-content">
<!--          <el-avatar class="avatar" :size="100" :src="circleUrl"></el-avatar>-->
          <div class="main-setting-avatar d-flex justify-center">
            <ShowAvatarElement :event="{ name: listEvent.EventName, color: listEvent.color }"></ShowAvatarElement>
          </div>

          <el-form
            ref="accountForm"
            :model="accountForm"
            :rules="accountRules"
            autocomplete="off"
            label-position="left"
            @submit.native.prevent
          >
            <div v-if="!editName" class="title text-center">
              <span class="text-bold">{{ listEvent.EventName }} </span>
              <i v-if="eventStatus !== 0" class="el-icon el-icon-edit font-lg" @click="changeName"></i>
            </div>
            <div v-else class="">
              <div class="d-flex items-center justify-center gap-5">
                <el-form-item class="event-edit" prop="EventName" :error="(error.key === 'EventName') ? error.value : ''">
                  <el-input
                    id="EventName"
                    ref="EventName"
                    v-model="accountForm.EventName"
                    class="event-name-edit"
                    :placeholder="$t('event.eventName')"
                    autocomplete="off"
                    name="EventName"
                    type="text"
                    tabindex="2"
                    @blur="editEvent"
                    @focus="resetValidate('EventName')"
                  >
                    <i v-if="eventStatus !== 0" slot="suffix" class="el-icon el-icon-edit el-input__icon font-lg" @click="changeName"></i>
                  </el-input>
                </el-form-item>
              </div>
            </div>
            <div class="title">
              <div class="d-flex items-center  gap-5">
                <el-form-item class="event-des-edit event-des" prop="EventDescript" :error="(error.key === 'EventDescript') ? error.value : ''">
                  <el-input
                    id="EventDescript"
                    ref="EventDescript"
                    v-model="accountForm.EventDescript"
                    class="event-edit"
                    :readonly="!editDes"
                    :placeholder="$t('event.eventDescript')"
                    type="textarea"
                    autocomplete="off"
                    name="EventDescript"
                    :autosize="{ minRows: 3, maxRows: 12}"
                    tabindex="2"
                    @blur="changeDes"
                    @focus="resetValidate('EventDescript')"
                  />
                  <i v-if="eventStatus !== 0" :class="editDes ? 'edit-des' : ''" class="el-icon el-icon-edit el-icon-edit-des font-lg" @click="editDes = !editDes"></i>
                </el-form-item>
              </div>
            </div>
          </el-form>

          <!-- owner role 1-->
          <div v-if="listEvent.Role === 1">
            <el-divider class="divider-setting"></el-divider>
            <div class="item-setting d-flex cursor-pointer items-center justify-between" @click="handleRouter('/event/list-member/' + id)">
              <span class="text-bold">Xem thành viên nhóm ({{listEvent.TotalMembers}} người) </span>
              <i class="el-icon el-icon-arrow-right "></i>
            </div>
            <el-divider class="divider-setting"></el-divider>
            <div class="item-setting d-flex cursor-pointer items-center justify-between" @click="handleRouter('/event/join-request/' + id)">
              <span class="text-bold">Yêu cầu tham gia chờ duyệt ({{listEvent.JoinRequest}})</span>
              <i class="el-icon el-icon-arrow-right "></i>
            </div>
            <el-divider class="divider-setting"></el-divider>
            <el-divider class="divider-setting"></el-divider>
            <div class="item-setting d-flex cursor-pointer items-center justify-between" @click="handleRouter('/event/receipt-waiting/' + id)">
              <span class="text-bold">Chứng từ chờ duyệt ({{listEvent.ReceiptsSent}})</span>
              <i class="el-icon el-icon-arrow-right "></i>
            </div>
            <el-divider class="divider-setting"></el-divider>
            <div class="item-setting d-flex cursor-pointer items-center justify-between" @click="handleRouter('/event/paid-request/' + id)">
              <span class="text-bold">Yêu cầu trả tiền chờ duyệt ({{listEvent.PaidDebtRequestSent}})</span>
              <i class="el-icon el-icon-arrow-right "></i>
            </div>
            <el-divider class="divider-setting"></el-divider>
            <div class="item-setting d-flex cursor-pointer items-center justify-between" @click="handleRouter('/event/list-report/' + id)">
              <span class="text-bold">Báo cáo chờ duyệt ({{listEvent.ReportWaiting}})</span>
              <i class="el-icon el-icon-arrow-right "></i>
            </div>
            <el-divider class="divider-setting"></el-divider>
            <div v-if="eventStatus !== 0" @click="openConfirmDialog" class="item-setting d-flex cursor-pointer items-center justify-between">
              <span style="color: #e73434" class="text-bold   ">Đóng event</span>
              <img class="logout-icon" src="@/assets/images/icons/logout.svg"/>
            </div>
            <el-divider v-if="eventStatus !== 0" class="divider-setting"></el-divider>
          </div>
          <!-- role = 2 inspector-->
          <div v-else-if="listEvent.Role === 2">
            <el-divider class="divider-setting"></el-divider>
            <div class="item-setting d-flex cursor-pointer items-center justify-between" @click="handleRouter('/event/list-member/' + id)">
              <span class="text-bold">Xem thành viên nhóm ({{listEvent.TotalMembers}} người) </span>
              <i class="el-icon el-icon-arrow-right "></i>
            </div>
            <el-divider class="divider-setting"></el-divider>
            <div class="item-setting d-flex cursor-pointer items-center justify-between" @click="handleRouter('/event/receipt-waiting/' + id)">
              <span class="text-bold">Chứng từ chờ duyệt ({{listEvent.ReceiptsWaiting}})</span>
              <i class="el-icon el-icon-arrow-right "></i>
            </div>
            <el-divider class="divider-setting"></el-divider>
            <div class="item-setting d-flex cursor-pointer items-center justify-between" @click="handleRouter('/event/receipt-sent/' + id)">
              <span class="text-bold">Chứng từ đã gửi</span>
              <i class="el-icon el-icon-arrow-right "></i>
            </div>
            <el-divider class="divider-setting"></el-divider>
            <div class="item-setting d-flex cursor-pointer items-center justify-between" @click="handleRouter('/event/paid-sent/' + id)">
              <span class="text-bold">Yêu cầu trả tiền đã gửi</span>
              <i class="el-icon el-icon-arrow-right "></i>
            </div>
            <el-divider class="divider-setting"></el-divider>
            <div class="item-setting d-flex cursor-pointer items-center justify-between" @click="handleRouter('/event/list-report-history/' + id)">
              <span class="text-bold">Báo cáo đã gửi</span>
              <i class="el-icon el-icon-arrow-right "></i>
            </div>
            <el-divider class="divider-setting"></el-divider>
            <div @click="openConfirmDialog" class="item-setting d-flex cursor-pointer items-center justify-between">
              <span style="color: #e73434" class="text-bold">Rời khỏi nhóm</span>
              <img class="logout-icon" src="@/assets/images/icons/logout.svg"/>
            </div>
            <el-divider class="divider-setting"></el-divider>
          </div>
          <!-- role = 3 cashier-->

          <div v-else-if="listEvent.Role === 3">
            <el-divider class="divider-setting"></el-divider>
            <div class="item-setting d-flex cursor-pointer items-center justify-between" @click="handleRouter('/event/list-member/' + id)">
              <span class="text-bold">Xem thành viên nhóm ({{listEvent.TotalMembers}} người) </span>
              <i class="el-icon el-icon-arrow-right "></i>
            </div>
            <el-divider class="divider-setting"></el-divider>
            <div class="item-setting d-flex cursor-pointer items-center justify-between" @click="handleRouter('/event/paid-request/' + id)">
              <span class="text-bold">Yêu cầu trả tiền chờ duyệt ({{listEvent.PaidRequestNumber}})</span>
              <i class="el-icon el-icon-arrow-right "></i>
            </div>
            <el-divider class="divider-setting"></el-divider>
            <div class="item-setting d-flex cursor-pointer items-center justify-between" @click="handleRouter('/event/receipt-sent/' + id)">
              <span class="text-bold">Chứng từ đã gửi</span>
              <i class="el-icon el-icon-arrow-right "></i>
            </div>
            <el-divider class="divider-setting"></el-divider>
            <div class="item-setting d-flex cursor-pointer items-center justify-between" @click="handleRouter('/event/paid-sent/' + id)">
              <span class="text-bold">Yêu cầu trả tiền đã gửi</span>
              <i class="el-icon el-icon-arrow-right "></i>
            </div>
            <el-divider class="divider-setting"></el-divider>
            <div class="item-setting d-flex cursor-pointer items-center justify-between" @click="handleRouter('/event/list-report-history/' + id)">
              <span class="text-bold">Báo cáo đã gửi</span>
              <i class="el-icon el-icon-arrow-right "></i>
            </div>
            <el-divider class="divider-setting"></el-divider>
            <div @click="openConfirmDialog" class="item-setting d-flex cursor-pointer items-center justify-between">
              <span style="color: #e73434" class="text-bold">Rời khỏi nhóm</span>
              <img class="logout-icon" src="@/assets/images/icons/logout.svg"/>
            </div>
            <el-divider class="divider-setting"></el-divider>
          </div>
          <!-- role = 0 member-->

          <div v-else>
            <el-divider class="divider-setting"></el-divider>
            <div class="item-setting d-flex cursor-pointer items-center justify-between" @click="handleRouter('/event/list-member/' + id)">
              <span class="text-bold">Xem thành viên nhóm ({{listEvent.TotalMembers}} người) </span>
              <i class="el-icon el-icon-arrow-right "></i>
            </div>
            <el-divider class="divider-setting"></el-divider>
            <div class="item-setting d-flex cursor-pointer items-center justify-between" @click="handleRouter('/event/receipt-sent/' + id)">
              <span class="text-bold">Chứng từ đã gửi</span>
              <i class="el-icon el-icon-arrow-right "></i>
            </div>
            <el-divider class="divider-setting"></el-divider>
            <div class="item-setting d-flex cursor-pointer items-center justify-between" @click="handleRouter('/event/paid-sent/' + id)">
              <span class="text-bold">Yêu cầu trả tiền đã gửi</span>
              <i class="el-icon el-icon-arrow-right "></i>
            </div>
            <el-divider class="divider-setting"></el-divider>
            <div class="item-setting d-flex cursor-pointer items-center justify-between" @click="handleRouter('/event/list-report-history/' + id)">
              <span class="text-bold">Báo cáo đã gửi</span>
              <i class="el-icon el-icon-arrow-right "></i>
            </div>
            <el-divider class="divider-setting"></el-divider>
            <div @click="openConfirmDialog" class="item-setting d-flex cursor-pointer items-center justify-between">
              <span style="color: #e73434" class="text-bold">Rời khỏi nhóm</span>
              <img class="logout-icon" src="@/assets/images/icons/logout.svg"/>
            </div>
            <el-divider class="divider-setting"></el-divider>
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
  EVENT_EDIT,
  EVENT_CLOSE,
  GET_EVENT_DETAIL,
  INDEX_SET_LOADING,
  INDEX_SET_SUCCESS,
  INDEX_SET_ERROR, EVENT_CHECK_STATUS
} from '~/store/store.const'

export default {
  name: 'SettingPage',
  // middleware: 'auth',
  components: {
    // ShowAvatarElement
  },
  data() {
    return {
      id: this.$route.params.id,
      eventStatus: '',
      search: '',
      listEvent: {},
      circleUrl: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
      editName: false,
      editDes: false,
      accountForm: {
        EventLogo: '',
        EventName: '',
        EventDescript: '',
        TotalMembers: '',
        ReceiptsWaiting: '',
        errors: {}
      },
      error: {
        key: null,
        value: ''
      },
      accountRules: {
        EventName: [
          {
            required: true,
            message: this.$t('validation.required', { _field_: this.$t('event.eventName') }),
            trigger: 'blur'
          }
        ]
      }
    }
  },
  watch: {
    listEvent(newValue, oldValue) {
      for (const item in this.listEvent) {
        this.accountForm[item] = this.listEvent[item]
      }
    },
    editDes() {
      if (this.editDes) {
        this.$refs.EventDescript.focus()
      }
    },
    'accountForm.EventDescript'() {
      if (this.accountForm.EventDescript === '' || this.accountForm.EventDescript.trim() === '') {
        this.editEvent()
      }
    }
  },
  async created() {
    await this.getListEvent()
    await this.getEventStatus()
  },
  mounted() {
  },
  methods: {
    resetValidate(ref) {
      if (ref === this.error.key) {
        this.error = { key: null, value: '' }
      }
      this.$refs.accountForm.fields.find((f) => f.prop === ref).clearValidate()
      this.accountForm.errors[ref] = ''
    },
    async getListEvent() {
      this.$store.commit(INDEX_SET_LOADING, true)
      try {
        const response = await this.$store.dispatch(GET_EVENT_DETAIL, this.id)
        const { data, statusCode } = response
        if (statusCode === 202) {
          this.listEvent = data
          this.$cookies.set('getRole', response.data.Role)
        }
      } catch (e) {
        this.$store.commit(INDEX_SET_LOADING, false)
      }
      this.$store.commit(INDEX_SET_LOADING, false)
    },
    async getEventStatus() {
      this.$store.commit(INDEX_SET_LOADING, true)
      try {
        const response = await this.$store.dispatch(EVENT_CHECK_STATUS, this.id)
        const { data, statusCode } = response
        if (statusCode === 202) {
          this.eventStatus = data.EventStatus
        }
      } catch (e) {
        this.$store.commit(INDEX_SET_LOADING, false)
      }
      this.$store.commit(INDEX_SET_LOADING, false)
    },
    handleRouter(router) {
      this.$router.push(router)
    },
    changeName() {
      this.editName = !this.editName
    },
    async closeEvent() {
      this.$store.commit(INDEX_SET_LOADING, true)
      try {
        const response = await this.$store.dispatch(EVENT_CLOSE, this.id)
        if (response.statusCode === 202) {
          this.$store.commit(INDEX_SET_SUCCESS, {
            show: true,
            text: response.data
          })
          this.handleRouter('/event')
        } else if (response.statusCode === 406) {
          this.$store.commit(INDEX_SET_SUCCESS, {
            show: true,
            text: response.data
          })
          this.handleRouter('/event')
        } else {
          this.$store.commit(INDEX_SET_ERROR, {
            show: true,
            text: response.data
          })
        }
      } catch (e) {
        this.$store.commit(INDEX_SET_LOADING, false)
      }
      this.$store.commit(INDEX_SET_LOADING, false)
    },
    changeDes() {
      if (this.accountForm.EventDescript) {
        this.editDes = false
        this.editEvent()
      }
    },
    async editEvent() {
      this.validateForm()
      if (!this.isValid) {
        return
      }
      try {
        const dto = this.accountForm
        dto.EventId = this.id
        const response = await this.$store.dispatch(EVENT_EDIT, {
          ...dto
        })
        if (response.statusCode === 202) {
          // await this.$store.commit(INDEX_SET_SUCCESS, {
          //   show: true,
          //   text: response.message
          // })
          await this.getListEvent()
          this.editName = false
          this.editDes = false
        }
      } catch (e) {
      }
    },
    validateForm() {
      this.$refs.accountForm.validate(valid => {
        this.isValid = valid
      })
    },
    openConfirmDialog() {
      this.$confirm('Bạn có muốn đóng event này không?', 'Xác nhận', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        this.closeEvent()
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
