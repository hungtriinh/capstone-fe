<template>
  <div class="main-login">
    <div class="search d-flex justify-between items-center mb-5">
      <div>Search Bar Here</div>
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
        <el-badge :value="12" class="item">
          <span @click="handleChangeTab('friendRequest')">{{
            $t('friends.friends_request')
          }}</span>
        </el-badge>
      </div>
    </div>
    <CurrentFriendTab
      v-show="selectedTab === 'friendList'"
      :list-friend="listFriend"
    ></CurrentFriendTab>
    <RequestFriendTab
      v-show="selectedTab === 'friendRequest'"
      :list-friend="listRequestFriend"
    ></RequestFriendTab>
  </div>
</template>

<script>
import CurrentFriendTab from '@/components/friends/CurrentFriendTab.vue'
import RequestFriendTab from '@/components/friends/RequestFriendTab.vue'
const MOCK_FRIEND = [
  { id: 1, name: 'Tran Viet Huy' },
  { id: 2, name: 'Trinh Hoang Hung' },
  { id: 3, name: 'Nguyen Huy Hoang' }
]
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Friends',
  components: {
    CurrentFriendTab,
    RequestFriendTab
  },
  data() {
    return {
      selectedTab: 'friendList',
      listFriend: [...MOCK_FRIEND],
      listRequestFriend: [...MOCK_FRIEND]
    }
  },
  methods: {
    handleChangeTab(tab) {
      this.selectedTab = tab
    },
    handleGoToNewFriends() {
      this.$router.push('/friends/new')
    }
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
