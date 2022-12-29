<template>
  <div class="main-login">
    <el-empty v-if="!listFriend.length" description="Không có người dùng khả dụng"></el-empty>

    <div v-else class="">
      <div>
        <FriendRequest
          v-for="(item, index) in listFriend"
          :key="index"
          :infor="item"
          class="my-[8px]"
          @accept="handleAccept"
          @reject="handleReject"
        ></FriendRequest>
      </div>
    </div>
  </div>
</template>

<script>
import FriendRequest from './FriendRequest.vue'
import {
  FRIEND_RESPONSE_REQUEST,
  INDEX_SET_LOADING,
  INDEX_SET_SUCCESS
} from '~/store/store.const'
export default {
  name: 'CurrentFriendTab',
  components: {
    FriendRequest
  },
  props: {
    listFriend: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    async handleAccept(friend) {
      this.$store.commit(INDEX_SET_LOADING, true)
      try {
        const response = await this.$store.dispatch(FRIEND_RESPONSE_REQUEST, {
          UserFriendId: friend.userId,
          status: 1
        })
        if (response.statusCode === 202) {
          await this.$store.commit(INDEX_SET_SUCCESS, {
            show: true,
            text: response.message
          })
          this.$emit('reload')
        }
      } catch (e) {
        this.$store.commit(INDEX_SET_LOADING, false)
      }
      this.$store.commit(INDEX_SET_LOADING, false)
    },
    async  handleReject(friend) {
      this.$store.commit(INDEX_SET_LOADING, true)
      try {
        const response = await this.$store.dispatch(FRIEND_RESPONSE_REQUEST, {
          UserFriendId: friend.userId,
          status: 0
        })
        if (response.statusCode === 202) {
          await this.$store.commit(INDEX_SET_SUCCESS, {
            show: true,
            text: response.message
          })
          this.$emit('reload')
        }
      } catch (e) {
        this.$store.commit(INDEX_SET_LOADING, false)
      }
      this.$store.commit(INDEX_SET_LOADING, false)
    }
  }
}
</script>
