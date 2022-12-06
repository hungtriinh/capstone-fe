<template>
  <div class="main-login">
    <div class="d-flex justify-center mb-5">
        Search Bar Here
    </div>
    <div class="d-flex justify-center">
      <div>
        <FriendNew
          v-for="(item, index) in listFriend"
          :key="index"
          :infor="item"
          class="my-[8px]"
          @add="handleAddFriend"
        ></FriendNew>
      </div>
    </div>
  </div>
</template>

<script>
import FriendNew from '@/components/friends/FriendNew.vue'
const MOCK_FRIEND = [
  { id: 1, name: 'Tran Viet Huy' },
  { id: 2, name: 'Trinh Hoang Hung' },
  { id: 3, name: 'Nguyen Huy Hoang' }
]
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'New',
  components: {
    FriendNew
  },
  props: {
    listFriend: {
      type: Array,
      default: () => ([...MOCK_FRIEND])
    }
  },
  methods: {
    handleAddFriend(friend) {
      console.log('accept', friend)
    }
  }
}
</script>
