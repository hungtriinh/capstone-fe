<template>
  <div class="main-login">
    <div>
      <div class="login login-width login-mobile">
        <el-page-header :content="$t('home.add_receipt')" @back="handleRouter('/event/detail/' + id)">
        </el-page-header>
        <div class="main-content">

          <el-form
          ref="accountForm"
          :model="accountForm"
          :rules="accountRules"
          autocomplete="off"
          label-position="left"
          @keyup.enter.native="login"
        >
          <el-form-item class="email-login" style="margin-bottom: 5px" prop="receiptName" :error="(error.key === 'receiptName') ? error.value : ''">
            <label for="email">Tên chứng từ</label>
            <el-input
              id="receiptName"
              ref="receiptName"
              v-model="accountForm.receiptName"
              :placeholder="'Tên chứng từ'"
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
              oninput="this.value=this.value.replace(/[^0-9]/g,'');" pattern="[0-9]*"
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
              <el-button type="primary" class="" @click="showAddMemberModal">{{ $t('receipt.add_member') }}</el-button>
            </div>
          </div>
          <div class="radio-check">
            <el-radio v-model="type" label="1">{{ $t('receipt.balance') }}</el-radio>
            <el-radio v-model="type" label="2">{{ $t('receipt.not_balance') }}</el-radio>
          </div>
