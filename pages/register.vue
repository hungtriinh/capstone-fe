<template>
  <div class="main-login">
    <div>
      <div class="login login-width login-mobile">
        <h3 class="title text-center text-[#011A51]">{{ $t('register.title') }}</h3>
        <p class="text-[#727E96] text-center font-light">{{getRegisterMessage}}</p>
        <p v-if="step === 2" class="text-center">{{getPhoneFormat}}</p>
        <div class="d-flex justify-center pt-8">
          <img :src="getBackgroundImage" alt="">
        </div>
        <el-form
          v-if="step===1"
          ref="accountForm"
          :model="accountForm"
          :rules="accountRules"
          label-position="left"
          class="pt-8"
          @keyup.enter.native="sendOtp"
        >
          <el-form-item class="email-login" prop="phone" :error="(error.key === 'phone') ? error.value : ''">
            <!-- <label for="email">{{ $t('account.phone') }}</label> -->
            <div class="custom-register-input">
              <el-input
                id="phone"
                ref="phone"
                v-model.trim="accountForm.phone"
                :placeholder="$t('account.phone')"
                autocomplete="off"
                name="phone"
                type="text"
                tabindex="2"
                maxlength="12"
                oninput="this.value=this.value.replace(/[^0-9]/g,'');"
                pattern="[0-9]*"
                inputmode="numeric"
                @focus="resetValidate('phone')"
              >
                <template #prefix>
                  <div class="d-flex items-center px-[10px]" style="height: 100%">
                    <img src="@/assets/images/register/vietnam.svg" alt="" class="rounded-sm" style="width: 21px; height: 14px;"/>
                    <span class="pl-[8px] text-[#606266]">+84</span>
                  </div>
                </template>
              </el-input>
            </div>
          </el-form-item>
          <el-form-item style="margin-top: 50px">
            <div :class="{'disabled' : disabledButton, 'common-button': 'common-button'}">
              <el-button
                v-loading.fullscreen.lock="fullscreenLoading"
                :loading="loading"
                type="primary"
                :disabled="disabledButton"
                @click.native="sendOtp"
              >
                {{ $t('register.send_sms') }}
              </el-button>
            </div>
          </el-form-item>
        </el-form>
        <div v-if="step===2" class="otp pt-8">
          <otp-page @changeStep="changeStep" :type="typeVerify" :token="token" :user_register="getPhoneFormat"></otp-page>
        </div>
        <div v-if="step===3" class="otp">
          <forgot-pass :type="typeVerify" :token="token" :user_register="getPhoneFormat"></forgot-pass>
        </div>
        <div class="d-flex align-items-center text-center font-normal" style="margin-top: 1.5rem">
              <span class="pr-[4px]">
                {{ $t('register.already_account') }}
              </span>
              <router-link to="/login" class="align-items-center cursor-pointer underline lowercase text-[#344874]">
                {{ $t('account.login') }}
              </router-link>
            </div>
      </div>
    </div>
  </div>
</template>
<script>
import _ from 'lodash'
import { mapState } from 'vuex'
import {
  AUTH_SEND_OTP,
  INDEX_SET_ERROR,
  INDEX_SET_LOADING,
  AUTH_CHECK_OTP,
  INDEX_SET_SUCCESS
} from '@/store/store.const'
import { TYPE_REGISTER_OTP } from '@/store/store.const.js'
import { validPhoneNoPrefix } from '@/utils/validate'
import OtpPage from '@/components/auth/otp'
import ForgotPass from '~/components/auth/ForgotPass'

