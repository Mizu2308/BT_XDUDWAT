<template>
  <div>
    <cleave v-model="cardNumber"
      :options="options"
      class="form-control"
      name="card"/>
  </div>
</template>

<script>
  import Cleave from 'vue-cleave-component';

  export default {
    components: {
      Cleave
    },
    data() {
      return {
        options: {
          time: true,
          timeFormat: '24',
          timePattern: ['h', 'm']
        },
        inputModel: ''
      }
    },
  }
</script>