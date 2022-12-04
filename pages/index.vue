<template>
  <div class="main-login">
    <div>
      <div class="login login-width login-mobile">
        <div class="search-box">
          <el-input
            v-model="search"
            placeholder="Search"
            prefix-icon="el-icon-search">
          </el-input>
        </div>
        <div v-for="(item,key) in listEvent" :key="key" class="event">
          <div class="event-item">
            <el-timeline>
              <div class="event-title d-flex justify-between items-center cursor-pointer"  @click="handleRouter('event/detail/' + item.eventId)">
                <div class="d-flex items-center event-name">
                  <el-badge :value="12" class="item" type="primary">
                    <ShowAvatarElement :event="{ name: item.eventName, color: item.color }"></ShowAvatarElement>
                  </el-badge>
                  <div class="event-content">
                    <h4 class="title text-bold">{{ item.eventName }}</h4>
                  </div>
                </div>
                <div class="d-flex items-center ">
                  <span class="text-bold" :class="item.totalMoney >= 0 ? 'text-green' : 'text-red'">{{item.totalMoney}}</span>
                  <i class="el-icon event-navi el-icon-arrow-right"></i>
                </div>
              </div>
              <el-timeline-item v-for="(user, key) in item.listUser" :key="key" placement="top">
                <el-card>
                  <span class="text-normal-sm">{{ user.userName }}</span>
                  <span class="text-normal-sm">{{ $t('event.owe_you')}} </span><span :class="user.money >= 0 ? 'text-green' : 'text-red'">{{user.money}}</span>
                  <span class="text-normal-sm">{{ $t('currency.currency')}} </span>
                </el-card>
              </el-timeline-item>
              <el-divider class="divider"></el-divider>
            </el-timeline>
            <div>
<!--              <img class="status-img" src="~/assets/images/icons/circle-red.svg" alt="status">-->
<!--              <img src="~/assets/images/icons/dots.svg" alt="status">-->
            </div>
          </div>
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
import { GET_EVENT_LIST, INDEX_SET_LOADING } from '~/store/store.const'

export default {
  name: 'MainPage',
  // middleware: 'auth',
  components: {
    // ShowAvatarElement
  },
  data() {
    return {
      search: '',
      listEvent: []
    }
  },
  created() {
    this.getListEvent()
  },
  mounted() {
  },
  methods: {
    async getListEvent() {
      this.$store.commit(INDEX_SET_LOADING, true)
      try {
        const response = await this.$store.dispatch(GET_EVENT_LIST)
        const { data, statusCode } = response
        if (statusCode === 202) {
          this.listEvent = data
        }
      } catch (e) {
        this.$store.commit(INDEX_SET_LOADING, false)
      }
      this.$store.commit(INDEX_SET_LOADING, false)

      this.listEvent.forEach(element => {
        element.icon_fake = require('@/assets/images/event.png')
      })
    },
    handleRouter(router) {
      this.$router.push(router)
    }
  }
}
</script>
