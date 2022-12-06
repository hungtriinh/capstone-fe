<template>
  <div class="main-login">
    <div>
      <RequestCard
        :group="{ name: 'Design vui nhộn FBT' }"
        :request="{ time: '15:05 - 6/10/2022', status: 'approved' }"
      ></RequestCard>
      <RequestCard
        :group="{ name: 'Design vui nhộn FBT' }"
        :request="{ time: '15:05 - 6/10/2022', status: 'rejected' }"
      ></RequestCard>
      <RequestCard
        :group="{ name: 'Design vui nhộn FBT' }"
        :request="{ time: '15:05 - 6/10/2022', status: 'pending' }"
      ></RequestCard>
    </div>
  </div>
</template>

<script>
import RequestCard from '../../components/group/RequestCard.vue'
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Requested',
  components: {
    RequestCard
  }
}
</script>
