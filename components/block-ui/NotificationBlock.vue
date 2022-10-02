<template>
  <transition name="fade">
    <div v-if="notification && notification.show" id="toast">
      <div :class="'toast toast--' + notification.type">
        <div class="toast__icon">
          <img :src="notification.image" :alt="notification.type" />
        </div>
        <div class="toast__body">
          <h3 class="toast__title">{{ notification.text }}</h3>
          <p class="toast__msg">{{ notification.message }}</p>
        </div>
        <div class="toast__close" @click="close">
          <img src="@/assets/images/icons/close-dark.svg" alt="" />
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapState } from 'vuex'
import { INDEX_SET_ERROR, INDEX_SET_SUCCESS, INDEX_SET_WARNING } from '../../store/store.const'

export default {
  name: 'NotificationBlock',
  data() {
    return {
      notification: {},
      icons: [],
      timeout: null,
      timeHide: 4000
    }
  },

  computed: {
    ...mapState(['notifySuccess', 'notifyError', 'notifyWarning'])
  },

  watch: {
    notifySuccess() {
      if (this.notifySuccess.text) {
        this.close()
        this.notification = {
          ...this.notifySuccess,
          type: 'success',
          image: require('~/assets/images/icons/notification/success.svg')
        }
        this.$store.commit(INDEX_SET_SUCCESS, { show: false, text: '' })
        // eslint-disable-next-line no-return-assign
        this.timeout = setTimeout(() => this.notification.show = false, this.timeHide)
      }
    },
    notifyError() {
      if (this.notifyError.text) {
        this.close()
        clearTimeout(this.timeout)
        this.notification = {
          ...this.notifyError,
          type: 'error',
          image: require('~/assets/images/icons/notification/error.svg')
        }
        this.$store.commit(INDEX_SET_ERROR, { show: false, text: '' })
        // eslint-disable-next-line no-return-assign
        this.timeout = setTimeout(() => this.notification.show = false, this.timeHide)
      }
    },
    notifyWarning() {
      if (this.notifyWarning.text) {
        this.close()
        clearTimeout(this.timeout)
        this.notification = {
          ...this.notifyWarning,
          type: 'warning',
          image: require('~/assets/images/icons/notification/warning.svg')
        }
        this.$store.commit(INDEX_SET_WARNING, { show: false, text: '' })
        // eslint-disable-next-line no-return-assign
        this.timeout = setTimeout(() => this.notification.show = false, this.timeHide)
      }
    }
  },

  beforeDestroy() {
    clearTimeout(this.timeout)
  },

  methods: {
    close() {
      clearTimeout(this.timeout)
      this.notification.show = false
    }
  }
}
</script>
