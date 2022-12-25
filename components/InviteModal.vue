<template>
  <div class="modal-backdrop">
    <div class="confirm-modal text-center">
      <div class="d-flex justify-between">
        <div class="title text-bold"> {{ $t('event.add_member') }} </div>
        <i @click="$emit('close')" class="el-icon el-icon-close"></i>
      </div>
      <el-input
        @input="searchFr"
        v-model="search"
        placeholder="Search"
        prefix-icon="el-icon-search">
      </el-input>
      <el-empty v-if="!listFriend.length" description="Không có thành viên nào"></el-empty>

      <div velse class="">
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
        <el-button class="button" type="danger" @click="sendInvite" >Mời bạn bè</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import {
  FRIEND_INVITE_TO_EVENT,
  INDEX_SET_ERROR,
  INDEX_SET_LOADING,
  INDEX_SET_SUCCESS
} from '~/store/store.const'

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
    },
    id: {
      type: String,
      default: ''
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
      // await this.$store.commit(INDEX_SET_LIST_FRIEND, this.checkedFriends)
      await this.sendInvite()
      this.close()
    },
    async sendInvite() {
      this.$store.commit(INDEX_SET_LOADING, true)
      try {
        const response = await this.$store.dispatch(FRIEND_INVITE_TO_EVENT, {
          EventId: this.id,
          MemberIDs: this.checkedFriends
        })
        if (response.statusCode === 202) {
          await this.$store.commit(INDEX_SET_SUCCESS, {
            show: true,
            text: response.message
          })
          this.close()
        } else if (response.statusCode === 400) {
          await this.$store.commit(INDEX_SET_ERROR, {
            show: true,
            text: response.error
          })
        } else {
          await this.$store.commit(INDEX_SET_ERROR, {
            show: true,
            text: response.message
          })
        }
      } catch (e) {
        await this.$store.commit(INDEX_SET_ERROR, {
          show: true,
          text: 'Có lỗi xảy ra'
        })
        this.$store.commit(INDEX_SET_LOADING, false)
      }
      this.$store.commit(INDEX_SET_LOADING, false)
    },
    searchFr: _.debounce(function(e) {
      this.$emit('searchFr', this.search)
    }, 1000)
  }
}
</script>
