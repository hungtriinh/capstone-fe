<template>
  <div class="main-login">
    <el-page-header content="Tìm kiếm bạn bè" @back="$router.push('/friends')">
    </el-page-header>
    <div class="main-content"></div>
    <div class="justify-center mb-5">
      <el-form
        ref="accountForm"
        :model="accountForm"
        autocomplete="off"
        label-position="left"
        @submit.native.prevent
      >
        <el-input
          v-model="accountForm.search"
          placeholder="Tìm kiếm theo số điện thoại"
          prefix-icon="el-icon-search"
          @keyup.enter.native="searchFriend">
        </el-input>
      </el-form>
    </div>
    <el-empty v-if="!listFriend.length" description="Không có người dùng khả dụng"></el-empty>
    <div v-else class="d-flex justify-center">
      <div>
        <FriendNew
          v-for="(item, index) in listFriend"
          :key="index"
          :infor="item"
          class="my-[8px]"
          @add="handleAddFriend"
        ></FriendNew>
      </div>
    </div>
  </div>
</template>

<script>
import FriendNew from '@/components/friends/FriendNew.vue'
import {
  FRIEND_SEARCH,
  INDEX_SET_ERROR,
  INDEX_SET_LOADING,
  INDEX_SET_SUCCESS,
  FRIEND_SEND
} from '~/store/store.const'
export default {
  name: 'NewPage',
  middleware: 'auth',
  components: {
    FriendNew
  },
  data() {
    return {
      accountForm: {
        search: ''
      },
      search: '',
      listFriend: []
    }
  },
  created() {
    this.searchFriend()
  },
  methods: {
    async handleAddFriend(friend) {
      this.$store.commit(INDEX_SET_LOADING, true)
      try {
        const response = await this.$store.dispatch(FRIEND_SEND, {
          UserFriendID: friend.userId
        })
        if (response.statusCode === 202) {
          await this.$store.commit(INDEX_SET_SUCCESS, {
            show: true,
            text: response.message
          })
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
    async searchFriend() {
      this.$store.commit(INDEX_SET_LOADING, true)
      try {
        const response = await this.$store.dispatch(FRIEND_SEARCH, this.accountForm.search)
        const { data, statusCode } = response
        if (statusCode === 202) {
          this.listFriend = data
        }
      } catch (e) {
        this.$store.commit(INDEX_SET_LOADING, false)
      }
      this.$store.commit(INDEX_SET_LOADING, false)
    }
  }
}
</script>
