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
          @keyup.enter.native="create"
        >
          <el-form-item class="email-login" prop="eventName" :error="(error.key === 'eventName') ? error.value : ''">
            <label for="email">{{ $t('event.eventName') }}</label>
            <el-input
              id="eventName"
              ref="eventName"
              v-model="accountForm.eventName"
              :placeholder="$t('event.eventName')"
              autocomplete="off"
              show-word-limit
              maxlength="256"
              name="eventName"
              type="text"
              tabindex="2"
              @focus="resetValidate('eventName')"
            />
          </el-form-item>
          <el-form-item class="email-login" prop="eventDescript" :error="(error.key === 'password') ? error.value : ''">
            <label for="password">{{ $t('event.eventDescript') }}</label>
            <el-input
              id="eventDescript"
              ref="eventDescript"
              v-model="accountForm.eventDescript"
              :autosize="{ minRows: 5, maxRows: 10}"
              :placeholder="$t('event.eventDescript')"
              type="textarea"
              name="eventDescript"
              tabindex="3"
              autocomplete="off"
              show-word-limit
              maxlength="1000"
              @focus="resetValidate('eventDescript')"
            >
            </el-input>
          </el-form-item>
          <div class="d-flex align-items-center forgot-pass">
            <div
              class="content cursor-pointer login-page__forgot-password align-items-center">
              <el-button type="primary" class="add-member" @click="showAddMemberModal">{{ $t('event.add_member') }}</el-button>
            </div>
          </div>
          <el-card  v-for="(receipt, key) in listDisplay" :key="key" :body-style="{ padding: '10px' }" class=" card-item mb-10 ">
            <div class="d-flex justify-between">
              <div class="d-flex gap-10 items-center">
                <div v-if="receipt.userAvatar">
                  <el-image class="image-avatar" :preview-src-list="[receipt.userAvatar]" :src="receipt.userAvatar"/>
                </div>
                <div v-else>
                  <ShowAvatarElement :event="{ name: receipt.userName }"></ShowAvatarElement>
                </div>
                <div>
                  <span class="text-bold">{{ receipt.userName }}</span><br>
                  <span class="time">{{ receipt.userPhone }}</span>
                </div>
              </div>
            </div>
          </el-card>
          <el-form-item>
            <div :class="{'disabled' : disabledButton, 'common-button': 'common-button'}">
              <el-button
                type="primary"
                v-loading.fullscreen.lock="fullscreenLoading"
                :loading="loading"
                :disabled="disabledButton"
                @click.native="create"
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
      :list-id="listId"
      @close="closeAddMemberModal"
    >
    </AddMemberModal>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import {
  CREATE_EVENT,
  GET_FRIEND_LIST,
  INDEX_SET_ERROR,
  INDEX_SET_LOADING, INDEX_SET_SUCCESS
} from '@/store/store.const'

export default {
  name: 'LoginPage',
  middleware: 'auth',
  data() {
    const validateLength = (rule, value, callback, message) => {
      console.log('ádfsdf')
      if (value && value.length > 256) {
        callback(new Error(message))
      } else {
        callback()
      }
    }

    const validateLengthArea = (rule, value, callback, message) => {
      if (value && value.length > 1000) {
        callback(new Error(message))
      } else {
        callback()
      }
    }
    const validRequired = (rule, value, callback, message) => {
      if (!value || value.trim() === '') {
        callback(new Error(message))
      } else {
        callback()
      }
    }
    return {
      token: '',
      user: {},
      accountForm: {
        eventName: '',
        eventDescript: '',
        errors: {}
      },
      error: {
        key: null,
        value: ''
      },
      accountRules: {
        eventName: [
          {
            required: true,
            message: this.$t('validation.required', { _field_: this.$t('event.eventName') }),
            trigger: 'blur'
          },
          { validator: validRequired, message: this.$t('validation.required', { _field_: this.$t('event.eventName') }), trigger: 'blur' },
          { validator: validateLength, message: this.$t('validation.max', { _field_: this.$t('event.eventName') }), trigger: 'blur' }
        ],
        eventDescript: [
          { validator: validateLengthArea, message: this.$t('validation.max_1000', { _field_: this.$t('event.eventDescript') }), trigger: 'blur' }
        ]
      },
      valid: false,
      loading: false,
      fullscreenLoading: false,
      isValid: false,
      addMember: false,
      listId: [],
      listDisplay: [],
      listFriend: []
    }
  },
  computed: {
    ...mapState(['listFriends']),
    disabledButton() {
      return this.accountForm.eventName === ''
    }
  },
  watch: {
    listFriends(newValue, oldValue) {
      const listDisplay = []
      this.listFriend.forEach((element) => {
        if (this.listFriends.includes(element.userId)) {
          listDisplay.push(element)
        }
      })
      this.listDisplay = listDisplay
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
    async create() {
      try {
        await this.$store.commit(INDEX_SET_LOADING, true)
        const dto = this.accountForm
        dto.eventLogo = ''
        dto.MemberIds = this.listFriends
        const data = await this.$store.dispatch(CREATE_EVENT, dto)
        switch (data.statusCode) {
          case 202:
            this.$store.commit(INDEX_SET_SUCCESS, {
              show: true,
              text: data.message
            })
            this.$cookies.set('eventUrl', data.data.EventUrl)
            this.$router.push('/qr/' + data.data.EventId)
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
        const response = await this.$store.dispatch(GET_FRIEND_LIST)
        const { data, statusCode } = response
        if (statusCode === 202) {
          this.listFriend = data
          this.listFriend.forEach((element) => {
            this.listId.push(element.userId)
          })
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
