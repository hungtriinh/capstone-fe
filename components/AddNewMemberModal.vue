<template>
  <div class="modal-backdrop">
    <div class="confirm-modal ">
      <div class="d-flex justify-between">

        <div class="title text-bold text-center" > {{ $t('event.add_member') }} </div>
        <i class="el-icon el-icon-close" @click="close"></i>
      </div>

      <!--      <el-input-->
      <!--        v-model="search"-->
      <!--        placeholder="Search"-->
      <!--        prefix-icon="el-icon-search">-->
      <!--      </el-input>-->
      <el-empty v-if="!listFriend.length" description="Không có thành viên nào"></el-empty>

      <div v-else class="">
        <el-checkbox-group v-model="checkedFriends" class="checkbox-group" @change="handleCheckedCitiesChange">
          <div v-for="(item, key) in listFriend" :key="key" class="checkbox-item">
            <el-checkbox :label="item.userId" :value="item.userId"></el-checkbox>
            <div v-if="item.userAvatar">
              <el-image class="image-avatar" :preview-src-list="[item.userAvatar]" :src="item.userAvatar"/>
            </div>
            <div v-else>
              <ShowAvatarElement :event="{ name: item.userName }"></ShowAvatarElement>
            </div>
            <div>
              <span class="text-bold">{{ item.userName }}</span><br>
              <span class="time">{{ item.userPhone }}</span><br>
            </div>
          </div>
        </el-checkbox-group>
      </div>
      <div class="btn-group d-flex justify-center">
        <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange">{{ $t('event.check_all')}}</el-checkbox>
        <el-button class="button" type="danger" @click="create" >{{$t('event.confirm')}}</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { INDEX_SET_LIST_FRIEND_NEW } from '~/store/store.const'

export default {
  name: 'AddNewMemberModal',
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
  data() {
    return {
      checkedFriends: [],
      search: '',
      checkAll: true,
      friends: '',
      isIndeterminate: false
    }
  },
  watch: {
    listId() {
      this.checkedFriends = this.listId
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
      await this.$store.commit(INDEX_SET_LIST_FRIEND_NEW, this.checkedFriends)
      this.close()
    }
  }
}
</script>
