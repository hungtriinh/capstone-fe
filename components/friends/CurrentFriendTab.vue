<template>
  <div class="main-login">
    <div class="d-flex justify-center">
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
    handleRemoveFriend(friend) {
      console.log('remove', friend)
    }
  }
}
</script>
