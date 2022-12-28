<template>
  <div class="qr-scan">
    <client-only>
      <qrcode-stream :camera="camera" @decode="onDecode" @init="onInit">
        <div v-if="validationSuccess" class="validation-success">
          Quét mã thành công!
        </div>

        <div v-if="validationFailure" class="validation-failure">
          Mã QR không tồn tại!
        </div>

        <div v-if="validationPending" class="validation-pending">
          Đang quét mã...
        </div>
      </qrcode-stream>
    </client-only>
  </div>
</template>

<script>

export default {
  name: 'QrScan',
  components: {
  },
  data() {
    return {
      isValid: undefined,
      camera: 'auto',
      result: null
    }
  },
  computed: {
    validationPending() {
      return this.isValid === undefined && this.camera === 'off'
    },

    validationSuccess() {
      return this.isValid === true
    },

    validationFailure() {
      return this.isValid === false
    }
  },

  methods: {
    onInit(promise) {
      promise
        .catch(console.error)
        .then(this.resetValidationState)
    },

    resetValidationState() {
      this.isValid = undefined
    },

    async onDecode(content) {
      this.result = content
      this.turnCameraOff()

      // pretend it's taking really long
      await this.timeout(2000)
      this.isValid = content.startsWith('http')

      // some more delay, so users have time to read the message
      if (this.isValid) {
        // await setTimeout(() => {
        //   window.open(this, '_blank')
        // })
        const a = document.createElement('a')
        document.body.appendChild(a)
        a.style = 'display: none'
        a.href = this.result
        a.click()
        document.body.removeChild(a)
      } else {
        await this.timeout(2000)
      }
      this.turnCameraOn()
    },

    turnCameraOn() {
      this.camera = 'auto'
    },

    turnCameraOff() {
      this.camera = 'off'
    },

    timeout(ms) {
      return new Promise(resolve => {
        window.setTimeout(resolve, ms)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.validation-success,
.validation-failure,
.validation-pending {
  position: absolute;
  width: 100%;
  height: 100%;

  background-color: rgba(255, 255, 255, .8);
  text-align: center;
  font-weight: bold;
  font-size: 1.4rem;
  padding: 10px;

  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
}
.validation-success {
  color: green;
}
.validation-failure {
  color: red;
}
</style>
