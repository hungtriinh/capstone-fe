<template>
  <div class="main-login">
    <div>
      <div class="login login-width login-mobile">
        <h3 class="title">{{ $t('register.title') }}</h3>
        <el-form
          v-if="step===1"
          ref="accountForm"
          :model="accountForm"
          :rules="accountRules"
          label-position="left"
          @keyup.enter.native="register"
        >
          <el-form-item
            class="email-login"
            :label="$t('register.name')"
            prop="name"
            :error="getErrResponse('name')">
            <el-input
              ref="name"
              v-model="accountForm.name"
              :placeholder="$t('register.name')"
              name="name"
              type="text"
              tabindex="1"
              maxlength="50"
              @focus="resetValidate('name')"
            />
          </el-form-item>
          <el-form-item
            class="email-login"
            :label="$t('register.email')"
            prop="email"
            :error="getErrResponse('email')">
            <el-input
              ref="email"
              v-model.trim="accountForm.email"
              :placeholder="$t('register.email')"
              name="email"
              type="text"
              tabindex="2"
              maxlength="50"
              @focus="resetValidate('email')"
            />
          </el-form-item>
          <el-form-item
            class="email-login" :label="$t('account.password')" prop="password"
            :error="getErrResponse('password')">
            <el-input
              ref="password"
              v-model="accountForm.password"
              :placeholder="$t('account.password')"
              name="password"
              :type="showPass?'text':'password'"
              tabindex="3"
              maxlength="32"
              autocomplete="off"
              @focus="resetValidate('password')"
            >
              <i slot="suffix" class="cursor-pointer" @click="displayPass('pass')">
                <img v-if="showPass" class="icon-show-pass" src="~/assets/images/icons/eye-input.svg"/>
                <img v-else class="icon-show-pass" src="@/assets/images/icons/hide-eye.svg"/>
              </i>
            </el-input>
          </el-form-item>
          <el-form-item
            class="email-login" :label="$t('account.password_confirmation')" prop="password_confirmation"
            :error="getErrResponse('password_confirmation')">
            <el-input
              ref="password_confirmation"
              v-model="accountForm.password_confirmation"
              :placeholder="$t('account.password_confirmation')"
              name="password_confirmation"
              :type="showPassConfirm?'text':'password'"
              tabindex="4"
              maxlength="32"
              autocomplete="off"
              @focus="resetValidate('password_confirmation')"
            >
              <i slot="suffix" class="cursor-pointer" @click="displayPass('passConfirm')">
                <img v-if="showPassConfirm" class="icon-show-pass" src="~/assets/images/icons/eye-input.svg"/>
                <img v-else class="icon-show-pass" src="@/assets/images/icons/hide-eye.svg"/>
              </i>
            </el-input>
          </el-form-item>
          <el-form-item
            class="email-login"
            :label="$t('register.referral_code')"
            prop="invite_code"
            :error="getErrResponse('invite_code')">
            <el-input
              ref="phone"
              v-model.trim="accountForm.invite_code"
              :placeholder="$t('register.referral_code')"
              name="invite_code"
              type="text"
              tabindex="5"
              maxlength="20"
              @focus="resetValidate('invite_code')"
            />
          </el-form-item>
          <el-form-item prop="agree">
            <div class="agree-block">
              <el-checkbox
                ref="agree"
                v-model="accountForm.agree"
                @change="$refs.accountForm.validateField('agree')">
              </el-checkbox>
              <div class="agree-block-label">
                <span>{{ $t('register.agree') }}</span>
                <span class="color-orange cursor-pointer">{{ $t('register.privacy_policy') }}</span>
              </div>
            </div>
          </el-form-item>
          <el-form-item class="captcha" :error="getErrResponse('g-recaptcha-response')" prop="captcha">
            <template>
              <recaptcha
                ref="captcha"
                @error="onError"
                @success="onSuccess"
                @expired="onExpired"
              />
            </template>
          </el-form-item>
          <el-form-item>
            <div :class="{'disabled' : disabledButton, 'common-button': 'common-button'}">
              <el-button
                v-loading.fullscreen.lock="fullscreenLoading"
                :loading="loading"
                :disabled="disabledButton"
                @click.native="register"
              >
                {{ $t('register.title') }}
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
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import { AUTH_REGISTER, INDEX_SET_ERROR, INDEX_SET_LOADING, INDEX_SET_SUCCESS, SET_EMAIL } from '@/store/store.const'
import { TYPE_REGISTER_OTP } from '@/store/store.const.js'
import { validEmail, validPassword } from '@/utils/validate'
import OtpPage from '@/components/auth/otp'

