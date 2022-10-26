<template>
  <div class="main-login">
    <div>
      <div class="login login-width login-mobile">
        <h3 class="title text-center">{{ $t('home.add_event') }}</h3>
        <el-form
          ref="accountForm"
          :model="accountForm"
          :rules="accountRules"
          autocomplete="off"
          label-position="left"
          @keyup.enter.native="login"
        >
          <el-form-item class="email-login" prop="EventName" :error="(error.key === 'EventName') ? error.value : ''">
            <label for="email">{{ $t('event.EventName') }}</label>
            <el-input
              id="EventName"
              ref="EventName"
              v-model.trim="accountForm.EventName"
              :placeholder="$t('event.EventName')"
              autocomplete="off"
              name="EventName"
              type="text"
              tabindex="2"
              @focus="resetValidate('EventName')"
            />
          </el-form-item>
          <el-form-item class="email-login" prop="EventDescript" :error="(error.key === 'password') ? error.value : ''">
            <label for="password">{{ $t('event.EventDescript') }}</label>
            <el-input
              id="EventDescript"
              ref="EventDescript"
              v-model="accountForm.EventDescript"
              :autosize="{ minRows: 5, maxRows: 10}"
              :placeholder="$t('event.EventDescript')"
              type="textarea"
              name="EventDescript"
              tabindex="3"
              autocomplete="off"
              @focus="resetValidate('EventDescript')"
            >
            </el-input>
          </el-form-item>
          <div class="d-flex align-items-center forgot-pass">
            <div
              class="content cursor-pointer login-page__forgot-password align-items-center">
              <el-button class="add-member" @click="showAddMemberModal">{{ $t('event.add_member') }}</el-button>
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
                {{ $t('event.submit') }}
              </el-button>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <AddMemberModal
      v-show="addMember"
      :list-friend="listFriend"
      @close="closeAddMemberModal"
    >
    </AddMemberModal>
  </div>
</template>
<script>
import { GET_FRIEND_LIST, INDEX_SET_ERROR, INDEX_SET_LOADING } from '@/store/store.const'

export default {
  name: 'LoginPage',
  data() {
    return {
      token: '',
      user: {},
      accountForm: {
        EventName: '',
        password: '',
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
            message: this.$t('validation.required', { _field_: this.$t('event.EventName') }),
            trigger: 'blur'
          }
        ],
        EventDescript: [
          {
            required: true,
            message: this.$t('validation.required', { _field_: this.$t('event.EventDescript') }),
            trigger: 'blur'
          }
        ]
      },
      valid: false,
      loading: false,
      fullscreenLoading: false,
      isValid: false,
      addMember: false,
      listFriend: []
    }
  },
  computed: {
    disabledButton() {
      return this.accountForm.phone === '' || this.accountForm.password === ''
    }
  },
  created() {
    this.getListFriend()
  },
  methods: {
    resetValidate(ref) {
      if (ref === this.error.key) {
        this.error = { key: null, value: '' }
      }
      this.$refs.accountForm.fields.find((f) => f.prop === ref).clearValidate()
      this.accountForm.errors[ref] = ''
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
            await this.$router.push('/event')
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
    showAddMemberModal() {
      this.addMember = true
    },
    closeAddMemberModal() {
      this.addMember = false
    },
    async getListFriend() {
      this.$store.commit(INDEX_SET_LOADING, true)
      try {
        const response = await this.$store.dispatch(GET_FRIEND_LIST, 4)
        const { data, statusCode } = response
        if (statusCode === 202) {
          this.listFriend = data
        }
      } catch (e) {
        this.$store.commit(INDEX_SET_LOADING, false)
      }
      this.$store.commit(INDEX_SET_LOADING, false)
    }
  }
}
</script>
<style scoped lang="scss">
</style>
