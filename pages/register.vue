<template>
  <div class="main-login">
    <div>
      <div class="login login-width login-mobile">
        <h3 class="title text-center">{{ $t('register.title') }}</h3>
        <el-form
          v-if="step===1"
          ref="accountForm"
          :model="accountForm"
          :rules="accountRules"
          label-position="left"
          @keyup.enter.native="register"
        >
          <el-form-item class="email-login" prop="phone" :error="(error.key === 'phone') ? error.value : ''">
            <label for="email">{{ $t('account.phone') }}</label>
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
                <div class="d-flex align-center px-[10px]" style="height: 100%">
                  <img src="@/assets/images/register/vietnam.svg" alt="" class="rounded-sm" style="width: 21px; height: 14px;"/>
                  <span class="pl-[8px] text-[#606266]">+84</span>
                </div>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item style="margin-top: 50px">
            <div :class="{'disabled' : disabledButton, 'common-button': 'common-button'}">
              <el-button
                v-loading.fullscreen.lock="fullscreenLoading"
                :loading="loading"
                :disabled="disabledButton"
                @click.native="register"
              >
                {{ $t('register.send_sms') }}
              </el-button>
            </div>
            <div class="d-flex align-items-center text-center" style="margin-top: 1.5rem">
              <span>
                {{ $t('register.already_account') }}
              </span>
              <router-link to="/login" class="align-items-center color-orange cursor-pointer underline lowercase">
                {{ $t('account.login') }}
              </router-link>
            </div>
          </el-form-item>
        </el-form>
        <div v-if="step===2" class="otp">
          <otp-page :type="typeVerify" :token="token" :user_register="user"></otp-page>
        </div>
        <div v-if="step===3" class="otp">
          <forgot-pass :type="typeVerify" :token="token" :user_register="user"></forgot-pass>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import { AUTH_REGISTER, INDEX_SET_ERROR, INDEX_SET_LOADING, INDEX_SET_SUCCESS, SET_EMAIL } from '@/store/store.const'
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
    async register() {
      this.errorResponse = []
      this.isEditing = false
      this.error = { key: null, value: '' }
      await this.validateForm()
      if (!this.isValid) {
        return
      }
      this.step = 2
      try {
        await this.$store.commit(INDEX_SET_LOADING, true)
        const dto = {
          email: this.accountForm.email,
          password: this.accountForm.password,
          password_confirmation: this.accountForm.password_confirmation,
          name: this.accountForm.name
        }
        const data = await this.$store.dispatch(AUTH_REGISTER, {
          ...dto
        })
        switch (data.status_code) {
          case 202:
            this.$store.commit(INDEX_SET_SUCCESS, {
              show: true,
              text: data.message
            })
            this.$store.commit(SET_EMAIL, this.accountForm.email)
            this.token = data.data.token
            this.step = 2
            break
          case 422:
            for (const [k] of Object.entries(data.data)) {
              this.error = { key: k, value: data.data[k][0] }
              this.errorResponse.push({ key: k, value: data.data[k][0] })
            }
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
.el-input--prefix .el-input__inner {
  padding-left: 80px;
}
/* stylelint-enable */
</style>
