<template>
  <div class="login otp login-mobile">
    <el-form
      ref="otpForm"
      style="padding-top: 10px"
      :model="otpForm"
      :rules="otpRules"
      autocomplete="off"
      label-position="left"
      @keyup.enter.native="checkOtp"
    >
      <!-- <div class="otp-title-register">{{ $t('otp.otpTitle') }}</div> -->
      <!-- <div class="otp-content-register">{{ $t('otp.otpContent') }}</div> -->
      <el-form-item class="">
        <br>
        <div class="otp-block-register" style="display: grid;text-align: center;grid-template-columns: repeat(6, minmax(0, 100%));column-gap: 20px;">
          <el-input
            v-for="index in lengthCode" :ref="'code-'+index" :key="index" v-model="otpForm.verifyCode[index-1]"
            name="code" type="text" oninput="this.value=this.value.replace(/[^0-9]/g,'');" pattern="[0-9]*"
            inputmode="numeric"
            class="'input-code input-code-mobile'" maxlength="1" @paste.native="handlePaste($event,index)"
            @keyup.native="handleCode(index, $event)"
          />
        </div>
        <!-- <div style="text-align: center" class="code-sent-email">
          <span class="notify-sent">{{ $t('otp.notifySent', { email: hideEmail }) }}</span>
        </div> -->
        <span class="resend text-[#727E96]">
          <span>{{ $t('otp.notReceived') }}</span>
          <span v-if="!isExpire">{{ $t('otp.reqCode1') }}</span>
          <span v-if="!isExpire" class="color-field text-red-500">{{
              $t('otp.reqCode2', { time: countTime })
            }}</span>
          <span
            v-else-if="!isResendOtp" :class="{'noselect':isResendOtp}" class="color-field cursor-pointer text-[#344874] "
            @click="resendOtp">{{
              $t('otp.resendCode')
            }}</span>
        </span>
      </el-form-item>
      <el-form-item>
        <div :class="{'disabled' : disabledButton, 'common-button': 'common-button'}">
          <el-button
            v-loading.fullscreen.lock="fullscreenLoading"
            :loading="loading"
            :disabled="disabledButton"
            @click.native="checkOtp"
          >
            {{ $t('otp.submit') }}
          </el-button>
        </div>
      </el-form-item>
      <!-- <div class="d-flex align-items-center text-center font-normal" style="margin-top: 1.5rem">
              <span>
                {{ $t('register.already_account') }}
              </span>
        <router-link to="/login" class="align-items-center color-orange cursor-pointer underline lowercase text-[#011A51]">
          {{ $t('account.login') }}
        </router-link>
      </div> -->
    </el-form>
  </div>
</template>
<script>
// import { mapState } from 'vuex'
import {
  PASS_CHECK_OTP,
  PASS_RESEND_OTP,
  AUTH_VERIFY_REGISTER_OTP,
  INDEX_SET_ERROR,
  INDEX_SET_LOADING,
  INDEX_SET_SUCCESS,
  LENGTH_CODE_OTP,
  OTP_EXPIRE,
  SET_IS_OPT_PAGE
  , TYPE_LOGIN_OTP
} from '@/store/store.const.js'

