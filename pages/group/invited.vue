<template>
  <div class="main-login">
    <div>
      <InviteCard
        :group="{ name: 'Design vui nhộn FBT' }"
        :request="{
          time: '15:05 - 6/10/2022',
          status: 'approved',
          inviter: 'Trần Việt Huy',
        }"
        @accept="handleAccept"
        @reject="handleReject"
      ></InviteCard>
      <InviteCard
        :group="{ name: 'Design vui nhộn FBT' }"
        :request="{
          time: '15:05 - 6/10/2022',
          status: 'rejected',
          inviter: 'Trần Việt Huy',
        }"
        @accept="handleAccept"
        @reject="handleReject"
      ></InviteCard>
      <InviteCard
        :group="{ name: 'Design vui nhộn FBT' }"
        :request="{
          time: '15:05 - 6/10/2022',
          status: 'pending',
          inviter: 'Trần Việt Huy',
        }"
        @accept="handleAccept"
        @reject="handleReject"
      ></InviteCard>
    </div>
  </div>
</template>

<script>
import InviteCard from '../../components/group/InviteCard.vue'
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Requested',
  components: {
    InviteCard
  },
  methods: {
    handleAccept(group, request) {
      console.log('accept', group, request)
    },
    handleReject(group, request) {
      console.log('reject', group, request)
    }
  }
}
</script>
