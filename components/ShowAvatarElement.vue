<template>
  <div class="show-avatar-element">
    <div class="d-flex show-avatar" :style="{ backgroundColor: backgroundColor }">
      <span>
        {{name}}
      </span>
    </div>
  </div>
</template>

<script>
import { removeVietnameseTones, getShortcutName, getColorShortcutName } from '@/utils/util'

export default {
  name: 'ShowAvatarElement',
  props: ['event'],
  data() {
    const listColor = [
      '#AB4CF5',
      '#E83434',
      '#11D35F',
      '#F017C0',
      '#F9B126',
      '#266EF9'
    ]
    return {
      backgroundColor: listColor[Math.floor(Math.random() * 6)]
    }
  },
  computed: {
    name() {
      const shortCutName = this.event.name ? this.event.name.slice(0, 1) : ''
      return getShortcutName(removeVietnameseTones(shortCutName))
    },
    color() {
      return getColorShortcutName(name)
    }
  }
}
</script>