export default {
  name: 'OtpPassPage',
  // eslint-disable-next-line vue/require-prop-types,vue/prop-name-casing
  props: ['type', 'token', 'user_register', 'user_login'],
  data() {
    return {
      email: 'thachotoi@gmail.com',
      otpForm: {
        verifyCode: [],
        errors: {}
      },
      lengthCode: LENGTH_CODE_OTP,
      error: {
        key: null,
        value: ''
      },
      otpRules: {
        verifyCode: [
          {
            required: true,
            message: this.$t('validation.required', { _field_: this.$t('otp.error') }),
            trigger: 'blur'
          }
        ]
      },
      valid: false,
      loading: false,
      fullscreenLoading: false,
      countTime: OTP_EXPIRE,
      isExpire: false,
      isResendOtp: false,
      tokenLocal: ''
    }
  },
  computed: {
    // ...mapState(['email']),
    disabledButton() {
      if (this.otpForm.verifyCode.length < LENGTH_CODE_OTP) {
        return true
      }
      for (let i = 0; i < this.otpForm.verifyCode.length; i++) {
        if (this.otpForm.verifyCode[i] == null || !this.otpForm.verifyCode[i].toString().trim()) {
          return true
        }
      }
      return false
    },
    hideEmail() {
      // let email = this.email
      // if (this.email == null) {
      //   email = 'abcd@gmail.com'
      // }
      const email = '034abcasdfasdfd@234'
      let count = 0
      return email.replace(/(.{2})(.*)(?=@)/,
        function(gp1, gp2, gp3) {
          for (let i = 0; i < gp3.length; i++) {
            if (count < 10) {
              count++
              gp2 += '*'
            } else {
              return gp2
            }
          }
          return gp2
        })
    }
  },
  created() {
    this.tokenLocal = this.token
    this.$store.commit(SET_IS_OPT_PAGE, true)
    this.checkExpire()
  },
  methods: {
    resetValidate(ref) {
      if (ref === this.error.key) {
        this.error = { key: null, value: '' }
      }
      this.$refs.otpForm.fields.find((f) => f.prop === ref).clearValidate()
      this.otpForm.errors[ref] = ''
    },
    submit() {
      this.error = { key: null, value: '' }
      if (this.disabledButton) {
        return
      }
      this.$refs.otpForm.validate(async valid => {
        if (valid) {
          try {
            await this.$store.commit(INDEX_SET_LOADING, true)
            let { result } = {}
            if (this.type === TYPE_LOGIN_OTP) {
              result = await this.$auth.loginWith('local', {
                data: {
                  email: this.email,
                  token: this.tokenLocal,
                  code: this.getOtp()
                }
              })
            } else {
              result = await this.$store.dispatch(AUTH_VERIFY_REGISTER_OTP, {
                ...this.user_register,
                email: this.email,
                code: this.getOtp(),
                token: this.tokenLocal
              })
            }
            let data = {}
            if (this.type === TYPE_LOGIN_OTP) {
              data = result.data
            } else {
              data = result
            }
            if (data.status_code === 200) {
              await this.$store.commit(SET_IS_OPT_PAGE, false)
              await this.$store.commit(INDEX_SET_SUCCESS, {
                show: true,
                text: this.$t('noti.success'),
                message: this.$t('noti.register_success')
              })
              await this.$router.push('/login')
            } else {
              await this.$store.commit(INDEX_SET_ERROR, { show: true, text: data.message })
            }
          } catch (err) {
            await this.$store.commit(INDEX_SET_ERROR, { show: true, text: this.$t('message.message_error') })
          }
          await this.$store.commit(INDEX_SET_LOADING, false)
        }
      })
    },
    handleCode(index, e) {
      if (e.keyCode === 8 || e.keyCode === 46) {
        if (index > 1 && e.target.value === '') {
          this.$refs['code-' + (Number(index) - 1).toString()][0].focus()
        }
      } else {
        if (!e.target.value.trim()) {
          this.$refs['code-' + (Number(index)).toString()][0].$el.getElementsByTagName('input')[0].value = ''
          return
        }
        const codeBox = this.$refs['code-' + (Number(index)).toString()][0].$el.getElementsByTagName('input')[0]
        if (codeBox.value != null && codeBox.value && !isNaN(e.key)) {
          this.otpForm.verifyCode[index - 1] = Number(e.key)
          codeBox.value = Number(e.key)
        }
        const [first, ...rest] = e.target.value

        this.$refs['code-' + (Number(index)).toString()][0].$el.getElementsByTagName('input')[0].value = e.target.value
        e.target.value = first ?? ''
        const lastInputBox = index === LENGTH_CODE_OTP
        const insertedContent = first !== undefined
        if (insertedContent && !lastInputBox) {
          const nextCode = this.$refs['code-' + (Number(index) + 1).toString()][0]
          nextCode.focus()
          nextCode.$el.value = rest.join('')
        }
      }
    },
    handlePaste(e, index) {
      const data = e.clipboardData.getData('text')
      let count = 0
      for (let i = index, j = 0; i <= this.lengthCode && j < data.length; i++, j++) {
        if (isNaN(data.charAt(j))) {
          --i
          continue
        }
        this.$refs['code-' + (Number(i)).toString()][0].$el.getElementsByTagName('input')[0].value = data.charAt(j)
        this.otpForm.verifyCode[i - 1] = data.charAt(j)
        count = i - 1
        if (count < this.lengthCode) {
          const nextCode = this.$refs['code-' + (Number(count) + 1).toString()][0]
          nextCode.focus()
        }
      }
    },
    async changeModal(state) {
      await this.$emit('change', state)
    },
    checkExpire() {
      this.countTime = Number(OTP_EXPIRE)
      const interval = setInterval(() => {
        this.countTime--
        if (this.countTime < 0) {
          this.isExpire = true
          clearInterval(interval)
        }
      }, 1000)
    },
    checkOtp() {
      this.$refs.otpForm.validate(async valid => {
        if (valid) {
          try {
            await this.$store.commit(INDEX_SET_LOADING, true)

            const data = await this.$store.dispatch(PASS_CHECK_OTP, {
              'Phone': this.user_register,
              'Enter': this.getOtp()
            })
            switch (data.statusCode) {
              case 202:
                this.$store.commit(INDEX_SET_SUCCESS, {
                  show: true,
                  text: data.message
                })
                this.$emit('changeStep', 3)
                break
              case 406:
                this.$store.commit(INDEX_SET_ERROR, {
                  show: true,
                  text: data.message
                })
                break
              default:
                this.$store.commit(INDEX_SET_ERROR, { show: true, text: data.message })
                break
            }
          } catch (err) {
            this.$store.commit(INDEX_SET_ERROR, { show: true, text: this.$t('message.message_error') })
          }
          this.$store.commit(INDEX_SET_LOADING, false)
        }
      })
    },
    async resendOtp() {
      this.isResendOtp = true
      this.error = { key: null, value: '' }
      try {
        this.$store.commit(INDEX_SET_LOADING, true)
        const data = await this.$store.dispatch(PASS_RESEND_OTP, {
          phone: this.user_register
        })
        switch (data.statusCode) {
          case 202:
            this.$store.commit(INDEX_SET_SUCCESS, {
              show: true,
              text: data.message
            })
            setTimeout(() => {
              this.isResendOtp = false
              this.isExpire = false
              this.checkExpire()
            }, 1000)
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
    getOtp() {
      return this.otpForm.verifyCode.join('').toString()
    },
    onlyNumber($event, index) {
      const keyCode = ($event.keyCode ? $event.keyCode : $event.which)
      if ((keyCode < 48 || keyCode > 57)) {
        $event.preventDefault()
      } else {
        this.$refs.optCode[index < 5 ? index + 1 : 5].focus()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.el-form-item__label {
  width: auto !important;
}
</style>