<!--            <div class="time text-red mb-10">Số tiền sẽ được chia cho cả bạn</div>-->
            <div v-if="type !== '2' && accountForm.receiptAmount">
              <div class="checkbox-item">
                <div v-if="$auth.user.Avatar">
                  <el-image class="image-avatar" :preview-src-list="[$auth.user.Avatar]" :src="$auth.user.Avatar"/>
                </div>
                <div v-else>
                  <ShowAvatarElement :event="{ name: $auth.user.UserName }"></ShowAvatarElement>
                </div>
                <div>
                  <span class="text-bold">{{ $auth.user.UserName}} <el-tag type="primary">Tôi</el-tag></span><br>
                  <span class="text-bold">{{ $auth.user.PhoneNumber }}</span><br>
                </div>
                <el-input
                  disabled
                  id="debit"
                  ref="debit"
                  :value="accountForm.receiptAmount ? accountForm.receiptAmount - (Math.floor(accountForm.receiptAmount / (chooseMember.length + 1) * chooseMember.length)) : ''"
                  autocomplete="off"
                  name="debit"
                  type="text"
                  tabindex="2"
                  placeholder="Số tiền"
                ></el-input>
              </div>
            </div>

            <div v-if="type !== '1' && accountForm.receiptAmount">
              <div class="checkbox-item">
                <div v-if="$auth.user.Avatar">
                  <el-image class="image-avatar" :preview-src-list="[$auth.user.Avatar]" :src="$auth.user.Avatar"/>
                </div>
                <div v-else>
                  <ShowAvatarElement :event="{ name: $auth.user.UserName }"></ShowAvatarElement>
                </div>
                <div>
                  <span class="text-bold">{{ $auth.user.UserName}} <el-tag type="primary">Tôi</el-tag></span><br>
                  <span class="text-bold">{{ $auth.user.PhoneNumber }}</span><br>
                </div>
                <el-form-item>

                <el-input
                  id="debit"
                  ref="fake"
                  autocomplete="off"
                  oninput="this.value=this.value.replace(/[^0-9]/g,'');" pattern="[0-9]*"
                  disabled
                  :value="accountForm.receiptAmount - total_count"
                  name="debit"
                  type="text"
                  tabindex="2"
                  placeholder="Số tiền"
                ></el-input>
                </el-form-item>
              </div>
            </div>

            <div >
            <div v-for="(item, key) in chooseMember" :key="key" class="checkbox-item">
              <div v-if="item.userAvatar">
                <el-image class="image-avatar" :preview-src-list="[item.userAvatar]" :src="item.userAvatar"/>
              </div>
              <div v-else>
                <ShowAvatarElement :event="{ name: item.userName }"></ShowAvatarElement>
              </div>

              <div>
                <span class="text-bold">{{ item.userName }}</span><br>
                <span class="text-bold">{{ item.userPhone }}</span><br>
              </div>
              <el-form-item  :error="checkDebt(item.debt) === '' ? '' : checkDebt(item.debt)" >

              <el-input
                v-if="type === '2'"
                id="debit_price"
                ref="debit_price"
                v-model.trim="item.debt"
                oninput="this.value=this.value.replace(/[^0-9]/g,'');" pattern="[0-9]*"
                autocomplete="off"
                name="debit"
                type="text"
                tabindex="2"
                placeholder="Số tiền"
                ></el-input>
              <el-input
                v-else
                disabled
                id="debit"
                ref="debit"
                :value="accountForm.receiptAmount ? Math.floor(accountForm.receiptAmount / (chooseMember.length + 1)) : ''"
                autocomplete="off"
                name="debit"
                type="text"
                tabindex="2"
                placeholder="Số tiền"
              ></el-input>
              </el-form-item>
            </div>
          </div>
          <div ref="imageAvatar" class="content-input image-avatar-input">
            <el-form-item ref="imageDetail" label="" prop="imageDetail" :error="(error.key === 'image') ? error.value : ''">
              <input :class="{'disabledImg' : disableImgUp}" :disabled="disableImgUp" id="upload-detail" ref="fileUploadDetail" style="display: none" type="file" max="3" multiple accept=".jpeg, .jpg, .png, .svg" @change="onFileChangeDetail">
              <img v-if="!imageDetailShow.length" src="/assets/icon/icon_user_default.svg" alt="">
              <div v-if="imageDetailShow.length" class="d-flex show-avatar">
                <div v-for="(detail, index) in imageDetailShow" :key="index" class="show-detail">
                  <img id="img-intro" class="show-image" :src="detail ? detail : '/assets/icon/icon_user_default.svg'" alt="">
                  <img class="image-close" src="/assets/icon/icon_close_image.svg" alt="" @click="removeImage(index)">
                </div>
              </div>
              <div class="button-upload">
                <button :class="{'disabledImg' : disableImgUp}" type="button"><label :class="{'disabledImg' : disableImgUp}" for="upload-detail">Thêm ảnh chứng từ</label></button>
              </div>
            </el-form-item>
          </div>
          <el-form-item>
            <div style="margin-bottom: 60px " :class="{'disabled' : disabledButton, 'common-button': 'common-button'}">
              <el-button
                v-loading.fullscreen.lock="fullscreenLoading"
                type="primary"
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
    </div>
    <AddNewMemberModal
      v-show="addMember"
      :list-friend="listFriend"
      :list-id="listId"
      @close="closeAddMemberModal"
    >
    </AddNewMemberModal>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import {
  CREATE_RECEIPT,
  GET_MEMBER_LIST,
  INDEX_SET_ERROR,
  INDEX_SET_LOADING, INDEX_SET_SUCCESS,
  IMAGE_UPLOAD_RECEIPT
} from '~/store/store.const'

