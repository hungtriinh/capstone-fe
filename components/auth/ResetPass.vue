<template>
  <div class="main-login">
    <div>
        <el-form
          ref="accountForm"
          :model="accountForm"
          :rules="accountRules"
          label-position="left"
          @keyup.enter.native="register"
        >
          <el-form-item
            class="email-login" :label="$t('account.new_password')" prop="password"
            :error="getErrResponse('password')">
            <el-input
              ref="password"
              v-model="accountForm.password"
              :placeholder="$t('account.new_password')"
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
            class="email-login" :label="$t('account.password_new_confirmation')" prop="password_confirmation"
            :error="getErrResponse('password_confirmation')">
            <el-input
              ref="password_confirmation"
              v-model="accountForm.password_confirmation"
              :placeholder="$t('account.password_new_confirmation')"
              name="password_confirmation"
              :type="showPassConfirm?'text':'password'"
              tabindex="3"
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
          <el-form-item>
            <div :class="{'disabled' : disabledButton, 'common-button': 'common-button'}">
              <el-button
                v-loading.fullscreen.lock="fullscreenLoading"
                :loading="loading"
                type="custom-primary"
                :disabled="disabledButton"
                @click.native="reset"
              >
                {{ $t('account.reset') }}
              </el-button>
            </div>
          </el-form-item>
          <!-- <div class="d-flex align-items-center text-center" style="margin-top: 1.5rem">
              <span>
                {{ $t('account.back') }}
              </span>
            <router-link to="/" class="align-items-center cursor-pointer underline lowercase">
              {{ $t('account.home') }}
            </router-link>
          </div> -->
        </el-form>
      </div>
    </div>
</template>
<script>
import { mapState } from 'vuex'
// import { INDEX_SET_ERROR, INDEX_SET_LOADING, INDEX_SET_SUCCESS } from '@/store/store.const'
import { validPassword } from '@/utils/validate'

export default {
  name: 'ResetPasswordPage',
  data() {
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
    return {
      token: '',
      user: {},
      accountForm: {
        password: '',
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
      showPass: false,
      showPassConfirm: false
    }
  },
  computed: {
    ...mapState(['language']),
    disabledButton() {
      if (!this.isMounted) {
        return
      }
      return this.accountForm.password === '' ||
        this.accountForm.password_confirmation === ''
    }
  },
  watch: {
    language() {
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
      this.accountRules = {
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
        ]
      }
    }
  },
  async created() {
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
    async reset() {
      this.errorResponse = []
      this.error = { key: null, value: '' }
      await this.validateForm()
      // if (!this.isValid) {
      //   return
      // }
      // try {
      //   await this.$store.commit(INDEX_SET_LOADING, true)
      //   // const dto = {
      //   //   token: this.token,
      //   //   password: this.accountForm.password,
      //   //   password_confirmation: this.accountForm.password_confirmation
      //   // }
      // } catch (err) {
      //   this.$store.commit(INDEX_SET_ERROR, { show: true, text: this.$t('message.message_error') })
      // }
      // this.$store.commit(INDEX_SET_LOADING, false)
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
