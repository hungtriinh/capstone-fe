<template>
  <div class="main-login">
    <div class="login login-width login-mobile">
      <el-page-header content="" @back="$router.push('/event/detail/' + id)">
      </el-page-header>
      <h3 class="title text-center">{{ $t('home.qr') }}</h3>
      <QrCodeCommon class="d-flex justify-center" :value="value"/>
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
      </el-form>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import {
  INDEX_SET_SUCCESS
} from '~/store/store.const'

import QrCodeCommon from '~/components/qrcode/QrCodeCommon'

export default {
  name: 'QrPage',
  components: {
    QrCodeCommon
  },
  data() {
    return {
      a: process.env.API_URL || 'https://api.bwallet.site/api/',
      value: this.$cookies.get('eventUrl') || '',
      id: this.$route.params.id
    }
  },
  computed: {
    ...mapState(['listFriends']),
    disabledButton() {
      return this.accountForm.receiptName === '' || this.accountForm.receiptAmount === ''
    },
    url() {
      return this.a + this.value + 'asdfasfsadfasdf'
    }
  },
  created() {
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
    }
  }
}
</script>
<style scoped lang="scss">
</style>
