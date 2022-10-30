<template>
  <div class="main-login">
    <div>
      <div class="login login-width login-mobile">
        <div class="title-box d-flex">
          <img src="~/assets/images/icons/back.svg" alt="back">
          <img src="~/assets/images/icons/event-small.svg" alt="">
<!--          <span class="text-bold">{{ listEvent.id }}</span>-->
          <span class="text-bold">{{ listEvent.title }}</span>
          <img src="~/assets/images/icons/noti-small.svg" alt="">

        </div>
        <div class="total text-bold d-flex justify-between">
          <span class="">Tổng nợ:</span>
          <span>250.000VND</span>
          <span><img src="~/assets/images/icons/eye-black.svg" alt=""></span>
        </div>
        <div class="detail text-bold">
          <div class="item-detail d-flex justify-around">
            <div>
              <span>Chi tiết tiền nhậu</span><br>
              <span class="text-normal">23:05 - 5/10/2022</span>
            </div>
            <div>1000.000</div>
          </div>
          <div class="item-detail d-flex justify-around">
            <div>
              <span>Chi tiết tiền nhậu</span><br>
              <span class="text-normal">23:05 - 5/10/2022</span>
            </div>
            <div>1000.000</div>
          </div>
          <div class="item-detail d-flex justify-around">
            <div>
              <span>Chi tiết tiền nhậu</span><br>
              <span class="text-normal">23:05 - 5/10/2022</span>
            </div>
            <div>1000.000</div>
          </div>
          <div class="item-detail d-flex justify-around">
            <div>
              <span>Chi tiết tiền nhậu</span><br>
              <span class="text-normal">23:05 - 5/10/2022</span>
            </div>
            <div>1000.000</div>
          </div>
          <div class="item-detail d-flex justify-around">
            <div>
              <span>Chi tiết tiền nhậu</span><br>
              <span class="text-normal">23:05 - 5/10/2022</span>
            </div>
            <div>1000.000</div>
          </div>
        </div>
        <div class="btn-group text-center">
          <el-button>{{ $t('home.pay') }}</el-button>
          <el-button @click="handleRouter('create')">{{ $t('home.add_receipt') }}</el-button>
        </div>
        <navigation/>
      </div>
    </div>
  </div>
</template>
<script>
// import { AUTH_REGISTER, INDEX_SET_ERROR, INDEX_SET_LOADING, INDEX_SET_SUCCESS, SET_EMAIL } from '@/store/store.const'
// import { TYPE_REGISTER_OTP } from '@/store/store.const.js'
// import { validPhoneNoPrefix } from '@/utils/validate'
import Navigation from '~/components/Navigation'

export default {
  name: 'MainPage',
  components: {
    Navigation
  },
  data() {
    return {
      search: '',
      listEvent: {}
    }
  },
  created() {
    this.getListEvent()
  },
  mounted() {
  },
  methods: {
    getListEvent() {
      this.listEvent =
        {
          id: this.$route.params.id,
          icon: require('@/assets/images/event.png'),
          title: 'Design vui nhon',
          des: 'mua cafe',
          time: '13-10-2022'
        }
    },
    handleRouter(router) {
      this.$router.push(router)
    }
  }
}
</script>
