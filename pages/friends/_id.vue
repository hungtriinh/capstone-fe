<template>
  <div class="main-login">
    <div class="search d-flex justify-between items-center gap-10 mb-5">
      <el-form
        style="width: 100%"
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
          @input="searchFr">
        </el-input>
      </el-form>
      <div>
        <img src="~/assets/images/common/add-friend.svg" alt="" class="cursor-pointer" @click="handleGoToNewFriends"/>
      </div>
    </div>
    <div class="tab d-flex justify-around">
      <div
        class="text-[#848484] font-semibold pb-1 cursor-pointer"
        :class="{ 'tab-selected': selectedTab === 'friendList' }"
        @click="handleChangeTab('friendList')"
      >
        {{ $t('friends.friends_list') }}
      </div>
      <div
        class="text-[#848484] font-semibold pb-1 cursor-pointer"
        :class="{ 'tab-selected': selectedTab === 'friendRequest' }"
      >
        <el-badge v-if="count !== 0 && selectedTab !== 'friendRequest'" :value="count" class="item">
          <span @click="handleChangeTab('friendRequest')">{{
            $t('friends.friends_request')
          }}</span>
        </el-badge>
        <div v-else>
        <span @click="handleChangeTab('friendRequest')">{{
          $t('friends.friends_request')
        }}</span>
        </div>
      </div>
    </div>
    <CurrentFriendTab
      v-show="selectedTab === 'friendList'"
      :list-friend="listFriend"
      @reload="getListFriend"
    ></CurrentFriendTab>
    <RequestFriendTab
      v-show="selectedTab === 'friendRequest'"
      :list-friend="listRequestFriend"
      @reload="getListRequest"
    ></RequestFriendTab>
  </div>
</template>

<script>
import _ from 'lodash'
import CurrentFriendTab from '@/components/friends/CurrentFriendTab.vue'
import RequestFriendTab from '@/components/friends/RequestFriendTab.vue'
import { FRIEND_LIST, FRIEND_LIST_REQUEST, INDEX_SET_LOADING, FRIEND_COUNT, FRIEND_SEARCH_LIST } from '~/store/store.const'
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Friends',
  middleware: 'auth',
  components: {
    CurrentFriendTab,
    RequestFriendTab
  },
  data() {
    return {
      selectedTab: 'friendList',
      listFriend: [],
      listRequestFriend: [],
      count: '',
      accountForm: {
        search: ''
      }
    }
  },
  created() {
    this.getListFriend()
    this.getListRequest()
    this.countFriend()
  },
  methods: {
    handleChangeTab(tab) {
      this.selectedTab = tab
    },
    handleGoToNewFriends() {
      this.$router.push('/friends/new')
    },
    async getListFriend() {
      this.$store.commit(INDEX_SET_LOADING, true)
      try {
        const response = await this.$store.dispatch(FRIEND_LIST)
        const { data, statusCode } = response
        if (statusCode === 202) {
          this.listFriend = data
        }
      } catch (e) {
        this.$store.commit(INDEX_SET_LOADING, false)
      }
      this.$store.commit(INDEX_SET_LOADING, false)
    },
    async getListRequest() {
      this.$store.commit(INDEX_SET_LOADING, true)
      try {
        const response = await this.$store.dispatch(FRIEND_LIST_REQUEST)
        const { data, statusCode } = response
        if (statusCode === 202) {
          this.listRequestFriend = data
        }
      } catch (e) {
        this.$store.commit(INDEX_SET_LOADING, false)
      }
      this.$store.commit(INDEX_SET_LOADING, false)
    },
    async countFriend() {
      this.$store.commit(INDEX_SET_LOADING, true)
      try {
        const response = await this.$store.dispatch(FRIEND_COUNT)
        const { data, statusCode } = response
        if (statusCode === 202) {
          this.count = data
        }
      } catch (e) {
        this.$store.commit(INDEX_SET_LOADING, false)
      }
      this.$store.commit(INDEX_SET_LOADING, false)
    },
    async searchFriend() {
      this.$store.commit(INDEX_SET_LOADING, true)
      try {
        const response = await this.$store.dispatch(FRIEND_SEARCH_LIST, this.accountForm.search)
        const { data, statusCode } = response
        if (statusCode === 202) {
          this.listFriend = data
        }
      } catch (e) {
        this.$store.commit(INDEX_SET_LOADING, false)
      }
      this.$store.commit(INDEX_SET_LOADING, false)
    },
    searchFr: _.debounce(function(e) {
      this.searchFriend()
    }, 1000)
  }
}
</script>

<style lang="scss">
.tab {
  border-bottom: 3px solid transparent;
  &-selected {
    color: #000000;
    border-bottom: 3px solid #28a8d7;
  }
}
</style>
