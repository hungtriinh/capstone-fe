<template>
  <div class="main-login">
    <div class="d-flex justify-center">
      <FileUpload
        :width="145"
        :height="145"
        :circle="true"
        :default-image="''"
        @change="handleSelectBanner"
      />
    </div>
  </div>
</template>

<script>
import FileUpload from '@/components/common/FileUpload.vue'
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Friends',
  components: {
    FileUpload
  },
  methods: {
    handleSelectBanner(file, base64Code, extension, mimeType) {
      console.log(file, base64Code, extension, mimeType)
    }
  }
}
</script>