export default {
  name: 'RegisterPage',
  components: { OtpPage, ForgotPass },
  layout: 'none',
  // middleware: 'auth-guard',
  data() {
    const validPhoneNumber = (rule, value, callback) => {
      if (value == null || value === '') {
        callback()
      } else if (!validPhoneNoPrefix(value)) {
        callback(new Error(this.$t('validation.phone_length')))
      } else {
        callback()
      }
    }
    return {
      typeVerify: TYPE_REGISTER_OTP,
      token: '',
      captcha: '',
      isCaptchaExpireOrError: false,
      user: {},
      step: 1,
      accountForm: {
        phone: '',
        errors: {}
      },
      errorResponse: [],
      error: {
        key: null,
        value: ''
      },
      accountRules: {
        phone: [
          {
            required: true,
            message: this.$t('validation.required', { _field_: this.$t('account.phone') }),
            trigger: 'blur'
          },
          {
            validator: validPhoneNumber, trigger: 'blur'
          }
        ]
      },
      valid: false,
      loading: false,
      fullscreenLoading: false,
      isValid: false,
      isMounted: false,
      showPass: false,
      showPassConfirm: false,
      isEditing: true,
      isCLickPhone: false
    }
  },
  computed: {
    ...mapState(['language']),
    disabledButton() {
      if (!this.isMounted) {
        return
      }
      return this.accountForm.phone === ''
    },
    getRegisterMessage() {
      if (this.step === 1) {
        return this.$t('register.invite_message')
      } else if (this.step === 2) {
        return this.$t('register.code_message')
      } else {
        return this.$t('register.welcome_message')
      }
    },
    getPhoneFormat() {
      const phone = _.cloneDeep(this.accountForm.phone)
      return '+84' + (phone.startsWith('0') ? phone.slice(1, phone.length) : phone)
    },
    getBackgroundImage() {
      return require(`~/assets/images/register/register-icon-${this.step}.svg`)
    }
  },
  created() {
  },
  mounted() {
    this.isMounted = true
  },
  methods: {
    updateNumber(event) {
      let value = event.target.value
      // eslint-disable-next-line prefer-regex-literals
      value = value.replace(new RegExp('[^0-9]+$', 'gm'), '')
      event.target.value = value
    },
    resetValidate(ref) {
      if (ref === this.error.key) {
        this.error = { key: null, value: '' }
      }
      this.$refs.accountForm.fields.find((f) => f.prop === ref).clearValidate()
      this.accountForm.errors[ref] = ''
    },
    changeStep(step) {
      this.step = step
    },
    async sendOtp() {
      await this.validateForm()
      if (!this.isValid) {
        return
      }
      try {
        await this.$store.commit(INDEX_SET_LOADING, true)
        // const dto = {
        //   phone: this.accountForm.phone
        // }
        const dto = _.cloneDeep(this.accountForm)

        const data = await this.$store.dispatch(AUTH_SEND_OTP, {
          phone: '+84' + (dto.phone.startsWith('0') ? dto.phone.slice(1, dto.phone.length) : dto.phone)

        })
        switch (data.statusCode) {
          case 202:
            this.$store.commit(INDEX_SET_SUCCESS, {
              show: true,
              text: data.message
            })
            this.step = 2
            break
          default:
            this.$store.commit(INDEX_SET_ERROR, { show: true, text: data.message })
            break
        }
      } catch (err) {
        this.$store.commit(INDEX_SET_ERROR, { show: true, text: this.$t('message.message_error') })
      }
      this.$store.commit(INDEX_SET_LOADING, false)
    },
    async checkOtp(dto) {
      this.step = 3
      try {
        await this.$store.commit(INDEX_SET_LOADING, true)

        const data = await this.$store.dispatch(AUTH_CHECK_OTP, {
          ...dto
        })
        switch (data.statusCode) {
          case 202:
            this.$store.commit(INDEX_SET_SUCCESS, {
              show: true,
              text: data.message
            })
            this.step = 3
            break
          case 406:
            this.$store.commit(INDEX_SET_ERROR, {
              show: true,
              text: data.message
            })
            this.step = 3
            break
          default:
            this.$store.commit(INDEX_SET_ERROR, { show: true, text: data.message })
            break
        }
      } catch (err) {
        this.$store.commit(INDEX_SET_ERROR, { show: true, text: this.$t('message.message_error') })
      }
      this.$store.commit(INDEX_SET_LOADING, false)
    },
    async validateForm() {
      await this.$refs.accountForm.validate(async valid => {
        this.isValid = (await valid)
      })
    },
    displayPass(type) {
      if (type === 'pass') {
        this.showPass = !this.showPass
      } else {
        this.showPassConfirm = !this.showPassConfirm
      }
    },
    getErrResponse(key) {
      let result = ''
      if (this.errorResponse == null || this.errorResponse.length === 0) {
        return
      }
      this.errorResponse.forEach(err => {
        if (err.key === key) {
          result = err.value
          return false
        }
      })
      return result
    }
  }
}
</script>
<style>
/* stylelint-disable */
.custom-register-input .el-input--prefix .el-input__inner {
  padding-left: 80px;
}
/* stylelint-enable */
</style>
