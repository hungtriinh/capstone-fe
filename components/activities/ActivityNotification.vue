<template>
  <div class="d-flex justify-center">
    <CommonTextAvatar :user="sender" class="mr-3"></CommonTextAvatar>
    <div style="width: 60%">
      <div class="text-[#273253]">
        <strong>{{ sender.name }}</strong>
        <span>{{ notification.action }}</span>
        <strong>{{ notification.content }}</strong>
        <span>{{ $t('activities.group') }}</span>
        <strong>{{ notification.receiver }}</strong>
      </div>
      <p>{{ notification.time }}</p>
    </div>
  </div>
</template>

<script>
import CommonTextAvatar from '../common/CommonTextAvatar.vue'
export default {
  components: {
    CommonTextAvatar
  },
  props: {
    sender: {
      type: Object,
      default: () => ({})
    },
    notification: {
      type: Object,
      default: () => ({})
    }
  }
}
</script>
