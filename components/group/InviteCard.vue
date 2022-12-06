<template>
  <div class="d-flex justify-between items-center my-3">
    <div class="d-flex items-center">
      <div class="p-[6px] bg-neutral-200 rounded-full mr-3">
        <img
          :src="getAvatar"
          alt=""
          class="rounded-full"
          style="width: 36px; height: 36px"
        />
      </div>
      <div class="text-[#273253]">
        <span class="text-sm">{{ request.inviter }}</span>
        <p class="font-bold text-lg">{{ group.name }}</p>
        <span class="text-sm">{{ request.time }}</span>
      </div>
    </div>
    <div>
      <div>
        <el-button
          type="success"
          class="bg-[#67C23A]"
          icon="el-icon-check"
          circle
          @click="$emit('accept', group, request)"
        ></el-button>
        <el-button
          type="danger"
          class="bg-[#F56C6C]"
          icon="el-icon-delete"
          circle
          @click="$emit('reject', group, request)"
        ></el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'InviteCard',
  props: {
    group: {
      type: Object,
      default: () => ({})
    },
    request: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    getAvatar() {
      if (this.group.avatar) {
        return this.group.avatar
      }
      return require('~/assets/images/common/users.svg')
    }
  }
}
</script>
