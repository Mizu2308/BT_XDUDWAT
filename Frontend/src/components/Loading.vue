<template>
  <div :class="{ className, 'small-loading': type === 'small' }" class="spinner-border" role="status"><span class="sr-only"></span></div>
</template>

<script>
export default {
  name: 'Loading',
  props: {
    width: {
      type: Number,
      default: 18
    },
    height: {
      type: Number,
      default: 18
    },
    className: {
      type: String,
      default: 'text-light'
    },
    type: {
      type: String,
      default: 'small'
    }
  },
  computed: {
    styleObject() {
      return {
        width: `${this.width} px`,
        height: `${this.height} px`,
      };
    }
  },
}
</script>

<style lang="scss">
  .small-loading {
    width: 18px;
    height: 18px;
  }
</style>