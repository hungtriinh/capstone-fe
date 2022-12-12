<template>
    <el-card class="mb-10">
      <div class="d-flex justify-between items-center">
        <div class="d-flex items-center gap-10">
          <div >
            <ShowAvatarElement :event="{ name: group.name }"></ShowAvatarElement>
          </div>
          <div class="text-[#273253]">
            <p class="text-bold">{{ group.name }}</p>
            <span class="time">{{ request.time }}</span>
          </div>
        </div>
        <div>
          <el-button
            type="success"
            class="bg-[#67C23A]"
            icon="el-icon-check"
            circle
            @click="$emit('accept', group.id)"
          ></el-button>
          <el-button
            type="danger"
            class="bg-[#F56C6C]"
            icon="el-icon-delete"
            circle
            @click="$emit('reject', group.id)"
          ></el-button>
        </div>
      </div>
    </el-card>
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
