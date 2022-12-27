<template>
  <div class="main-login">
    <div class="d-flex items-center justify-between">
      <el-page-header content="FAQ" @back="$router.push('profile')">
      </el-page-header>
    </div>

    <div class="main-content"></div>
    <div>
      <el-collapse v-model="activeNames" @change="handleChange">
        <el-collapse-item v-for="(item, key) in listFAQ" :key="key" :title="item.question" :name="item.id">
          <div>{{ item.answer }}</div>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<script>
import { INDEX_SET_LOADING, FAQ_LIST } from '~/store/store.const'
export default {
  name: 'SettingPage',
  middleware: 'auth',
  data() {
    return {
      listFAQ: [],
      activeNames: []
    }
  },
  created() {
    this.handleSave()
  },
  methods: {
    handleChange(val) {
      console.log(val)
    },
    async handleSave() {
      this.$store.commit(INDEX_SET_LOADING, true)
      try {
        const response = await this.$store.dispatch(FAQ_LIST)
        if (response.statusCode === 202) {
          this.listFAQ = response.data
          this.activeNames.push(response.data[0].id)
        }
      } catch (e) {
        this.$store.commit(INDEX_SET_LOADING, false)
      }
      this.$store.commit(INDEX_SET_LOADING, false)
    }
  }
}
</script>
