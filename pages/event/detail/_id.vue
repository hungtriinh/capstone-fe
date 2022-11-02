<template>
  <div class="main-login">
    <div>
      <div class="login login-width login-mobile">
        <div class="title-box d-flex">
          <img @click="handleRouter('/event')" class="cursor-pointer" src="~/assets/images/icons/back.svg" alt="back">
          <img src="~/assets/images/icons/event-small.svg" alt="">
<!--          <span class="text-bold">{{ listEvent.id }}</span>-->
          <span class="text-bold">đi câu cá</span>
          <img src="~/assets/images/icons/noti-small.svg" alt="">

        </div>
        <div class="total text-bold d-flex justify-between">
          <span class="">Tổng nợ:</span>
          <span v-if="!hideTotal">250.000VND</span>
          <span style="margin-top: 6px; font-size: 20px" v-else>{{ $t('event.hideTotal') }}</span>
          <span v-if="!hideTotal"><img @click="hideTotal = !hideTotal" class="cursor-pointer" src="~/assets/images/icons/eye-black.svg" alt=""></span>
          <span v-else><img @click="hideTotal = !hideTotal" class="cursor-pointer" src="~/assets/images/icons/hide-eye.svg" alt=""></span>
        </div>
        <div class="detail text-bold">
          <div v-for="(receipt, key) in listReceipt" :key="key" class="item-detail d-flex justify-around">
            <div>
              <span>{{ receipt.receiptName }}</span><br>
              <span class="text-normal">23:05 - 5/10/2022</span>
            </div>
            <div>{{ receipt.receiptAmount }}</div>
          </div>
        </div>
        <div class="btn-group text-center">
          <el-button>{{ $t('home.pay') }}</el-button>
          <el-button @click="handleRouter('/event/receipt/' + $route.params.id )">{{ $t('home.add_receipt') }}</el-button>
        </div>
<!--        <navigation/>-->
      </div>
    </div>
  </div>
</template>
<script>
// import { AUTH_REGISTER, INDEX_SET_ERROR, INDEX_SET_LOADING, INDEX_SET_SUCCESS, SET_EMAIL } from '@/store/store.const'
// import { TYPE_REGISTER_OTP } from '@/store/store.const.js'
// import { validPhoneNoPrefix } from '@/utils/validate'

import { GET_RECEIPT_LIST, INDEX_SET_LOADING } from '~/store/store.const'

export default {
  name: 'MainPage',
  components: {
  },
  data() {
    return {
      search: '',
      listReceipt: [],
      hideTotal: false
    }
  },
  created() {
    this.getListEvent()
  },
  mounted() {
  },
  methods: {
    async getListEvent() {
      // this.listEvent =
      //   {
      //     id: this.$route.params.id,
      //     icon: require('~/assets/images/event.png'),
      //     title: 'Design vui nhon',
      //     des: 'mua cafe',
      //     time: '13-10-2022'
      //   }
      this.$store.commit(INDEX_SET_LOADING, true)
      try {
        const response = await this.$store.dispatch(GET_RECEIPT_LIST, this.$route.params.id)
        const { data, statusCode } = response
        if (statusCode === 200) {
          this.listReceipt = data
        }
      } catch (e) {
        this.$store.commit(INDEX_SET_LOADING, false)
      }
      this.$store.commit(INDEX_SET_LOADING, false)

      this.listReceipt.forEach(element => {
        element.icon_fake = require('@/assets/images/event.png')
      })
    },
    handleRouter(router) {
      this.$router.push(router)
    }
  }
}
</script>
