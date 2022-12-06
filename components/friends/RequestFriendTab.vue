<template>
  <div class="main-login">
    <div class="d-flex justify-center">
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
const MOCK_FRIEND = [
  { id: 1, name: 'Tran Viet Huy' },
  { id: 2, name: 'Trinh Hoang Hung' },
  { id: 3, name: 'Nguyen Huy Hoang' }
]
export default {
  name: 'CurrentFriendTab',
  components: {
    FriendRequest
  },
  props: {
    listFriend: {
      type: Array,
      default: () => ([...MOCK_FRIEND])
    }
  },
  methods: {
    handleAccept(friend) {
      console.log('accept', friend)
    },
    handleReject(friend) {
      console.log('reject', friend)
    }
  }
}
</script>
