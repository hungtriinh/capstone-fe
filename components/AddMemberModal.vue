<template>
  <div class="modal-backdrop">
    <div class="confirm-modal text-center">
      <div class="title"> {{ $t('event.add_member') }} </div>
      <el-input
        v-model="search"
        placeholder="Search"
        prefix-icon="el-icon-search">
      </el-input>
      <div class="">
<!--        {{listFriend}}-->
        <el-checkbox-group v-model="checkedFriends" class="checkbox-group" @change="handleCheckedCitiesChange">
          <div v-for="(item, key) in listFriend" :key="key" class="checkbox-item">
            <el-checkbox  :key="item.userId" :label="item.userName"></el-checkbox>
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

import { CREATE_EVENT, INDEX_SET_ERROR, INDEX_SET_LOADING } from '~/store/store.const'

export default {
  name: 'AddMemberModal',
  props: {
    listFriend: {
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
      this.checkedFriends = val ? this.listFriend : []
      this.isIndeterminate = false
    },
    async create() {
      // try {
      //   await this.$store.commit(INDEX_SET_LOADING, true)
      //
      //   const response = await this.$store.dispatch(CREATE_EVENT, 4)
      //   const data = response.data
      //   switch (data.statusCode) {
      //     case 202:
      //       await this.$router.push('/event')
      //       break
      //     default:
      //       this.$store.commit(INDEX_SET_ERROR, { show: true, text: 'Lỗi !', message: data.message })
      //       break
      //   }
      // } catch (err) {
      //   this.$store.commit(INDEX_SET_ERROR, { show: true, text: 'Lỗi !', message: this.$t('message.message_error') })
      // }
      // await this.$store.commit(INDEX_SET_LOADING, false)
    }
  }
}
</script>
