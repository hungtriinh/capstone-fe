<template>
  <div class="d-flex cursor-pointer custom-card text-base p-[15px] bg-[#E4E7ED] text-[#1A051D] rounded-lg items-center justify-between" @click="$emit('click')">
    <div class="d-flex items-center">
      <slot name="prefix"></slot>
      <div>
        <span class="ml-[10px] text-bold" :class="{'text-[#1A051D]' : textColor === 'black', 'text-white' : textColor === 'via-white'}">{{ title }}</span>
        <br>
        <span v-if="phone" class="ml-[10px] time " :class="{'text-[#1A051D]' : textColor === 'black', 'text-white' : textColor === 'via-white'}">{{ phone }}</span>
      </div>
    </div>
    <div>
      <slot name="postfix"></slot>
    </div>
  </div>
</template>

<script>
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Card',
  props: {
    title: {
      type: String,
      default: ''
    },
    phone: {
      type: String,
      default: ''
    },
    textColor: {
      type: String,
      default: () => ('black')
    }
  }
}
</script>

<style lang="scss" scoped>
.custom-card {
    //width: 327px;
}
</style>
