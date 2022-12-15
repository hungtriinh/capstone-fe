<template>
  <div class="modal-backdrop">
    <div class="confirm-modal">
      <div class="d-flex justify-between">
        <div class="title text-bold"> Chọn thành viên </div>
        <i class="el-icon el-icon-close" @click="close"></i>
      </div>
      <el-input
        v-model="search"
        placeholder="Search"
        prefix-icon="el-icon-search">
      </el-input>
      <el-empty v-if="!listFriend.length" description="Không có thành viên nào"></el-empty>

      <div v-else class="">
        <el-checkbox-group v-model="checkedFriends" class="checkbox-group" @change="handleCheckedCitiesChange">
          <div v-for="(item, key) in listFriend" :key="key" class="checkbox-item">
            <div class="d-flex items-center gap-5">
            <el-checkbox :label="item.userId" :value="item.userId" @change="(value) => { changeMember(value, item.userId) }"></el-checkbox>
<!--            <img v-if="item.avatar" class="avatar" :src="item.avatar" alt="">-->
<!--            <div v-else>-->
              <ShowAvatarElement :event="{ name: item.name, color: item.color }"></ShowAvatarElement>
<!--            </div>-->
            </div>
            <div>
              <span class="text-bold">{{ item.name }}</span><br>
              <span class="time">{{ item.phone }}</span><br>
            </div>
          </div>
        </el-checkbox-group>
      </div>
      <div class="btn-group d-flex justify-center">
        <el-button class="button" type="danger" @click="create" >{{$t('event.confirm')}}</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { INDEX_SET_ROLE_MEMBER } from '~/store/store.const'

export default {
  name: 'AddMemberModal',
  props: {
    listFriend: {
      type: [],
      default: () => []
    },
    listId: {
      type: [],
      default: () => []
    }
  },
  async mounted() {
    await this.$store.commit(INDEX_SET_ROLE_MEMBER, [])
    this.checkedFriends = []
  },
  data() {
    return {
      checkedFriends: [],
      search: '',
      friends: ''
    }
  },
  watch: {
    listId() {
      // this.checkedFriends = this.listId
    }
  },
  methods: {
    close() {
      this.$emit('close')
    },
    handleRouter() {
      this.$emit('handleRouter')
    },
    handleCheckedCitiesChange(value) {
      const checkedCount = value.length
      this.checkAll = checkedCount === this.listFriend.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.listFriend.length
    },
    handleCheckAllChange(val) {
      this.checkedFriends = val ? this.listId : []
      this.isIndeterminate = false
    },
    async create() {
      await this.$store.commit(INDEX_SET_ROLE_MEMBER, this.checkedFriends)
      this.close()
    },
    changeMember(value, type) {
      if (value) {
        this.checkedFriends = [type]
      }
    }
  }
}
</script>
