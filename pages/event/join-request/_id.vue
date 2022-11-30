<template>
  <div class="main-login setting-page">
    <div>
      <div class="login login-width login-mobile">
        <div class="d-flex justify-between">
          <el-page-header content="Yêu cầu tham gia" @back="goBack">
          </el-page-header>
          hítory
        </div>

        <el-empty v-if="!listEvent.length" description="Không có dữ liệu"></el-empty>
        <div v-else>
          <el-checkbox-group v-model="ListId" class="checkbox-group" @change="handleCheckedCitiesChange">
            <div v-for="(item, key) in listEvent" :key="key" class="">
              <el-checkbox :label="item.requestId" :value="item.requestId"></el-checkbox>
              <ShowAvatarElement :event="{ name: item.userName, color: item.color }"></ShowAvatarElement>
              <div>
                <span class="text-bold">{{ item.userName }}</span><br>
                <span class="text-bold">{{ item.phone }}</span><br>
                <span class="text-bold">{{ item.bankInfo }}</span>
              </div>
              <el-button type="success" icon="el-icon-check" circle @click="eventAppove(item.requestId, 4)"></el-button>
              <el-button type="danger" icon="el-icon-delete" circle @click="eventAppove(item.requestId,5)"></el-button>
            </div>
          </el-checkbox-group>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// import { AUTH_REGISTER, INDEX_SET_ERROR, INDEX_SET_LOADING, INDEX_SET_SUCCESS, SET_EMAIL } from '@/store/store.const'
// import { TYPE_REGISTER_OTP } from '@/store/store.const.js'
// import { validPhoneNoPrefix } from '@/utils/validate'
import { REQUEST_APPROVE, GET_REQUEST_WAITING, INDEX_SET_LOADING, INDEX_SET_SUCCESS } from '~/store/store.const'

export default {
  name: 'RequestPage',
  // middleware: 'auth',
  components: {
    // ShowAvatarElement
  },
  data() {
    return {
      id: this.$route.params.id,
      search: '',
      listEvent: {},
      ListId: []
    }
  },
  watch: {
    listEvent(newValue, oldValue) {
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
        const response = await this.$store.dispatch(GET_REQUEST_WAITING, this.id)
        const { data, statusCode } = response
        if (statusCode === 202) {
          this.listEvent = data
        }
        console.log(this.listEvent)
      } catch (e) {
        this.$store.commit(INDEX_SET_LOADING, false)
      }
      this.$store.commit(INDEX_SET_LOADING, false)
    },
    handleRouter(route) {
      this.$router.push(route)
    },
    handleCheckedCitiesChange(value) {
      const checkedCount = value.length
      this.checkAll = checkedCount === this.listFriend.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.listFriend.length
    },
    handleCheckAllChange(val) {
      this.checkedFriends = val ? this.listId : []
      this.isIndeterminate = false
    },
    goBack() {
      this.handleRouter('/event/setting/' + this.id)
    },
    async eventAppove(id, status) {
      this.$store.commit(INDEX_SET_LOADING, true)
      try {
        this.ListId.push(id)
        const response = await this.$store.dispatch(REQUEST_APPROVE, {
          ListId: this.ListId,
          status
        })
        const { data, statusCode } = response
        if (statusCode === 202) {
          await this.$store.commit(INDEX_SET_SUCCESS, {
            show: true,
            text: data.message
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
