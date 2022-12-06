<template>
  <div class="main-login">
    <p class="text-[#273253] font-bold text-xl">
      {{ $t('activities.activities_history') }}
    </p>
    <div class="mt-6 d-flex justify-center">
      <div>
        <ActivityNotification
          :sender="sender"
          :notification="notification"
          class="mt-4"
        ></ActivityNotification>
        <ActivityNotification
          :sender="sender"
          :notification="notification"
          class="mt-4"
        ></ActivityNotification>
      </div>
    </div>
  </div>
</template>

<script>
import ActivityNotification from '../components/activities/ActivityNotification.vue'
const MOCK_NOTI = {
  action: 'đã duyệt Chứng từ',
  content: '[Uống Bia] - 500k',
  receiver: 'Hội nhóm FPT',
  time: '1 ngày'
}
const MOCK_SENDER = {
  id: 1,
  name: 'Tran Viet Huy'
}
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Activities',
  components: { ActivityNotification },
  data() {
    return {
      notification: { ...MOCK_NOTI },
      sender: { ...MOCK_SENDER }
    }
  }
}
</script>
