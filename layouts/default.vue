<template>
  <div :class="['body-content']">
    <client-only>
<!--    <HeaderCommon />-->
    <NotificationBlock />
    <div class="home">
      <nuxt />
    </div>
    <LoadingBar />
<!--    <FooterCommon/>-->
    </client-only>
  </div>
</template>

<script>
// import HeaderCommon from '../components/layout/HeaderCommon'
import LoadingBar from '../components/LoadingBar'
import NotificationBlock from '../components/block-ui/NotificationBlock'
// import FooterCommon from '~/components/layout/FooterCommon'

export default {
  name: 'DefaultLayout',
  components: { NotificationBlock, LoadingBar }
}
</script>
