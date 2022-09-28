<script>
import moment from "moment";
import flatPickr from "vue-flatpickr-component";
import 'flatpickr/dist/flatpickr.css';

export default {
  name: 'DashboardEvents',
  props: {
    dateDefault: {
      type: String,
      default: ''
    }
  },
  components: {
    flatPickr,
  },
  data() {
    return {
      date: moment(new Date()).format('YYYY-MM-DD'),
      config: {
        inline: true,
        altFormat: "Y-m-d",
        dateFormat: "Y-m-d",
        disable: [
          function(date) {
            // return true to disable
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            return date > today;
          }
        ]
      },
      events: [
        {
          date: '09',
          time: '9:00AM',
          name: 'サウナーDAY 高温サウナ',
          description: '...'
        },
        {
          date: '12',
          time: '9:00AM',
          name: 'Lady’s Day',
          description: '...'
        },
        {
          date: '25',
          time: '9:00AM',
          name: 'ポイント2倍DAY',
          description: '...'
        },
        {
          date: '27',
          time: '9:00AM',
          name: 'SAUNISTトークインベント',
          description: 'Hall 1'
        },
      ]
    };
  },
  watch: {
    dateDefault: {
      handler() {
        if (this.dateDefault) {
          this.date = this.dateDefault;
        }
      },
      deep: true
    },
  },
  methods: {
    onChangeDate() {
      this.$emit('onChangeDate', this.date);
    },
  },
};
</script>

<template>
  <div class="card">
    <div class="card-header border-0">
      <h4 class="card-title fs-18 mb-0">{{ $t('t-calendar') }}</h4>
    </div>
    <!-- end cardheader -->
    <div class="card-body pt-0">
      <div class="upcoming-scheduled">
        <flat-pickr @onChange="onChangeDate" v-model="date" :config="config" />
      </div>

      <h4 class="card-title fs-18 mb-0 mt-3">{{ $t('t-event') }}</h4>

      <div v-for="event in events" :key="event.date" class="mini-stats-wid d-flex align-items-center mt-3">
        <div class="flex-shrink-0 avatar-sm">
          <span
            class="
              mini-stat-icon
              avatar-title
              rounded-circle
              text-info
              bg-soft-info
              fs-4
            "
          >
            {{ event.date }}
          </span>
        </div>
        <div class="flex-grow-1 ms-3">
          <h6 class="mb-1">{{ event.name }}</h6>
          <p class="text-muted mb-0">{{ event.description }}</p>
        </div>
        <div class="flex-shrink-0">
          <p class="text-muted mb-0">
            {{ event.time }}
          </p>
        </div>
      </div>
      <!-- end -->

      <div class="mt-3 text-center">
        <a
          href="javascript:void(0);"
          class="text-muted text-decoration-underline"
          >View all Events</a
        >
      </div>
    </div>
    <!-- end cardbody -->
  </div>
  <!-- end card -->
</template>
