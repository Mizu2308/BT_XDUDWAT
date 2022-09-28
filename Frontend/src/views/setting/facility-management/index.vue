

<template>
  <Layout>
    <PageHeader :title="title" :items="items" />

    <div class="row">

      <div class="col-xxl-9 col-md-9">
        <div class="row">

          <div class="col-xxl-12 col-md-12" v-if="!loading && facility">
            <FacilityInformation @reload="loadFacility" :facility="facility" />
          </div>

          <div class="col-xxl-12 col-md-12">
            <Room room-sub-type="SAUNA_DRIED" />
          </div>

          <div class="col-xxl-12 col-md-12">
            <Room room-sub-type="SAUNA_WET" />
          </div>

          <div class="col-xxl-12 col-md-12">
            <Room room-sub-type="SAUNA_RESTED" />
          </div>

        </div>
      </div>

      <div class="col-xxl-3 col-md-3">
        <div class="row">
          <div class="col-xxl-12 col-md-12" v-if="!loading && facility">
            <FacilityFilterInformation @reload="loadFacility" :facility="facility" />
          </div>

          <div class="col-xxl-12 col-md-12">
            <Settings />
          </div>
        </div>
      </div>

    </div>
    
    </Layout>
</template>

<script>
import Layout from "../../../layouts/main.vue";
import PageHeader from "@/components/page-header";
import appConfig from "../../../../app.config";
import FacilityInformation from "./components/FacilityInformation";
import FacilityFilterInformation from "./components/FacilityFilterInformation";
import Settings from "./components/Settings";
import Room from "./components/Room";
import { facilityService } from "@/services/facility.service";

export default {
  page: {
    title: '施設情報管理',
    meta: [{ name: "description", content: appConfig.description }],
  },
  components: {
    Layout,
    PageHeader,
    FacilityInformation,
    FacilityFilterInformation,
    Settings,
    Room,
  },
  data() {
    return {
      title: this.$i18n.t('t-facility-information-management'),
      items: [
        {
          text: this.$i18n.t('t-setting').toUpperCase(),
          href: "/",
        },
        {
          text: this.$i18n.t('t-facility-information-management').toUpperCase(),
          active: true,
        },
      ],
      loading: false,
      facility: null,
      facilityServices: null,
      loadingFacilityInformation: false,
    };
  },
  mounted() {
    this.loadFacility();
  },
  methods: {
    async loadFacility() {
      try {
        this.loading = true;
        this.facility = await facilityService.getMyFacility();
        this.loading = false;
        
      } catch (error) {
        this.loading = false;
      }
    }
  },
};
</script>