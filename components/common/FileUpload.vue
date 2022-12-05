<template>
  <div
    class="upload-box text-center pa-8 d-flex justify-center items-center"
    :class="{ 'rounded-full': circle, 'rounded-lg': !circle }"
    :style="{ width: `${width}px`, height: `${height}px` }"
    @dragover.prevent="dragOver"
    @dragleave.prevent="dragLeave"
    @drop.prevent="drop($event)"
    @click="open"
  >
    <div
      class="preview-image"
      :class="{
        'bg-gray': previewURL,
        'rounded-full': circle,
        'rounded-lg': !circle,
      }"
    >
      <img
        v-show="previewURL"
        :src="previewURL"
        alt=""
        :class="{ 'rounded-full': circle, 'rounded-lg': !circle }"
      />
    </div>
    <div class="d-flex items-center justify-center">
      <input
        ref="media"
        name="media"
        accept="image/*"
        type="file"
        style="display: none"
        tabindex="-1"
        @change="(e) => onChange(e)"
      />
      <img
        class="select-image"
        src="~/assets/images/common/person.svg"
        alt=""
        :class="{ 'rounded-full': circle, 'rounded-lg': !circle }"
      />
    </div>
  </div>
</template>

<script>

export default {
  props: {
    width: {
      type: Number,
      default: () => 300
    },
    height: {
      type: Number,
      default: () => 200
    },
    circle: {
      type: Boolean,
      default: () => (false)
    },
    defaultImage: {
      type: String,
      default: () => ('')
    }
  },
  data() {
    return {
      filelist: [],
      previewURL: '',
      base64Image: ''
    }
  },
  mounted() {
    this.previewURL = this.defaultImage
  },
  methods: {
    dragOver() { },
    dragLeave() { },
    drop(e) {
      const files = e.dataTransfer.files
      const file = files[0]
      this.getFileUrl(file)
      this.createBase64Image(file)
    },
    onChange(event) {
      const file = event.target.files[0]
      this.getFileUrl(file)
      this.createBase64Image(file)
    },
    getFileUrl(file) {
      const theReader = new FileReader()
      theReader.onloadend = async() => {
        this.previewURL = await theReader.result
      }
      theReader.readAsDataURL(file)
    },
    createBase64Image(file) {
      const theReader = new FileReader()
      theReader.onloadend = async() => {
        this.base64Image = await theReader.result
        const extension = this.getFileExtension(file)
        const mimeType = file.type
        const removePostfix = `data:${mimeType};base64,`
        const base64Code = this.base64Image.replace(removePostfix, '')
        console.log('file', extension, mimeType)
        console.log('base64Code', removePostfix, base64Code)
        console.log('this.base64Image', this.base64Image)
        this.$emit('change', file, base64Code, extension, mimeType)
      }
      theReader.readAsDataURL(file)
    },
    open() {
      const el = this.$refs.media
      el.click()
    },
    getFileExtension(file) {
      if (file) {
        const extension = file.name.split('.').pop()
        return extension
      }
      return ''
    }
  }
}
</script>

<style lang="scss" scoped>
.upload-box {
  position: relative;
  border: 2px dashed #2d2e36;
  .preview-image {
    position: absolute;
    width: 98%;
    height: 97%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  .preview-image:hover {
    background-color: rgba(0, 0, 0, 0.15);
    cursor: pointer;
  }
}
.select-image {
//   width: 60%;
}
</style>
