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
          <div class="content-input image-avatar" ref="imageAvatar">
            <el-form-item label="" prop="imageAvatar" :error="(error.key === 'imageAvatar') ? error.value : ''">
              <div class="d-flex show-avatar">
                <div class="show-detail">
                  <img id="img-avatar" class="show-image" :src="imageAvatarShow ? imageAvatarShow : '/assets/icon/icon_user_default.svg'" alt="">
                  <img v-if="imageAvatarShow" class="image-close" src="/assets/icon/icon_close_image.svg" alt="" @click="removeAvatar">
                </div>
                <input id="upload-avatar" ref="fileUploadAvatar" class="d-none" type="file" @change="onFileChange" accept=".jpeg, .jpg, .png, .svg">
                <div class="button-upload">
                  <button type="button"><label for="upload-avatar">{{ $t('event.upload_image') }}</label></button>
                </div>
              </div>
            </el-form-item>
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
      imageAvatarShow: '',
      token: '',
      user: {},
      type: '1',
      amount: '',
      chooseMember: [],
      accountForm: {
        avatar: '',
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
    removeAvatar() {
      this.imageAvatarShow = ''
      this.accountForm.avatar = ''
    },
    checkFile(file) {
      const allowedExtensions = /(\.jpg|\.jpeg|\.png|\.svg)$/i
      if (file.size >= 20000000) {
        return this.$t('validation.err003')
      }
      if (!['image/jpeg', 'image/png', 'image/jpg', 'image/svg'].includes(file.type) && !allowedExtensions.exec(file.name)) {
        return this.$t('validation.err005')
      }
      return ''
    },
    async onFileChange(e) {
      const file = e.target.files[0]
      const valid = this.checkFile(file)
      if (valid) {
        await this.$store.commit(INDEX_SET_ERROR, { show: true, text: valid })
      } else {
        this.imageAvatarShow = URL.createObjectURL(file)
        this.file = file
        await this.upLoadFile('avatar_banner')
      }
      this.$refs.fileUploadAvatar.value = null
    },
    async upLoadFile(type) {
      // const formData = new FormData()
      // formData.append('image', this.file)
      // formData.append('type', type)
      //
      // const data = await this.$store.dispatch(USER_UPLOAD_AVATAR, formData)
      // switch (data.status_code) {
      //   case 200:
      //     this.accountForm.avatar = data.data.url
      //     break
      //   case 422:
      //     for (const [key] of Object.entries(data.data)) {
      //       this.error = { key: key === 'image' ? 'imageAvatar' : key, value: data.data[key][0] }
      //     }
      //     break
      //   case 500:
      //     await this.$store.commit(INDEX_SET_ERROR, {
      //       show: true,
      //       text: this.$t('content.EXC_001')
      //     })
      //     break
      //   default:
      //     await this.$store.commit(INDEX_SET_ERROR, { show: true, text: data.messages })
      //     break
      // }
    },
    resetValidate(ref) {
      if (ref === this.error.key) {
        this.error = { key: null, value: '' }
      }
      this.$refs.accountForm.fields.find((f) => f.prop === ref).clearValidate()
      this.accountForm.errors[ref] = ''
    },
    async create() {
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
