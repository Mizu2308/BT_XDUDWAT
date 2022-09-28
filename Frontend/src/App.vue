<template>
 <div class="relative position-relative" :class="{ 'lang-en': locate === 'en', 'lang-jp': locate === 'jp' }">
  <router-view>
  </router-view>
  <Alert />
 </div>
</template>

<script>
import Alert from "@/components/Alert";

export default {
  name: 'App',
  components: {
    Alert,
  },
  computed: {
    locate() {
      return 'jp';
    }
  }
}
</script>
