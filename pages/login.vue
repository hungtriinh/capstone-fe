<template>
  <div class="main-login">
    <div>
      <div class="login login-width login-mobile">
        <h3 class="title text-center">{{ $t('account.login_title') }}</h3>
        <el-form
          ref="accountForm"
          :model="accountForm"
          :rules="accountRules"
          autocomplete="off"
          label-position="left"
          @keyup.enter.native="login"
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
            />
          </el-form-item>
          <el-form-item class="email-login" prop="password" :error="(error.key === 'password') ? error.value : ''">
            <label for="password">{{ $t('account.password') }}</label>
            <el-input
              id="password"
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
              <i slot="suffix" class="cursor-pointer" @click="displayPass()">
                <img v-if="showPass" class="icon-show-pass" src="~/assets/images/icons/eye-input.svg" alt="showpass"/>
                <img v-else class="icon-show-pass" src="@/assets/images/icons/hide-eye.svg" alt="hidepass"/>
              </i>
            </el-input>
          </el-form-item>

<!--          <el-form-item :error="(error.key === 'g-recaptcha-response') ? error.value : ''" prop="captcha" class="captcha">-->
<!--            <template>-->
<!--              <recaptcha-->
<!--                ref="captcha"-->
<!--                @error="onError"-->
<!--                @success="onSuccess"-->
<!--                @expired="onExpired"-->
<!--              />-->
<!--            </template>-->
<!--          </el-form-item>-->
          <div class="d-flex align-items-center forgot-pass">
            <div
              class="content cursor-pointer login-page__forgot-password align-items-center" @click="$router.push('/forgot-pass')">
              {{ $t('account.forgot_password') }}
            </div>
          </div>
          <el-form-item>
            <div :class="{'disabled' : disabledButton, 'common-button': 'common-button'}">
              <el-button
                v-loading.fullscreen.lock="fullscreenLoading"
                :loading="loading"
                :disabled="disabledButton"
                @click.native="login"
              >
                {{ $t('account.login') }}
              </el-button>
            </div>
          </el-form-item>
          <div class="d-flex align-items-center no_account">
            <div
              class="content text-center cursor-pointer login-page__forgot-password align-items-center" @click="step=3">
              {{ $t('account.no_account') }} <span class="here" @click="handeRegister">{{ $t('account.here')  }}</span>
            </div>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import { INDEX_SET_ERROR, INDEX_SET_LOADING } from '@/store/store.const'
import { validPhoneNoPrefix } from '@/utils/validate'

export default {
  name: 'LoginPage',
  layout: 'none',
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

    // const validateCaptcha = (rule, value, callback) => {
    //   if (this.captcha == null || !this.captcha) {
    //     callback(new Error(this.$t('validation.captcha_req')))
    //   } else {
    //     callback()
    //   }
    // }
    return {
      token: '',
      user: {},
      accountForm: {
        phone: '0955419015',
        password: 'quangduy12',
        remember: '',
        errors: {}
      },
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
        ],
        password: [
          {
            required: true,
            message: this.$t('validation.required', { _field_: this.$t('account.password') }),
            trigger: 'blur'
          }
        ],
        remember: []
      },
      valid: false,
      loading: false,
      fullscreenLoading: false,
      showPass: false,
      isValid: false
    }
  },
  computed: {
    disabledButton() {
      return this.accountForm.phone === '' || this.accountForm.password === ''
    }
  },
  methods: {
    handeRegister() {
      this.$router.push('/register')
    },
    resetValidate(ref) {
      if (ref === this.error.key) {
        this.error = { key: null, value: '' }
      }
      this.$refs.accountForm.fields.find((f) => f.prop === ref).clearValidate()
      this.accountForm.errors[ref] = ''
    },
    checkCapslock(e, attr) {
      const { key } = e
      this[attr] = key && key.length === 1 && (key >= 'A' && key <= 'Z')
    },
    async login() {
      this.error = { key: null, value: '' }
      this.validateForm()
      if (!this.isValid) {
        return
      }

      try {
        await this.$store.commit(INDEX_SET_LOADING, true)
        const result = await this.$auth.loginWith('local', {
          data: {
            phoneNumber: this.accountForm.phone,
            password: this.accountForm.password
          }
        })

        const data = result.data
        switch (data.statusCode) {
          case 202:
            await this.$router.push('/')
            break
          default:
            this.$store.commit(INDEX_SET_ERROR, { show: true, text: 'Lỗi !', message: data.message })
            break
        }
      } catch (err) {
        this.$store.commit(INDEX_SET_ERROR, { show: true, text: 'Lỗi !', message: this.$t('message.message_error') })
      }
      await this.$store.commit(INDEX_SET_LOADING, false)
    },
    validateForm() {
      this.$refs.accountForm.validate(valid => {
        this.isValid = valid
      })
    },
    displayPass() {
      this.showPass = !this.showPass
    },
    closeModalErr() {
      this.isAuthErr = false
    }
  }
}
</script>
<style scoped lang="scss">
</style>
