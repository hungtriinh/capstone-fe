<template>
  <div class="navigation-bar">
    <div class="navigation">
      <img @click="handleRouter('/event')" src="@/assets/images/icons/event.svg" alt="">
      <img src="@/assets/images/icons/noti.svg" alt="">
      <img class="cursor-pointer" @click="handleRouter('/event/create')" src="@/assets/images/icons/add.svg" alt="">
      <img @click="handleRouter('/qr-scan')" src="@/assets/images/icons/qr.svg" alt="">
      <img src="@/assets/images/icons/account.svg" alt="">
    </div>
  </div>
</template>
<script>

export default {
  name: 'NavigationPage',
  methods: {
    handleRouter(router) {
      this.$router.push(router)
    }
  }
}
</script>
