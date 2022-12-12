<template>
  <div>
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
          <el-tag effect="dark" v-if="request.status === 4" type="success">Đồng ý</el-tag>
          <el-tag effect="dark" v-else-if="request.status === 5" type="danger">Từ chối</el-tag>
          <el-tag effect="dark" v-else-if = "request.status === 3" type="warning">Đang chờ</el-tag>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'RequestCard',
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
