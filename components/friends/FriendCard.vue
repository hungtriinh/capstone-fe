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
          <el-dropdown trigger="click" @command="handleRemoveFriend">
            <img src="~/assets/images/common/user-minus.svg" alt="" />
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>{{
                  $t('friends.remove_friend')
                }}</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
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
    getAvatar() {
      if (this.infor.avatar) {
        return this.infor.avatar
      }
      return ''
    }
  },
  methods: {
    handleRemoveFriend() {
      this.$emit('remove', this.infor.userId)
    }
  }
}
</script>

