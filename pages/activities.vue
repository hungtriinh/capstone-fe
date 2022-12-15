<template>
  <div class="main-login activity-page">
    <p class="text-[#273253] font-bold text-xl">
      {{ $t('activities.activities_history') }}
    </p>
    <div class="mt-6 d-flex justify-center">
      <div class="activity">
<!--        <ActivityNotification-->
<!--          :sender="sender"-->
<!--          :notification="notification"-->
<!--          class="mt-4"-->
<!--        ></ActivityNotification>-->
<!--        <ActivityNotification-->
<!--          :sender="sender"-->
<!--          :notification="notification"-->
<!--          class="mt-4"-->
<!--        ></ActivityNotification>-->
        <el-empty v-if="!notification.length" description="Không có hoạt động nào"></el-empty>

        <el-card v-else v-for="(item, key) in notification" :key="key" :body-style="{ padding: '10px' }" class=" card-item mb-10 ">
          <div v-html="item.content" class="text-normal text-blue">
          </div>
          <span class="time">{{item.date}}</span>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script>
// import ActivityNotification from '../components/activities/ActivityNotification.vue'
import {
  INDEX_SET_LOADING,
  ACTIVITY_GET
} from '~/store/store.const'
// const MOCK_NOTI = {
//   action: 'đã duyệt Chứng từ',
//   content: '[Uống Bia] - 500k',
//   receiver: 'Hội nhóm FPT',
//   time: '1 ngày'
// }
const MOCK_SENDER = {
  id: 1,
  name: 'Tran Viet Huy'
}
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Activities',
  // components: { ActivityNotification },
  created() {
    this.getActivity()
  },
  data() {
    return {
      notification: [],
      sender: { ...MOCK_SENDER }
    }
  },
  methods: {
    async getActivity() {
      this.$store.commit(INDEX_SET_LOADING, true)
      try {
        const response = await this.$store.dispatch(ACTIVITY_GET)
        const { data, statusCode } = response
        if (statusCode === 202) {
          this.notification = data
        }
      } catch (e) {
        this.$store.commit(INDEX_SET_LOADING, false)
      }
      this.$store.commit(INDEX_SET_LOADING, false)
    }
  }
}
</script>
