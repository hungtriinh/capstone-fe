<template>
  <div class="main-login paid-debt">
    <div>
      <div class="login login-width login-mobile">
        <el-page-header content="Trả nợ" @back="handleRouter('/event/detail/' + id)">
        </el-page-header>
        <div class="main-content">
          <div v-if="step===1">
            <el-card class="text-bold mb-10">
              <div class="btn-group d-flex  ">
                <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange">{{ $t('event.check_all')}}</el-checkbox>
              </div>
              <div class="mt-10">
                <el-checkbox-group  v-model="checkedDebt" class="checkbox-group cb-group-hide-label" @change="handleCheckedCitiesChange">
                    <div v-for="(item, key) in listDebt" :key="key">
                      <div class="checkbox-item-debt cb-hide-label items-center">
                        <el-checkbox :label="item.userDeptId" :value="item.userDeptId" @change="changeCheck(item)"></el-checkbox>
                        <div :class="item.status === 4 ? 'text-yellow' : ''">
                          <div class="d-flex gap-5">
                            <el-tooltip class="item" effect="dark" content="Đang bị report" placement="bottom">
                              <img v-if="item.status === 4" style="width: 20px" src="~/assets/images/icons/warning.svg" alt="">
                            </el-tooltip>
                            <div>
                              <span class="text-bold">{{ item.receiptName }}</span><br>
                              <span :class="item.status === 4 ? 'text-yellow' : ''" class="time">{{ item.date }}</span><br>
                            </div></div>
                        </div>
                        <div :class="item.status === 4 ? 'text-yellow' : ''" class="text-bold">{{ item.formatSlider }} ₫ </div>

                      </div>
                      <div class="block" style="margin-bottom: 20px">
                        <el-slider v-model="item.debtLeft" show-input :step="1" :disabled="!item.check" :min="0" :max="item.maxSlider"></el-slider>
                      </div>
                    </div>
                </el-checkbox-group>
              </div>
            </el-card>
            <el-card class=" text-bold">
              <div class="text-bold text-blue">
                <span class="">{{ $t('debt.total') }}: </span><span>{{ formatTotalPaid }} </span><span> ₫</span>
              </div>
              <div class="mt-10">
                <span class="text-bold text-red">{{ $t('debt.remainder') }}: </span><span class="text-bold text-red">{{formatRemainder ? formatRemainder : '0'}}</span><span class="text-bold text-red"> ₫</span>
              </div>
            </el-card>
            <div class="btn-group text-center">
              <el-button type="primary" @click="handleStep">{{ $t('debt.pay') }}</el-button>
            </div>
          </div>
          <div v-if="step === 2" class="">
            <div class="text-center">
              <el-select v-model="value" class="paid-debt-select mt-10" placeholder="Chọn hình thức thanh toán">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
            <div v-if="value === '1'" class="pay-method">
              <el-card class="total-money text-center">
                <span class="text-bold text-blue">
                  Tổng số tiền: {{formatPrice}} ₫
                </span>
                <div v-if="cashier">
                  <span class="text-bold text-blue">Người nhận:</span>
                  <div class="member-avatar d-flex justify-center items-center mt-10 gap-10">
                    <el-badge is-dot class="event-status item" :type="cashier.friendStatus === 4 ?  'danger' : 'success'">
                      <ShowAvatarElement :event="{ name: cashier.name }"></ShowAvatarElement>
                    </el-badge>
                    <div>
                      <span class="text-bold">{{ cashier.name }}</span>
                      <br><span class="time">{{ cashier.phone }}</span>
                    </div>
                  </div>
                </div>
                <div v-else>
                  <span class="text-bold text-blue">Người nhận:</span>
                  <div class="member-avatar justify-center d-flex items-center mt-10 gap-10">
                    <el-badge is-dot class="event-status item" :type="owner.role === 4 ?  'danger' : 'success'">
                      <ShowAvatarElement :event="{ name: owner.name }"></ShowAvatarElement>
                    </el-badge>
                    <div>
                      <span class="text-bold">{{ owner.name }}</span>
                      <br><span class="time">{{ owner.phone }}</span>
                    </div>
                  </div>
                </div>
              </el-card>
              <el-card class="mt-10">
                <div class="text-center">
                  <span class="text-bold text-blue ">Vui lòng tải ảnh xác minh thanh toán</span>
                </div>
                <div ref="imageAvatar" class="content-input image-avatar">
                  <input id="upload-detail" ref="fileUploadDetail" style="display: none" type="file" max="3" accept=".jpeg, .jpg, .png, .svg, .heic" @change="onFileChangeDetail">
                  <img v-if="!imageDetailShow.length" class="text" src="/assets/icon/icon_user_default.svg" alt="">
                  <div v-if="imageDetailShow.length" class="d-flex show-avatar">
                    <div v-for="(detail, index) in imageDetailShow" :key="index" class="show-detail">
                      <img id="img-intro" class="show-image" :src="detail ? detail : '/assets/icon/icon_user_default.svg'" alt="">
                      <img class="image-close" src="/assets/icon/icon_close_image.svg" alt="" @click="removeImage(index)">
                    </div>
                  </div>
                  <div class="button-upload">
                    <button style="margin-left: 25px" type="button"><label for="upload-detail">Tải ảnh</label></button>
                  </div>
                </div>
              </el-card>
            </div>
            <div v-if="value === '2'" class="pay-method">
              <el-card class="total-money text-center">
                <span class="text-bold text-blue">
                  Tổng số tiền: {{ formatPrice }} ₫
                </span>
                <br>
                <span class="text-bold text-blue">
                  Nội dung chuyển khoản: {{ code }}
                </span>
                <div v-if="cashier">
                  <span class="text-bold text-blue">Người nhận:</span>
                  <div class="member-avatar d-flex justify-center items-center mt-10 gap-10">
                    <el-badge is-dot class="event-status item" :type="cashier.friendStatus === 4 ?  'danger' : 'success'">
                      <ShowAvatarElement :event="{ name: cashier.name }"></ShowAvatarElement>
                    </el-badge>
                    <div>
                      <span class="text-bold">{{ cashier.name }}</span>
                      <br><span class="time">{{ cashier.phone }}</span>
                    </div>
                  </div>
                </div>
                <div v-else>
                  <span class="text-bold text-blue">Người nhận:</span>
                  <div class="member-avatar justify-center d-flex items-center mt-10 gap-10">
                    <el-badge is-dot class="event-status item" :type="owner.role === 4 ?  'danger' : 'success'">
                      <ShowAvatarElement :event="{ name: owner.name }"></ShowAvatarElement>
                    </el-badge>
                    <div>
                      <span class="text-bold">{{ owner.name }}</span>
                      <br><span class="time">{{ owner.phone }}</span>
                    </div>
                  </div>
                </div>
              </el-card>
              <el-card class="mt-10">
                <div class="text-center">
                  <span class="text-bold text-blue ">Vui lòng tải ảnh xác minh thanh toán</span>
                </div>
                <div ref="imageAvatar" class="content-input image-avatar">
                  <input id="upload-detail" ref="fileUploadDetail" style="display: none" type="file" max="3" accept=".jpeg, .jpg, .png, .svg, .heic" @change="onFileChangeDetail">
                  <img v-if="!imageDetailShow.length" class="text" src="/assets/icon/icon_user_default.svg" alt="">
                  <div v-if="imageDetailShow.length" class="d-flex show-avatar">
                    <div v-for="(detail, index) in imageDetailShow" :key="index" class="show-detail">
                      <img id="img-intro" class="show-image" :src="detail ? detail : '/assets/icon/icon_user_default.svg'" alt="">
                      <img class="image-close" src="/assets/icon/icon_close_image.svg" alt="" @click="removeImage(index)">
                    </div>
                  </div>
                  <div class="button-upload">
                    <button style="margin-left: 25px" type="button"><label for="upload-detail">Tải ảnh</label></button>
                  </div>
                </div>
              </el-card>
            </div>
            <div class="btn-group-step items-center d-flex  gap-10" :class=" !value ? 'mt-200' : 'mt-30'">
              <el-button type="primary" @click="step=1" >Quay lại</el-button>
              <el-button :disabled="!value ? true : false" type="primary" @click="handlePay">Hoàn tất</el-button>
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
import _ from 'lodash'
import { formatPrice } from '@/utils/util'

