<template>
  <div class="main-login">
    <el-empty v-if="!listFriend.length" description="Không có người dùng khả dụng"></el-empty>

    <div v-else class="">
      <div>
        <FriendCard
          v-for="(item, index) in listFriend"
          :key="index"
          :infor="item"
          class="my-[8px]"
          @remove="handleRemoveFriend"
        ></FriendCard>
      </div>
    </div>
  </div>
</template>

<script>
import FriendCard from './FriendCard.vue'
import { FRIEND_DELETE_REQUEST, INDEX_SET_LOADING, INDEX_SET_SUCCESS } from '~/store/store.const'

export default {
  name: 'CurrentFriendTab',
  components: {
    FriendCard
  },
  props: {
    listFriend: {
      type: Array,
      default: () => ([])
    }
  },
  methods: {
    async handleRemoveFriend(friend) {
      this.$store.commit(INDEX_SET_LOADING, true)
      try {
        const response = await this.$store.dispatch(FRIEND_DELETE_REQUEST, friend)
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
