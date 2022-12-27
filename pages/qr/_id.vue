<template>
  <div class="main-login">
    <div class="login login-width login-mobile">
      <el-page-header content="" @back="$router.push('/event/detail/' + id)">
      </el-page-header>
      <h3 class="title text-center">{{ $t('home.qr') }}</h3>
      <QrCodeCommon class="d-flex justify-center" :value="url"/>
      <div class="text-center qr-share">
        <span class="text-bold">{{ $t('qr.share') }}</span>
        <br>
        <span class="text-bold">{{ $t('qr.share2') }}</span>
      </div>
      <el-form
        autocomplete="off"
        label-position="left">
        <br/>
        <el-form-item class="" :label="$t('qr.url')">
          <el-input
            ref="walletAddress"
            :value="url"
            name="walletAddress"
            type="text"
            tabindex="2"
            class="address disabled-common"
            readonly
          >
            <img
              slot="suffix" class="cursor-pointer pd-0" src="~/assets/images/icons/copy.svg" alt="copy"
              @click="copy(url)">
          </el-input>
        </el-form-item>
        <div class="d-flex align-items-center justify-center">
          <div
            class="content cursor-pointer login-page__forgot-password align-items-center">
            <el-button type="primary" class="" @click="showInviteModal">Mời bạn bè</el-button>
          </div>
        </div>
      </el-form>
    </div>
    <InviteModal
      v-show="invite"
      :list-friend="listFriend"
      :list-id="listId"
      :id="id"
      @searchFr="searchFr"
      @reload="reload"
      @close="close"
    >
    </InviteModal>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import {
  FRIEND_LIST_INVITE,
  INDEX_SET_LOADING,
  INDEX_SET_SUCCESS
} from '~/store/store.const'

import QrCodeCommon from '~/components/qrcode/QrCodeCommon'

export default {
  name: 'QrPage',
  middleware: 'auth',
  components: {
    QrCodeCommon
  },
  data() {
    return {
      a: process.env.APP_URL || 'https://bwallet.site',
      value: this.$cookies.get('eventUrl') || '',
      id: this.$route.params.id,
      invite: false,
      listFriend: [],
      listId: []
    }
  },
  computed: {
    ...mapState(['listFriends']),
    url() {
      return this.a + this.value
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
  },
  created() {
    this.getListFriend()
  },
  methods: {
    copy(data) {
      const textarea = document.createElement('textarea')
      textarea.value = data
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      this.$store.commit(INDEX_SET_SUCCESS, {
        show: true,
        text: this.$t('noti.copy_success')
      })
    },
    async reload() {
      await this.getListFriend()
    },
    showInviteModal() {
      this.invite = true
    },
    close() {
      this.invite = false
    },
    async getListFriend() {
      this.$store.commit(INDEX_SET_LOADING, true)
      try {
        const response = await this.$store.dispatch(FRIEND_LIST_INVITE, {
          id: this.$route.params.id,
          query: ''
        })
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
    },
    async searchFr(key) {
      this.$store.commit(INDEX_SET_LOADING, true)
      try {
        const response = await this.$store.dispatch(FRIEND_LIST_INVITE, {
          id: this.$route.params.id,
          query: key
        })
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