import {
  PAY_DEBT,
  GET_DEBT_LIST,
  INDEX_SET_LIST_FRIEND,
  INDEX_SET_LOADING,
  INDEX_SET_SUCCESS,
  INDEX_SET_ERROR, IMAGE_UPLOAD_DEBT,
  GET_PAID_CODE, GET_PAID_CHECK, MEMBER_GET_ALL, GET_RECEIPT_LIST
} from '~/store/store.const'

export default {
  name: 'MainPage',
  middleware: 'auth',
  components: {
  },
  data() {
    return {
      id: this.$route.params.id,
      imageDetailShow: [],
      checkedDebt: [],
      search: '',
      friends: '',
      isIndeterminate: false,
      listDebt: [],
      listId: [],
      checkAll: false,
      totalMoney: 0,
      step: 1,
      receiveOrPaidAmount: '',
      code: '',
      paidCheck: false,
      value: '',
      owner: '',
      cashier: '',
      options: [{
        value: '1',
        label: 'Tiền mặt'
      }, {
        value: '2',
        label: 'Chuyển khoản'
      }]
    }
  },
  computed: {
    totalDebt() {
      let total = 0
      this.listDebt.forEach((element) => {
        total += element.maxSlider
      })
      return total
    },
    formatPrice() {
      return formatPrice(this.totalMoney)
    },
    formatRemainder() {
      return formatPrice(this.totalDebt - this.totalMoney)
    },
    formatTotalPaid() {
      return this.totalMoney ? formatPrice(this.totalMoney) : 0
    }
  },
  watch: {
    listDebt: {
      handler() {
        let total = 0
        this.listDebt.forEach((element) => {
          if (element.check) {
            total += element.debtLeft
          }
        })
        this.totalMoney = total
      },
      deep: true
    },
    checkedDebt() {
      this.checkedDebt.forEach((element) => {
        if (this.listId.includes(element)) {
          this.listDebt.forEach((debt) => {
            if (debt.userDeptId === element) {
              debt.check = true
            }
          })
        }
      })
    }
  },
  created() {
    this.getMemberInfo()
    this.getlistDebt()
    this.getDebtTotal()
  },
  mounted() {
  },
  methods: {
    async getMemberInfo() {
      this.$store.commit(INDEX_SET_LOADING, true)
      try {
        const response = await this.$store.dispatch(MEMBER_GET_ALL, this.id)
        const { data, statusCode } = response
        if (statusCode === 202) {
          this.owner = data.members[0]
          this.cashier = data.cashier
        }
      } catch (e) {
        this.$store.commit(INDEX_SET_LOADING, false)
      }
      this.$store.commit(INDEX_SET_LOADING, false)
    },

    formatVND() {
    },
    async getDebtTotal() {
      this.$store.commit(INDEX_SET_LOADING, true)
      try {
        const response = await this.$store.dispatch(GET_RECEIPT_LIST, this.$route.params.id)
        const { data, statusCode } = response
        if (statusCode === 202) {
          this.receiveOrPaidAmount = data.receiveOrPaidAmount
        }
      } catch (e) {
        this.$store.commit(INDEX_SET_LOADING, false)
      }
      this.$store.commit(INDEX_SET_LOADING, false)
    },
    async getlistDebt() {
      this.$store.commit(INDEX_SET_LOADING, true)
      try {
        const response = await this.$store.dispatch(GET_DEBT_LIST, {
          'EventId': this.$route.params.id
        })
        const { data, statusCode } = response
        if (statusCode === 202) {
          this.listDebt = data
          this.listDebt.forEach((element) => {
            element.maxSlider = element.debtLeft
            element.formatSlider = formatPrice(element.debtLeft)
            element.check = false
          })
        }
      } catch (e) {
        this.$store.commit(INDEX_SET_LOADING, false)
      }
      this.$store.commit(INDEX_SET_LOADING, false)

      this.listDebt.forEach((element) => {
        this.listId.push(element.userDeptId)
      })
    },
    async getPaidCode() {
      this.$store.commit(INDEX_SET_LOADING, true)
      try {
        const response = await this.$store.dispatch(GET_PAID_CODE)
        if (response.statusCode === 202) {
          this.code = response.data
        }
      } catch (e) {
        this.$store.commit(INDEX_SET_LOADING, false)
      }
      this.$store.commit(INDEX_SET_LOADING, false)
    },
    handleRouter(router) {
      this.$router.push(router)
    },
    handleCheckedCitiesChange(value) {
      const checkedCount = value.length
      this.checkAll = checkedCount === this.listDebt.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.listDebt.length
    },
    handleCheckAllChange(val) {
      this.checkedDebt = val ? this.listId : []
      this.listDebt.forEach((element) => {
        element.check = val
      })
      this.isIndeterminate = false
      if (val) {
        let total = 0
        this.listDebt.forEach((element) => {
          element.check = true
          total += element.debtLeft
        })
        this.totalMoney = total
      } else {
        this.listDebt.forEach((element) => {
          element.check = false
        })
        this.totalMoney = 0
      }
    },
    async create() {
      await this.$store.commit(INDEX_SET_LIST_FRIEND, this.checkedDebt)
    },
    changeCheck(value) {
      value.check = !value.check
      // this.listDebt.forEach((element) => {
      //   if (element.userDeptId === value.userDeptId) {
      //     element.check = value.check
      //     element.debtleft = value.debtleft
      //   }
      // })
      if (value.check) {
        this.totalMoney += value.debtLeft
      } else {
        this.totalMoney -= value.debtLeft
      }
    },
    async handleStep() {
      await this.handlePaidCheck()
      if (this.paidCheck) {
        return
      }
      if (!this.checkedDebt.length) {
        this.$store.commit(INDEX_SET_ERROR, { show: true, text: 'Bạn chưa chọn khoản trả nợ' })
        return
      }
      if (this.receiveOrPaidAmount.amount < this.totalMoney) {
        this.$store.commit(INDEX_SET_ERROR, { show: true, text: 'Bạn chỉ cần trả nợ ' + this.receiveOrPaidAmount.amountFormat })
        return
      }
      await this.getPaidCode()
      this.step = 2
    },
    removeImage(index) {
      this.imageDetailShow = this.imageDetailShow.filter(function(item, key) {
        return key !== index
      })
    },
    checkFile(file) {
      const allowedExtensions = /(\.heic|\.jpg|\.jpeg|\.png|\.svg)$/i
      if (file.size >= 5000000) {
        return 'Kích cỡ ảnh quá nặng'
      }
      if (!['image/jpeg', 'image/png', 'image/jpg', 'image/svg'].includes(file.type) && !allowedExtensions.exec(file.name)) {
        return 'Ảnh sai định dạng'
      }
      return ''
    },
    async onFileChangeDetail(e) {
      for (let x = 0; x < e.target.files.length; x++) {
        const valid = this.checkFile(e.target.files[x])
        if (valid) {
          await this.$store.commit(INDEX_SET_ERROR, { show: true, text: valid })
          return
        }
      }
      await this.$store.commit(INDEX_SET_LOADING, true)
      for (let x = 0; x < e.target.files.length; x++) {
        const formData = new FormData()
        formData.append('imgfile', e.target.files[x])
        try {
          const data = await this.$store.dispatch(IMAGE_UPLOAD_DEBT, formData)
          switch (data.statusCode) {
            case 202:
              if (this.imageDetailShow.length < 3) {
                this.imageDetailShow.push(data.data)
              }
              if (this.imageDetailShow.length >= 3) {
                this.$refs.fileUploadDetail.value = null
                return
              }
              break
            case 500:
              await this.$store.commit(INDEX_SET_ERROR, {
                show: true,
                text: data.error
              })
              break
            default:
              await this.$store.commit(INDEX_SET_ERROR, { show: true, text: data.messages })
              break
          }
        } catch (err) {
          this.$store.commit(INDEX_SET_ERROR, { show: true, text: 'Lỗi !', message: this.$t('message.message_error') })
        }
        await this.$store.commit(INDEX_SET_LOADING, false)

        if (this.imageDetailShow.length > 3) {
          this.imageDetailShow.splice(3, this.imageDetailShow.length - 3)
        }
      }
      this.$refs.fileUploadDetail.value = null
      await this.$store.commit(INDEX_SET_LOADING, false)
    },
    async handlePaidCheck() {
      this.paidCheck = false
      try {
        const data = await this.$store.dispatch(GET_PAID_CHECK, this.id)
        switch (data.statusCode) {
          case 406:
            this.$store.commit(INDEX_SET_ERROR, {
              show: true,
              text: data.message
            })
            this.paidCheck = true
            break
        }
      } catch (e) {
        this.$store.commit(INDEX_SET_ERROR, { show: true, text: this.$t('message.message_error') })
        this.$store.commit(INDEX_SET_LOADING, false)
      }
      this.$store.commit(INDEX_SET_LOADING, false)
    },
    async handlePay() {
      if (!this.imageDetailShow.length) {
        this.$store.commit(INDEX_SET_ERROR, { show: true, text: 'Bạn chưa tải ảnh xác minh' })
        return
      }
      const cloned = _.cloneDeep(this.listDebt)
      cloned.forEach((element) => {
        if (!element.check) {
          element.debtLeft = 0
        }
      })
      let type = ''
      if (this.value === '1') {
        type = 'money'
      } else {
        type = 'bank'
      }
      this.$store.commit(INDEX_SET_LOADING, true)
      try {
        const data = await this.$store.dispatch(PAY_DEBT, {
          'eventId': this.$route.params.id,
          'userId': 11,
          'IMGLinks': this.imageDetailShow,
          'totalMoney': this.totalMoney,
          'listEachPaidDebt': cloned,
          'Code': this.code,
          type
        })
        switch (data.statusCode) {
          case 202:
            this.$store.commit(INDEX_SET_SUCCESS, {
              show: true,
              text: data.message
            })
            this.handleRouter('/event/detail/' + this.id)
            break
          default:
            this.$store.commit(INDEX_SET_ERROR, { show: true, text: data.message })
            break
        }
      } catch (e) {
        this.$store.commit(INDEX_SET_LOADING, false)
      }
      this.$store.commit(INDEX_SET_LOADING, false)
    }
  }
}
</script>
