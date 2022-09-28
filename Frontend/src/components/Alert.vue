<template>
  <div class="alert-information">
    <div
      v-if="alertInfo && alertInfo.show"
      class="alert alert-primary alert-border-left alert-dismissible fade show flex align-items-center justify-content-center"
      role="alert"
      :class="{
        'alert-success': alertInfo.type == 'success',
        'alert-danger': alertInfo.type == 'error',
        'alert-info': alertInfo.type == 'info',
      }"
    >
      <i
        v-if="alertInfo.type == 'success'"
        class="bx bx-check-double me-3 align-middle fs-16"
      ></i>

      <i
        v-if="alertInfo.type == 'error'"
        class="bx bxs-error-circle me-3 align-middle fs-16"
      ></i>

      <i
        v-if="alertInfo.type == 'info'"
        class="bx bx-info-circle me-3 align-middle fs-16"
      ></i>

      <div>{{ alertInfo.message }}</div>
      <button
        @click="onClose"
        type="button"
        class="btn-close"
        data-bs-dismiss="alert"
        aria-label="Close"
      ></button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'Alert',
  computed: {
    ...mapGetters({
      alertInfo: 'settings/getAlertInfo'
    })
  },
  watch: {
    'alertInfo.show': function () {
      this.closeAlertAfterTimes();
    },
  },
  mouted() {
    this.closeAlertAfterTimes();
  },
  methods: {
    onClose() {
      this.$store.commit('settings/SET_ALERT', {
        ...this.alertInfo,
        show: false,
      });
    },
    closeAlertAfterTimes() {
      const vm = this;
      if (vm.alertInfo && vm.alertInfo.show) {
        setTimeout(function() {
          vm.onClose();
        }, 3000);
      }
    }
  },
}
</script>

<style lang="scss">
  .alert-information {
    position: fixed;
    right: 0;
    top: 0;
    z-index: 999999;
  }
</style>