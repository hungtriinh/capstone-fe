<template>
  <div class="main-login">
    <el-page-header content="Yêu cầu gia nhập nhóm đã gửi" @back="$router.push('/profile')">
    </el-page-header>
    <div class="main-content"></div>
    <div>
      <el-empty v-if="!listRequest.length" description="Không có yêu cầu nào"></el-empty>
      <div v-else>
        <RequestCard v-for="(item, key) in listRequest" :key="key"
          :group="{ name: item.eventName }"
          :request="{ time: item.date, status: item.status }"
        ></RequestCard>
      </div>
    </div>
  </div>
</template>

<script>
import RequestCard from '../../components/group/RequestCard.vue'
import { GROUP_REQUEST, INDEX_SET_LOADING } from '~/store/store.const'
export default {
  name: 'RequestedPage',
  middleware: 'auth',
  components: {
    RequestCard
  },
  data() {
    return {
      listRequest: []
    }
  },
  created() {
    this.handleSave()
  },
  methods: {
    async handleSave() {
      this.$store.commit(INDEX_SET_LOADING, true)
      try {
        const response = await this.$store.dispatch(GROUP_REQUEST)
        if (response.statusCode === 202) {
          this.listRequest = response.data
        }
      } catch (e) {
        this.$store.commit(INDEX_SET_LOADING, false)
      }
      this.$store.commit(INDEX_SET_LOADING, false)
    }
  }
}
</script>
