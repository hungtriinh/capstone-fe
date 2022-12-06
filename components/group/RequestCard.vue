<template>
  <div class="d-flex justify-between items-center my-3">
    <div class="d-flex items-center">
      <div class="p-[6px] bg-neutral-200 rounded-full mr-3">
        <img
          :src="getAvatar"
          alt=""
          class="rounded-full"
          style="width: 36px; height: 36px"
        />
      </div>
      <div class="text-[#273253]">
        <p class="font-bold text-lg">{{ group.name }}</p>
        <span class="text-sm">{{ request.time }}</span>
      </div>
    </div>
    <div>
      <div
        v-if="request.status === 'approved'"
        class="
          d-flex
          justify-center
          items-center
          text-sm
          bg-[#1DA01B]
          text-[#FFFFFF]
          rounded-lg
        "
        style="width: 88px; height: 32px"
      >
        {{ $t('group.approved') }}
      </div>
      <div
        v-else-if="request.status === 'rejected'"
        class="
          d-flex
          justify-center
          items-center
          text-sm
          bg-[#FF0000]
          text-[#FFFFFF]
          rounded-lg
        "
        style="width: 88px; height: 32px"
      >
        {{ $t('group.rejected') }}
      </div>
      <div
        v-else-if="request.status === 'pending'"
        class="
          d-flex
          justify-center
          items-center
          text-sm
          py-[]
          bg-[#D9D9D9]
          text-[#000000]
          rounded-lg
        "
        style="width: 88px; height: 32px"
      >
        {{ $t('group.pending') }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RequestCard',
  props: {
    group: {
      type: Object,
      default: () => ({})
    },
    request: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    getAvatar() {
      if (this.group.avatar) {
        return this.group.avatar
      }
      return require('~/assets/images/common/users.svg')
    }
  }
}
</script>