export default {
  name: 'CreateReceiptPage',
  middleware: 'auth',
  data() {
    const validPrice = (rule, value, callback) => {
      if (value && (value % 1000 !== 0 || Number(value) === 0)) {
        callback(new Error('Số tiền phải khác 0 và là bội của 1000'))
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
      fake: '',
      id: this.$route.params.id,
      imageDetailShow: [],
      token: '',
      user: {},
      type: '1',
      amount: '',
      message: '',
      chooseMember: [],
      accountForm: {
        debit_price: '',
        fake: '',
        imageDetail: [],
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
            message: this.$t('validation.required', { _field_: 'Tên chứng từ' }),
            trigger: 'blur'
          },
          { validator: validRequired, message: this.$t('validation.required', { _field_: 'Tên chứng từ' }), trigger: 'blur' }

        ],
        receiptAmount: [
          {
            required: true,
            message: this.$t('validation.required', { _field_: this.$t('receipt.amount') }),
            trigger: 'blur'
          },
          { validator: validPrice, trigger: 'blur' },
          { validator: validRequired, message: 'Số tiền không thể bằng 0', trigger: 'blur' }
        ]
      },
      valid: false,
      loading: false,
      fullscreenLoading: false,
      isValid: false,
      addMember: false,
      listId: [],
      listFriend: [],
      total_count: '',
      base64Image: ''
    }
  },
  computed: {
    ...mapState(['listFriendsNew']),
    disabledButton() {
      return this.accountForm.receiptName === '' || this.accountForm.receiptAmount === ''
    },
    disableImgUp() {
      return this.imageDetailShow.length >= 3
    }
  },
  watch: {
    listFriendsNew() {
      this.listFriend.forEach((element) => {
        if (this.listFriendsNew.includes(element.userId)) {
          this.chooseMember.push(element)
        }
      })
    },
    chooseMember: {
      handler() {
        let total = 0
        this.chooseMember.forEach((element) => {
          if (element.debt) {
            total += Number(element.debt)
          }
        })
        this.total_count = total
        // this.accountForm.fake = this.accountForm.receiptAmount - this.total_count
      },
      deep: true
    }
    // listDebt: {
    //   handler() {
    //     let total = 0
    //     this.listDebt.forEach((element) => {
    //       if (element.check) {
    //         total += element.debtLeft
    //       }
    //     })
    //     this.totalMoney = total
    //   },
    //   deep: true
    // },
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
    checkDebt(value) {
      if (value === '') {
        this.message = 'Số tiền không được để trống'
        return 'Số tiền không được để trống'
      }
      if (Number(value) === 0) {
        this.message = 'Số tiền phải khác 0 và là bội của 1000'
        return 'Số tiền phải khác 0 và là bội của 1000'
      }
      if (value) {
        if (value % 1000 === 0) {
          this.message = ''
          return ''
        } else {
          this.message = 'Số tiền phải khác 0 và là bội của 1000'
          return 'Số tiền phải khác 0 và là bội của 1000'
        }
      } else {
        this.message = ''
        return ''
      }
    },
    handleRouter(router) {
      this.$router.push(router)
    },
    removeAvatar() {
      this.imageAvatarShow = ''
      this.accountForm.avatar = ''
    },
    removeImage(index) {
      this.imageDetailShow = this.imageDetailShow.filter(function(item, key) {
        return key !== index
      })
    },
    checkFile(file) {
      const allowedExtensions = /(\.heic|\.jpg|\.jpeg|\.png|\.svg)$/i
      if (file.size >= 5000000) {
        return 'Kích cỡ ảnh quá nặng'
      }
      if (!['image/jpeg', 'image/png', 'image/jpg', 'image/svg'].includes(file.type) && !allowedExtensions.exec(file.name)) {
        return 'Ảnh sai định dạng'
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
    isHeic(file) {
      const x = file.type ? file.type.split('image/').pop() : file.name.split('.').pop().toLowerCase()
      console.log(x)
      return x === 'heic' || x === 'heif'
    },
    async onFileChangeDetail(e) {
      for (let x = 0; x < e.target.files.length; x++) {
        const valid = this.checkFile(e.target.files[x])
        if (valid) {
          await this.$store.commit(INDEX_SET_ERROR, { show: true, text: valid })
          return
        }
      }
      await this.$store.commit(INDEX_SET_LOADING, true)
      for (let x = 0; x < e.target.files.length; x++) {
        const formData = new FormData()
        formData.append('imgfile', e.target.files[x])
        try {
          const data = await this.$store.dispatch(IMAGE_UPLOAD_RECEIPT, formData)
          switch (data.statusCode) {
            case 202:
              if (this.imageDetailShow.length < 3) {
                this.imageDetailShow.push(data.data)
              }
              if (this.imageDetailShow.length >= 3) {
                this.$refs.fileUploadDetail.value = null
                return
              }
              break
            case 500:
              await this.$store.commit(INDEX_SET_ERROR, {
                show: true,
                text: data.error
              })
              break
            default:
              await this.$store.commit(INDEX_SET_ERROR, { show: true, text: data.messages })
              break
          }
        } catch (err) {
          this.$store.commit(INDEX_SET_ERROR, { show: true, text: 'Lỗi !', message: this.$t('message.message_error') })
        }
        await this.$store.commit(INDEX_SET_LOADING, false)

        if (this.imageDetailShow.length > 3) {
          this.imageDetailShow.splice(3, this.imageDetailShow.length - 3)
        }
      }
      this.$refs.fileUploadDetail.value = null
      await this.$store.commit(INDEX_SET_LOADING, false)
    },
    createBase64Image(file) {
      const theReader = new FileReader()
      theReader.onloadend = async() => {
        this.base64Image = await theReader.result
        const extension = this.getFileExtension(file)
        const mimeType = file.type
        const removePostfix = `data:${mimeType};base64,`
        const base64Code = this.base64Image.replace(removePostfix, '')
        console.log('file', extension, mimeType)
        console.log('base64Code', removePostfix, base64Code)
        console.log('this.base64Image', this.base64Image)
        this.$emit('change', file, base64Code, extension, mimeType)
      }
      theReader.readAsDataURL(file)
    },
    getFileExtension(file) {
      if (file) {
        const extension = file.name.split('.').pop()
        return extension
      }
      return ''
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
      this.validateForm()
      if (!this.isValid) {
        return
      }

      let total_debt = false
      let a = ''
      this.chooseMember.forEach((element) => {
        console.log(element)
        if (element.debt === '' || !element.debt) {
          total_debt = true
        }
        a = this.checkDebt(element.debt)
      })
      if (total_debt || a) {
        this.$store.commit(INDEX_SET_ERROR, { show: true, text: 'Lỗi !', message: 'Bạn chưa nhập đúng số tiền cho người tham gia.' })
        return
      }
      console.log(total_debt)
      if (!this.chooseMember.length) {
        this.$store.commit(INDEX_SET_ERROR, { show: true, text: 'Lỗi !', message: 'Bạn chưa chọn người tham gia' })
        // this.$message({
        //   type: 'warning',
        //   message: 'Bạn chưa chọn người tham gia'
        // })
        return
      }
      if (!this.imageDetailShow.length) {
        this.$store.commit(INDEX_SET_ERROR, { show: true, text: 'Lỗi !', message: 'Bạn chưa tải ảnh chứng từ' })
        return
      }
      try {
        await this.$store.commit(INDEX_SET_LOADING, true)
        const dto = this.accountForm
        dto.eventLogo = ''
        dto.MemberIds = this.listFriendsNew
        dto.eventId = this.id
        dto.userDepts = JSON.parse(JSON.stringify(this.chooseMember))
        dto.imglinks = this.imageDetailShow
        if (this.type === '1') {
          dto.userDepts.forEach((element) => {
            element.debt = this.accountForm.receiptAmount ? Math.floor(this.accountForm.receiptAmount / (this.chooseMember.length + 1)) : ''
          })
        }
        const data = await this.$store.dispatch(CREATE_RECEIPT, dto)
        switch (data.statusCode) {
          case 202:
            this.$store.commit(INDEX_SET_SUCCESS, {
              show: true,
              text: data.message
            })
            this.handleRouter('/event/detail/' + this.id)
            break
          case 400:
            this.$store.commit(INDEX_SET_ERROR, { show: true, text: 'Lỗi !', message: data.error })

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
      this.chooseMember = []
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
