<template>
  <div class="main-login">
    <div>
      <div class="login login-width login-mobile">
        <h3 class="title text-center text-[#011A51]">{{ $t('account.reset_password') }}</h3>
        <h4 v-if="step===1" class="sub_title text-center text-[#727E96]">{{ getTitle }}</h4>
        <div class="d-flex justify-center pt-8">
          <img :src="getBackgroundImage" alt="">
        </div>
        <el-form
          v-if="step===1"
          ref="accountForm"
          :model="accountForm"
          :rules="accountRules"
          class="pt-8"
          autocomplete="off"
          label-position="left"
          @keydown.enter.native.prevent="submit"
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
                type="custom-primary"
                :disabled="disabledButton"
                @click.native="submit"
              >
                {{ $t('account.send') }}
              </el-button>
            </div>
          </el-form-item>
        </el-form>
        <div v-if="step===2" class="otp">
          <otp-page :type="typeVerify" :token="token" :user_register="user"></otp-page>
        </div>
        <div v-if="step===3" class="otp">
          <reset-pass :type="typeVerify" :token="token" :user_register="user"></reset-pass>
        </div>
        <div class="d-flex align-items-center text-center font-normal" style="margin-top: 1.5rem">
              <span class="pr-[4px]">
                {{ $t('account.back') }}
              </span>
            <span @click="$router.push('/login')" class="align-items-center cursor-pointer underline lowercase text-[#344874]">
              Đăng nhập
            </span>
          </div>
      </div>
    </div>
  </div>
</template>
<script>
import { INDEX_SET_ERROR, INDEX_SET_LOADING, INDEX_SET_SUCCESS, AUTH_SEND_EMAIL_FORGOT } from '@/store/store.const'
import { validEmail } from '@/utils/validate'
import OtpPage from '@/components/auth/otp'
import ResetPass from '~/components/auth/ResetPass'

export default {
  name: 'ForgotPage',
  // middleware: 'auth-guard',
  components: {
    OtpPage,
    ResetPass
  },
  layout: 'none',
  data() {
    const validdateEmail = (rule, value, callback) => {
      if (!validEmail(value)) {
        callback(new Error(this.$t('validation.email_format')))
      } else {
        callback()
      }
    }

    return {
      step: 1,
      token: '',
      user: {},
      accountForm: {
        email: '',
        errors: {}
      },
      error: {
        key: null,
        value: ''
      },
      accountRules: {
        email: [
          {
            required: true,
            message: this.$t('validation.required', { _field_: this.$t('account.email') }),
            trigger: 'blur'
          },
          {
            validator: validdateEmail, trigger: 'blur'
          }
        ]
      },
      valid: false,
      capsToolPasswordTip: false,
      loading: false,
      fullscreenLoading: false,
      showPass: false,
      isValid: false,
      isAuthErr: false
    }
  },
  computed: {
    disabledButton() {
      return this.accountForm.email === ''
    },
    getTitle() {
      if (this.step === 1) {
        return this.$t('account.forgot_password')
      } else if (this.step === 2) {
        return this.$t('register.write_code')
      } else {
        return this.$t('register.reset_pass')
      }
    },
    getBackgroundImage() {
      return require(`~/assets/images/forgot-pass/forgot-pass-icon-${this.step}.svg`)
    }
  },
  methods: {
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
    async submit() {
      this.error = { key: null, value: '' }
      this.validateForm()
      if (!this.isValid) {
        return
      }
      try {
        this.$store.commit(INDEX_SET_LOADING, true)
        const data = await this.$store.dispatch(AUTH_SEND_EMAIL_FORGOT,
          { email: this.accountForm.email })

        switch (data.status_code) {
          case 200:
            this.$store.commit(INDEX_SET_SUCCESS, {
              show: true,
              text: this.$t('noti.success'),
              message: this.$t('noti.send_mail_forgot')
            })
            this.accountForm.email = ''
            break
          default:
            this.$store.commit(INDEX_SET_ERROR, { show: true, text: 'Lỗi', message: data.message })
            break
        }
      } catch (err) {
        this.$store.commit(INDEX_SET_ERROR, { show: true, text: 'Lỗi', message: this.$t('message.message_error') })
      }
      this.$store.commit(INDEX_SET_LOADING, false)
    },
    validateForm() {
      this.$refs.accountForm.validate(valid => {
        this.isValid = valid
      })
    },
    closeModalErr() {
      this.isAuthErr = false
    }
  }
}
</script>
<style lang="scss">
/* stylelint-disable */
.custom-register-input .el-input--prefix .el-input__inner {
  padding-left: 80px;
}
/* stylelint-enable */
</style>