export default {
  name: 'RegisterPage',
  components: { OtpPage },
  // middleware: 'auth-guard',
  data() {
    const validdateEmail = (rule, value, callback) => {
      if (!validEmail(value)) {
        callback(new Error(this.$t('validation.email_format')))
      } else {
        callback()
      }
    }
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('validation.required', { _field_: this.$t('account.password') }).toString()))
      } else {
        if (!validPassword(value)) {
          callback(new Error(this.$t('validation.pass_format')))
        }
        if (this.accountForm.password_confirmation !== '') {
          this.$refs.accountForm.validateField('password_confirmation')
        }
        callback()
      }
    }
    const validateConfirmPass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('validation.required', { _field_: this.$t('account.password') }).toString()))
      } else if (value !== this.accountForm.password) {
        callback(new Error(this.$t('validation.passNotMatch').toString()))
      } else {
        callback()
      }
    }
    const validateAgree = (rule, value, callback) => {
      if (this.accountForm.agree == null || !this.accountForm.agree) {
        callback(new Error(this.$t('validation.agree')))
      } else {
        callback()
      }
    }
    const validateCaptcha = (rule, value, callback) => {
      if (this.captcha == null || !this.captcha) {
        callback(new Error(this.$t('validation.captcha_req')))
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
      step: 2,
      accountForm: {
        name: '',
        email: '',
        password: '',
        invite_code: this.$route.params.code ? this.$route.params.code : '',
        password_confirmation: '',
        agree: false,
        errors: {}
      },
      errorResponse: [],
      error: {
        key: null,
        value: ''
      },
      accountRules: {
        name: [
          {
            required: true,
            message: this.$t('validation.required', { _field_: this.$t('register.name') }),
            trigger: 'blur'
          }
        ],
        email: [
          {
            required: true,
            message: this.$t('validation.required', { _field_: this.$t('account.email') }),
            trigger: 'blur'
          },
          {
            validator: validdateEmail, trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: this.$t('validation.required', { _field_: this.$t('account.password') }),
            trigger: 'blur'
          },
          { validator: validatePass, trigger: 'blur' }
        ],
        password_confirmation: [
          {
            required: true,
            message: this.$t('validation.required', { _field_: this.$t('account.password_confirmation') }),
            trigger: 'blur'
          },
          {
            validator: validateConfirmPass,
            message: this.$t('validation.passNotMatch'),
            trigger: 'blur'
          }
        ],
        agree: [
          {
            validator: validateAgree, trigger: 'blur'
          }
        ],
        captcha: [
          {
            validator: validateCaptcha, trigger: 'blur'
          }
        ]
      },
      valid: false,
      loading: false,
      fullscreenLoading: false,
      preCodePhone: '',
      codePhones: [],
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
      return this.accountForm.email === '' || this.accountForm.password === '' ||
        this.accountForm.password_confirmation === '' || this.captcha === ''
    }
  },
  watch: {
    language() {
      const validdateEmail = (rule, value, callback) => {
        if (!validEmail(value)) {
          callback(new Error(this.$t('validation.email_format')))
        } else {
          callback()
        }
      }
      const validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error(this.$t('validation.required', { _field_: this.$t('account.password') }).toString()))
        } else {
          if (!validPassword(value)) {
            callback(new Error(this.$t('validation.pass_format')))
          }
          if (this.accountForm.password_confirmation !== '') {
            this.$refs.accountForm.validateField('password_confirmation')
          }
          callback()
        }
      }
      const validateConfirmPass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error(this.$t('validation.required', { _field_: this.$t('account.password') }).toString()))
        } else if (value !== this.accountForm.password) {
          callback(new Error(this.$t('validation.passNotMatch').toString()))
        } else {
          callback()
        }
      }
      const validateAgree = (rule, value, callback) => {
        if (this.accountForm.agree == null || !this.accountForm.agree) {
          callback(new Error(this.$t('validation.agree')))
        } else {
          callback()
        }
      }
      const validateCaptcha = (rule, value, callback) => {
        if (this.captcha == null || !this.captcha) {
          callback(new Error(this.$t('validation.captcha_req')))
        } else {
          callback()
        }
      }
      this.accountRules = {
        email: [
          {
            required: true,
            message: this.$t('validation.required', { _field_: this.$t('account.email') }),
            trigger: 'blur'
          },
          {
            validator: validdateEmail, trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: this.$t('validation.required', { _field_: this.$t('account.password') }),
            trigger: 'blur'
          },
          { validator: validatePass, trigger: 'blur' }
        ],
        password_confirmation: [
          {
            required: true,
            message: this.$t('validation.required', { _field_: this.$t('account.password_confirmation') }),
            trigger: 'blur'
          },
          {
            validator: validateConfirmPass,
            message: this.$t('validation.passNotMatch'),
            trigger: 'blur'
          }
        ],
        agree: [
          {
            validator: validateAgree, trigger: 'blur'
          }
        ],
        captcha: [
          {
            validator: validateCaptcha, trigger: 'blur'
          }
        ]
      }
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
      try {
        await this.$store.commit(INDEX_SET_LOADING, true)
        if (this.captcha == null || !this.captcha) {
          const token = await this.$recaptcha.getResponse()
          this.captcha = token.toString()
        }
        let dto = {
          email: this.accountForm.email,
          password: this.accountForm.password,
          password_confirmation: this.accountForm.password_confirmation,
          name: this.accountForm.name
        }
        if (this.accountForm.invite_code != null && this.accountForm.invite_code !== '') {
          dto = { ...dto, invite_code: this.accountForm.invite_code }
        }
        const data = await this.$store.dispatch(AUTH_REGISTER, {
          ...dto,
          'g-recaptcha-response': this.captcha
        })
        switch (data.status_code) {
          case 200:
            this.$store.commit(INDEX_SET_SUCCESS, {
              show: true,
              text: data.message
            })
            this.$store.commit(SET_EMAIL, this.accountForm.email)
            this.token = data.data.token
            this.user = { ...dto, 'g-recaptcha-response': this.captcha }
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
      if (this.isCaptchaExpireOrError) {
        this.captcha = ''
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
    async onError() {
      this.isCaptchaExpireOrError = true
      this.captcha = ''
      await this.$recaptcha.reset()
    },
    onSuccess(token) {
      this.isCaptchaExpireOrError = false
      this.captcha = token
      this.resetValidate('captcha')
    },
    async onExpired() {
      this.isCaptchaExpireOrError = true
      this.captcha = ''
      await this.$recaptcha.reset()
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
