<template>
  <div class="avatar-item" :style="{ 'background-color': getAvatarColor }">
    {{ getConvertedName }}
  </div>
</template>

<script>

export default {
  props: {
    user: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    getConvertedName() {
      const name = this.user.name
      if (name) {
        const nameParts = name.split(/\s+/)
        // console.log(nameParts)
        let convertName = ''
        if (nameParts) {
          if (nameParts.length === 1) {
            convertName = nameParts[0].charAt(0).toUpperCase()
          } else {
            convertName = `${nameParts[0].charAt(0).toUpperCase()}${nameParts[nameParts.length - 1].charAt(0).toUpperCase()}`
          }
        }
        return convertName
      }
      return '-'
    },
    getAvatarColor() {
      const colorList = [
        '#AFACFF',
        '#FF7171',
        '#DB91FC',
        '#FFACAC',
        '#FFB371',
        '#FFACF2',
        '#FFACE5',
        '#86C7FF',
        '#62B0D9',
        '#ACBFFF',
        '#FF8699',
        '#90E5AA',
        '#CCACFF',
        '#74AEFC',
        '#E0CD7E',
        '#FF8489',
        '#FFA167',
        '#64D0C3',
        '#86B0FF',
        '#D2F8E2',
        '#C69E9E',
        '#FFC68D',
        '#F8D2D2',
        '#E58383'
      ]
      const f = this.getConvertedName
      let index = 0
      if (f.length > 0) {
        index = f.charCodeAt(0)
        if (index > 65) index -= 65
        if (f.length > 1) {
          index += f.charCodeAt(1)
          if (index > 65) index -= 65
        }
      }

      return colorList[index]
    }
  }
}
</script>

<style scoped>
.avatar-item {
  width: 30px;
  height: 30px;
  padding: 1px;
  font-weight: 500;
  font-size: 15px;
  background: #aeacf9;
  border-radius: 99%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-transform: capitalize;
}
</style>
