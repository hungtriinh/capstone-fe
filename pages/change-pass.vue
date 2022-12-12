<template>
  <div class="main-login">
    <div class="d-flex items-center justify-between">
      <el-page-header content="Thay đổi mật khẩu" @back="$router.push('profile')">
      </el-page-header>
      <div>
        <el-button
          type="primary"
          @click.native="handleSave"
        >
          Lưu
        </el-button>
      </div>
    </div>

    <div class="main-content"></div>
    <div>
      <el-form
        ref="accountForm"
        :model="accountForm"
        :rules="accountRules"
        label-position="left"
        @keyup.enter.native="register"
      >
        <el-form-item class="email-login" :label="$t('account.password')" prop="password"
                      :error="(error.key === 'password') ? error.value : ''">
          <el-input
            id="password"
            ref="password"
            v-model.trim="accountForm.password"
            :placeholder="$t('account.password')"
            autocomplete="off"
            name="password"
            type="text"
            tabindex="2"
            maxlength="50"
            @focus="resetValidate('password')"
          />
        </el-form-item>
        <el-form-item
          class="email-login" :label="$t('account.new_password')" prop="new_password"
          :error="getErrResponse('new_password')">
          <el-input
            ref="password"
            v-model="accountForm.new_password"
            :placeholder="$t('account.new_password')"
            name="password"
            :type="showPass?'text':'password'"
            tabindex="3"
            maxlength="32"
            autocomplete="off"
            @focus="resetValidate('new_password')"
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
      </el-form>
    </div>
  </div>
</template>
<script>
import { CHANGE_PASS, INDEX_SET_ERROR, INDEX_SET_LOADING, INDEX_SET_SUCCESS } from '@/store/store.const'
import { TYPE_REGISTER_OTP } from '@/store/store.const.js'

export default {
  name: 'RegisterPage',
  // middleware: 'auth-guard',
  data() {
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('validation.required', { _field_: this.$t('account.password') }).toString()))
      } else {
        if (value.length > 20 || value.length < 8) {
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
      } else if (value !== this.accountForm.new_password) {
        callback(new Error(this.$t('validation.passNotMatch').toString()))
      } else {
        callback()
      }
    }
    return {
      typeVerify: TYPE_REGISTER_OTP,
      token: '',
      captcha: '',
      user: {},
      accountForm: {
        password: '',
        new_password: '',
        password_confirmation: '',
        errors: {}
      },
      errorResponse: [],
      error: {
        key: null,
        value: ''
      },
      accountRules: {
        password: [
          {
            required: true,
            message: this.$t('validation.required', { _field_: this.$t('account.password') }),
            trigger: 'blur'
          }
        ],
        new_password: [
          {
            required: true,
            message: this.$t('validation.required', { _field_: this.$t('account.new_password') }),
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
    async handleSave() {
      this.errorResponse = []
      this.error = { key: null, value: '' }
      await this.validateForm()
      if (!this.isValid) {
        return
      }
      try {
        await this.$store.commit(INDEX_SET_LOADING, true)
        const dto = {
          password: this.accountForm.password,
          password_confirmation: this.accountForm.password_confirmation,
          name: this.accountForm.name
        }
        const data = await this.$store.dispatch(CHANGE_PASS, {
          ...dto
        })
        switch (data.statusCode) {
          case 202:
            this.$store.commit(INDEX_SET_SUCCESS, {
              show: true,
              text: data.message
            })
            this.$router.push('/profile')
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
