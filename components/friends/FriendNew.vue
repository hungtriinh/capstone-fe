<template>
  <div>
    <Card :text-color="'white'" :title="infor.userName" :phone="infor.userPhone">
      <template #prefix>
        <div class="p-[6px] bg-neutral-200 rounded-full">
          <img v-if="getAvatar" :src="getAvatar" style="width: 25px; height: 25px" alt="" />
          <div v-else>
            <ShowAvatarElement :event="{ name: infor.userName }"></ShowAvatarElement>
          </div>
        </div>
      </template>
      <template #postfix>
        <div>
          <el-button type="success" class="bg-[#67C23A] py-[6px] px-[8px] rounded-lg" @click="$emit('add', infor)">{{$t('friends.add')}}</el-button>
        </div>
      </template>
    </Card>
  </div>
</template>

<script>
import Card from '@/components/common/Card.vue'
export default {
  name: 'FriendCard',
  components: {
    Card
  },
  props: {
    infor: {
      type: Object,
      default: () => ({
        id: '1',
        name: 'Tran Viet Huy',
        avatar: ''
      })
    }
  },
  computed: {
  },
  methods: {
    handleRemoveFriend() {
      this.$emit('remove', this.infor)
    }
  }
}
</script>

