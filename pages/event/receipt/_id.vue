<template>
  <div class="main-login">
    <div>
      <div class="login login-width login-mobile">
        <h3 class="title text-center">{{ $t('home.add_receipt') }}</h3>
        <el-form
          ref="accountForm"
          :model="accountForm"
          :rules="accountRules"
          autocomplete="off"
          label-position="left"
          @keyup.enter.native="login"
        >
          <el-form-item class="email-login"   prop="receiptName" :error="(error.key === 'receiptName') ? error.value : ''">
            <label for="email">{{ $t('receipt.name') }}</label>
            <el-input
              id="receiptName"
              ref="receiptName"
              v-model.trim="accountForm.receiptName"
              :placeholder="$t('receipt.name')"
              autocomplete="off"
              name="receiptName"
              type="text"
              tabindex="2"
              @focus="resetValidate('receiptName')"
            />
          </el-form-item>
          <el-form-item class="email-login" prop="receiptAmount" :error="(error.key === 'password') ? error.value : ''">
            <label for="password">{{ $t('receipt.amount') }}</label>
            <el-input
              id="receiptAmount"
              ref="receiptAmount"
              v-model="accountForm.receiptAmount"
              :placeholder="$t('receipt.amount')"
              type="text"
              name="receiptAmount"
              tabindex="3"
              autocomplete="off"
              @focus="resetValidate('receiptAmount')"
            >
            </el-input>
          </el-form-item>
          <div class="d-flex align-items-center forgot-pass">
            <div
              class="content cursor-pointer login-page__forgot-password align-items-center">
              <el-button class="" @click="showAddMemberModal">{{ $t('receipt.add_member') }}</el-button>
            </div>
          </div>
          <div class="radio-check">
            <el-radio v-model="type" label="1">{{ $t('receipt.balance') }}</el-radio>
            <el-radio v-model="type" label="2">{{ $t('receipt.not_balance') }}</el-radio>
          </div>
          <div >
            <div v-for="(item, key) in chooseMember" :key="key" class="checkbox-item">
              <img class="avatar" src="@/assets/images/event.png" alt="">
              <div>
                <span class="text-bold">{{ item.userName }}</span><br>
              </div>
              <el-input
                v-if="type === '2'"
                id="debit"
                ref="debit"
                v-model.trim="item.debit"
                autocomplete="off"
                name="debit"
                type="text"
                tabindex="2"
                :placeholder="$t('receipt.amount_placeholder')"
                ></el-input>
              <el-input
                v-else
                id="debit"
                ref="debit"
                :value="accountForm.receiptAmount ? accountForm.receiptAmount / chooseMember.length : ''"
                autocomplete="off"
                name="debit"
                type="text"
                tabindex="2"
                :placeholder="$t('receipt.amount_placeholder')"
              ></el-input>
            </div>
          </div>
          <el-form-item>
            <div :class="{'disabled' : disabledButton, 'common-button': 'common-button'}">
              <el-button
                v-loading.fullscreen.lock="fullscreenLoading"
                :loading="loading"
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
  CREATE_RECEIPT,
  GET_MEMBER_LIST,
  INDEX_SET_ERROR,
  INDEX_SET_LOADING, INDEX_SET_SUCCESS
} from '~/store/store.const'

export default {
  name: 'CreateReceiptPage',
  data() {
    return {
      token: '',
      user: {},
      type: '1',
      amount: '',
      chooseMember: [],
      accountForm: {
        receiptName: '',
        receiptAmount: '',
        debit: '',
        errors: {}
      },
      error: {
        key: null,
        value: ''
      },
      accountRules: {
        receiptName: [
          {
            required: true,
            message: this.$t('validation.required', { _field_: this.$t('receipt.name') }),
            trigger: 'blur'
          }
        ],
        receiptAmount: [
          {
            required: true,
            message: this.$t('validation.required', { _field_: this.$t('receipt.amount') }),
            trigger: 'blur'
          }
        ]
      },
      valid: false,
      loading: false,
      fullscreenLoading: false,
      isValid: false,
      addMember: false,
      listId: [],
      listFriend: []
    }
  },
  computed: {
    ...mapState(['listFriends']),
    disabledButton() {
      return this.accountForm.receiptName === '' || this.accountForm.receiptAmount === ''
    }
  },
  watch: {
    listFriends() {
      this.listFriend.forEach((element) => {
        if (this.listFriends.includes(element.userId)) {
          this.chooseMember.push(element)
        }
      })
    }
    // type() {
    //   if (this.type === 1) {
    //
    //   }
    // }
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
      console.log(this.chooseMember)
      // this.error = { key: null, value: '' }
      // this.validateForm()
      // if (!this.isValid) {
      //   return
      // }
      try {
        await this.$store.commit(INDEX_SET_LOADING, true)
        const dto = this.accountForm
        dto.eventLogo = ''
        dto.MemberIds = this.listFriends
        dto.userId = 7
        dto.eventId = this.$route.params.id
        dto.userDepts = JSON.parse(JSON.stringify(this.chooseMember))
        if (this.type === '1') {
          dto.userDepts.forEach((element) => {
            element.debit = this.accountForm.receiptAmount ? this.accountForm.receiptAmount / this.chooseMember.length : ''
          })
        }
        const data = await this.$store.dispatch(CREATE_RECEIPT, dto)
        switch (data.statusCode) {
          case 202:
            this.$store.commit(INDEX_SET_SUCCESS, {
              show: true,
              text: data.message
            })
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
        const response = await this.$store.dispatch(GET_MEMBER_LIST, this.$route.params.id)
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
