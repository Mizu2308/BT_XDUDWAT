<script>
import Layout from "@/layouts/main.vue";
import PageHeader from "@/components/page-header";
import Widgets from "./components/widget.vue";
import Schedule from "./components/schedule.vue";
import Chart from "./components/Chart.vue";

export default {
  page: {
    title: "Dashboard",
    meta: [{ name: "description", content: '' }],
  },
  components: {
    Layout,
    PageHeader,
    Widgets,
    Schedule,
    Chart,
  },
  data() {
    return {
      title: this.$t("t-dashboards"),
      items: [
        {
          text: this.$t("t-dashboards"),
          href: "/",
        },
      ],
      date: null
    }
  },
  computed: {
    refreshData() {
      return localStorage.getItem('refresh') ? JSON.parse(localStorage.getItem('refresh')): false;
    },
    secondRefresh() {
      return localStorage.getItem('second')
    }
  },
  mounted() {
    if (this.refreshData) {
      this.$store.commit('settings/SET_REFRESH_DATA', this.refreshData);
    }
    if (this.secondRefresh) {
      this.$store.commit('settings/SET_SECONDS', this.secondRefresh * 1);
    }
  },
  methods: {
    onChangeDate(date) {
      this.date = date;
    }
  },
}
</script>

<template>
    <Layout>
        <PageHeader :title="title" :items="items" />

        <div class="row project-wrapper">
          <div class="col-md-12">
            <Widgets />
          </div>

          <div class="col-md-12">
            <div class="row">

              <div class="col-xl-8 col-md-12 col-xs-12 col-sm-12">
                <Chart @onChangeDate="onChangeDate" :dateDefault="date" />
              </div>

              <div class="col-xl-4 col-md-12 col-xs-12 col-sm-12">
                  <Schedule @onChangeDate="onChangeDate" :dateDefault="date" />
              </div>
            </div>
          </div>
        </div>

    </Layout>
</template>