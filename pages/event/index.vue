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
            <img class="event-img" :src="item.icon_fake" alt="icon">
            <div class="event-content" @click="handleRouter('detail/' + item.id)">
              <div class="title text-bold">{{ item.eventName }}</div>
              <span class="title text-bold-sm">{{ item.eventDescript }}</span> <br>
              <span class="title text-normal-sm">{{ item.updatedAt }}</span>
            </div>
            <div>
              <img class="status-img" src="~/assets/images/icons/circle-red.svg" alt="status">
              <img src="~/assets/images/icons/dots.svg" alt="status">
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
// import Navigation from '~/components/Navigation'
import { GET_EVENT_LIST, INDEX_SET_LOADING } from '~/store/store.const'

export default {
  name: 'MainPage',
  components: {
    // Navigation
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
        const response = await this.$store.dispatch(GET_EVENT_LIST, 9)
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
