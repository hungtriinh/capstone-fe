<template>
  <div class="main-login">
    <div class="d-flex items-center justify-between">
      <el-page-header content="Chỉnh sửa thông tin" @back="$router.push('/profile')">
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
    <div class="d-flex justify-center profile-img">
      <!--        <ShowAvatarElement :event="{ name: profile.UserName }"></ShowAvatarElement>-->
<!--      <el-avatar :src="accountForm.avatar" :size="100" :preview-src-list='accountForm.avatar' class="image"/>-->

    </div>
    <div class="d-flex justify-center">
      <FileUpload
        :width="145"
        :height="145"
        :circle="true"
        :default-image="accountForm.avatar"
        @change="handleSelectBanner"
      />
    </div>
    <el-form
      ref="accountForm"
      style="margin-top: 30px"
      :model="accountForm"
      :rules="accountRules"
      autocomplete="off"
      label-position="left"
      @keyup.enter.native="handleSave"
    >
      <el-form-item class="email-login" prop="eventName" :error="(error.key === 'eventName') ? error.value : ''">
<!--        <label for="email">{{ $t('event.eventName') }}</label>-->
        <el-input
          id="eventName"
          ref="eventName"
          v-model="accountForm.eventName"
          placeholder="Số điện thoại"
          disabled
          autocomplete="off"
          name="eventName"
          type="text"
          tabindex="2"
          @focus="resetValidate('eventName')"
        />
      </el-form-item>
      <el-form-item class="email-login" prop="eventDescript" :error="(error.key === 'password') ? error.value : ''">
<!--        <label for="password">{{ $t('event.eventDescript') }}</label>-->
        <el-input
          id="eventDescript"
          ref="eventDescript"
          v-model="accountForm.eventDescript"
          placeholder="Họ và tên"
          name="eventDescript"
          tabindex="3"
          autocomplete="off"
          @focus="resetValidate('eventDescript')"
        >
        </el-input>
      </el-form-item>
      <div class="d-flex align-items-center forgot-pass">
        <div
          class="content cursor-pointer login-page__forgot-password align-items-center">
        </div>
      </div>
    </el-form>
    <el-switch
      v-model="AllowAddFriendStatus"
      style="display: block; margin-bottom: 30px"
      inactive-color="#ff4949"
      active-color="#13ce66"
      inactive-text="CHO PHÉP KẾT BẠN">
    </el-switch>
    <el-switch
      v-model="AllowInviteEventStatus"
      style="display: block"
      inactive-text="CHO PHÉP THÊM VÀO NHÓM"
      inactive-color="#ff4949"
      active-color="#13ce66"
      @change="changeGroup">
    </el-switch>
  </div>
</template>

<script>
import FileUpload from '@/components/common/FileUpload.vue'
import { INDEX_SET_LOADING, INDEX_SET_SUCCESS, PROFILE_UPDATE, INDEX_SET_ERROR, IMAGE_BASE64 } from '~/store/store.const'
export default {
  name: 'SettingPage',
  components: {
    FileUpload
  },
  data() {
    return {
      token: '',
      user: {},
      accountForm: {
        avatar: this.$auth.user.Avatar,
        eventName: this.$auth.user.PhoneNumber,
        eventDescript: this.$auth.user.UserName,
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
          }
        ],
        eventDescript: [
          {
            required: true,
            message: this.$t('validation.required', { _field_: this.$t('event.eventDescript') }),
            trigger: 'blur'
          }
        ]
      },
      valid: false,
      loading: false,
      fullscreenLoading: false,
      isValid: false,
      addMember: false,
      AllowAddFriendStatus: this.$auth.user.AllowAddFriendStatus !== 0,
      AllowInviteEventStatus: this.$auth.user.AllowInviteEventStatus !== 0,
      listId: [],
      listFriend: [],
      fileName: '',
      base64code: '',
      sourceImg: ''
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
    handleSelectBanner(file, base64Code, extension, mimeType) {
      console.log(file, base64Code, extension, mimeType)
      this.fileName = file.name
      this.base64code = base64Code
    },
    validateForm() {
      this.$refs.accountForm.validate(valid => {
        this.isValid = valid
      })
    },
    async upBase64Img() {
      this.$store.commit(INDEX_SET_LOADING, true)
      try {
        const response = await this.$store.dispatch(IMAGE_BASE64, {
          fileName: this.fileName,
          folder: 'user',
          base64String: this.base64code
        })
        if (response.statusCode === 202) {
          await this.$store.commit(INDEX_SET_SUCCESS, {
            show: true,
            text: response.message
          })
          this.sourceImg = response.data
          console.log(this.sourceImg)
        } else {
          await this.$store.commit(INDEX_SET_ERROR, {
            show: true,
            text: response.message
          })
        }
      } catch (e) {
        this.$store.commit(INDEX_SET_LOADING, false)
      }
      this.$store.commit(INDEX_SET_LOADING, false)
    },
    async handleSave() {
      this.validateForm()
      if (!this.isValid) {
        return
      }
      this.$store.commit(INDEX_SET_LOADING, true)
      try {
        if (this.base64code) {
          await this.upBase64Img()
        }
        const response = await this.$store.dispatch(PROFILE_UPDATE, {
          Avatar: this.sourceImg,
          UserName: this.accountForm.eventDescript,
          AllowAddFriendStatus: this.AllowAddFriendStatus ? 1 : 0,
          AllowInviteEventStatus: this.AllowInviteEventStatus ? 1 : 0
        })
        if (response.statusCode === 202) {
          await this.$store.commit(INDEX_SET_SUCCESS, {
            show: true,
            text: response.message
          })
          this.$auth.fetchUser()
          this.$router.push('/profile')
        } else {
          await this.$store.commit(INDEX_SET_ERROR, {
            show: true,
            text: response.message
          })
        }
      } catch (e) {
        this.$store.commit(INDEX_SET_LOADING, false)
      }
      this.$store.commit(INDEX_SET_LOADING, false)
    },
    changeGroup() {
      console.log('s')
    }
  }
}
</script>
