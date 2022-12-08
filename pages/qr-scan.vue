<template>
  <div class="main-login">
    <div class="login login-width login-mobile">
      <el-page-header content="" @back="$router.push('/')">
      </el-page-header>
      <h3 class="title text-center">{{ $t('qr.scan') }}</h3>
      <div class="qr-code-main">
        <qr-code-stream />
      </div>
      <div class="text-center qr-share">
        <span class="text-bold">{{ $t('qr.scan_note') }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import QrCodeStream from '@/components/qrcode/QrCodeStream.vue'
export default {
  name: 'QrCode',
  components: {
    QrCodeStream
  }
}
</script>

<style lang="scss" scoped></style>
