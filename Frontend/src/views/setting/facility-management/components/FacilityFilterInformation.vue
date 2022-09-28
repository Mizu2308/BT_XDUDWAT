<template>
  <div class="card card-body facility-filter-information">
    <div class="row table-component">
      <div class="col-xxl-12 col-md-12">
        <div class="align-middle flex justify-between table-header">
          <div class="table-header-title flex align-center justify-center">{{$t('t-facility-filter-information')}}</div>
          <div>
            <b-button variant="primary" :disabled="loadingAction || disabled" @click="onSubmit" class="waves-effect waves-light">
              <div class="flex">
                <span v-if="loadingAction" class="d-flex align-items-center mr-2">
                  <Loading />
                </span>
                {{ $t("t-renew") }}
              </div>
            </b-button>
          </div>
        </div>
      </div>

      <div class="col-xxl-12 col-md-12">
        <div v-for="cate in categories" :key="cate.id" class="row py-1">
          <div class="col-xxl-12 col-md-12">
            <div>{{ cate.name }}</div>
          </div>

          <div v-for="service in cate.services" :key="service.id" class="col-xxl-6 col-md-6">
            <div class="hstack gap-2 flex-wrap w-100">
              <input v-model="selectedServiceId" :disabled="disabled" type="checkbox" class="btn-check" :id="service.id" :value="service.id">
              <label class="btn btn-outline-dark w-100 white-space-pre-line" :for="service.id">{{ service.name }}</label>
            </div>
          </div>

        </div>
      </div>

    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from "vue";
import { categoriesService } from "@/services/categories.service";
import { facilityService } from "@/services/facility.service";
import Loading from "@/components/Loading";
import { useStore } from 'vuex';
import { ROLES } from "@/constants";
import Swal from "sweetalert2";
import i18n from '@/i18n'

export default {
  name: 'FacilityInformationFilter',
  components: {
    Loading,
  },
  props: {
    facility: {
      type: Object,
      default: () => {}
    }
  },
  setup(props) {
    const store = useStore();
    const loading = ref(false);
    const loadingAction = ref(false);
    const categories = ref([]);
    const selectedServiceId = ref([]);
    const currentUser = computed(() => store.getters['auth/currentUser']);
    const disabled = computed(() => currentUser.value.role !== ROLES.FACILITY_MANAGER);

    const params = ref({
      page: 1,
      pageSize: 20
    });

    const getCategories = async () => {
      try {
        loading.value = true;
        let res = await categoriesService.getCategories(params.value);
        if (res) {
          categories.value = res?.data.map(r => { return { ...r } }) || [];
          const facility = props?.facility || null;
          const facilityServices = facility?.facilityServices || [];
          if (facilityServices && facilityServices.length) {
            selectedServiceId.value = facilityServices.map(s => s.serviceId);
          }
        }
        loading.value = false;
      } catch (error) {
        loading.value = false;
      }
    }

    onMounted(() => {
      getCategories();
    });

    const onSubmit = async () => {
      try {
        loadingAction.value = true;
        let res = await facilityService.updateFacilityServices({ arrayServiceId: selectedServiceId.value });
        selectedServiceId.value = res.map(r => r.serviceId);
        loadingAction.value = false;
        Swal.fire({
          title: "",
          text: i18n.global.t('t-update-success'),
          icon: "success",
          showConfirmButton: false,
          timer: 2000,
        });
      } catch (error) {
        let message = error?.response?.data?.message || '';
        Swal.fire({
          title: "",
          text: message,
          icon: "error",
          showConfirmButton: false,
          timer: 2000,
        });
        loadingAction.value = false;
      }
    }

    return {
      loading,
      loadingAction,
      categories,
      selectedServiceId,
      disabled,
      onSubmit,
    };
  }
}
</script>

<style lang="scss">
  .facility-filter-information {
    .box-info {
      border-radius: 3px;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 35px;
      width: 100%;
      padding: 5px;
      cursor: pointer;
    }
  }
</style>