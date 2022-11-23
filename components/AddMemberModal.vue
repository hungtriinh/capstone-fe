<template>
  <div class="modal-backdrop">
    <div class="confirm-modal text-center">
      <div class="title text-bold"> {{ $t('event.add_member') }} </div>
      <el-input
        v-model="search"
        placeholder="Search"
        prefix-icon="el-icon-search">
      </el-input>
      <div class="">
        <el-checkbox-group v-model="checkedFriends" class="checkbox-group" @change="handleCheckedCitiesChange">
          <div v-for="(item, key) in listFriend" :key="key" class="checkbox-item">
            <el-checkbox :label="item.userId" :value="item.userId"></el-checkbox>
            <img class="avatar" src="@/assets/images/event.png" alt="">
            <div>
              <span class="text-bold">{{ item.userName }}</span><br>
              <span class="text-bold">{{ item.userPhone }}</span><br>
              <span class="text-bold">{{ item.bankInfo }}</span>
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
import { INDEX_SET_LIST_FRIEND } from '~/store/store.const'

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
  data() {
    return {
      checkedFriends: [],
      search: '',
      checkAll: false,
      friends: '',
      isIndeterminate: true
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
      await this.$store.commit(INDEX_SET_LIST_FRIEND, this.checkedFriends)
      this.close()
    }
  }
}
</script>
