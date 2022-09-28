<template>
  <div class="card card-body">
    <div class="row table-component">
      <div class="col-xxl-12 col-md-12">
        <div class="align-middle flex justify-between table-header">
          <div class="table-header-title flex align-center justify-center">{{$t('t-Management screen setting information')}}</div>
          <div>
            <b-button variant="primary" :disabled="loadingAction" @click="onSubmit" class="waves-effect waves-light">
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

      <div class="col-xxl-12 col-md-12 mt-3">
        <label for="name" class="form-label">{{$t("t-refresh")}}</label>
        <div class="form-icon right " :class="{ 'is-invalid': v$.second && invalid && v$.second.$invalid }">
          <input type="number" v-model="v$.second.$model" class="form-control" id="avgTemperature">
          <i class="font-style-nomal">{{$t('t-second')}}</i>
        </div>
        <div v-if="v$.second.$error && invalid" class="invalid-feedback">
          <div v-if="v$.second.required.$invalid">
            {{ $t('field_required', { field: $t('t-second')}) }}
          </div>
          <div v-if="v$.second.minValue.$invalid">
            {{ $t('t-refresh-error') }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import Loading from "@/components/Loading";
import useVuelidate from '@vuelidate/core'
import { minValue, required } from '@vuelidate/validators'
import { useStore } from 'vuex';
import Swal from "sweetalert2";
import i18n from '@/i18n'

export default {
  name: 'FacilitySettings',
  components: {
    Loading
  },
  setup() {
    const store = useStore();

    const loadingAction = ref(false);
    const invalid = ref(false);
    const second = ref(localStorage?.getItem('second') || '');

    onMounted(() => {
    });

    const rules = {
      second: {
        required,
        minValue: minValue(30)
      }
    }

    const v$ = useVuelidate(rules, { second });

    const onSubmit = async () => {
      v$.value.$touch();
      invalid.value = v$.value.$invalid;
      if (v$.value.$invalid) {
        return;
      }
      localStorage.setItem('second', second.value);
      store.commit('settings/SET_SECONDS', second.value * 1);
      Swal.fire({
        title: "",
        text: i18n.global.t('t-update-success'),
        icon: "success",
        showConfirmButton: false,
        timer: 2000,
      });
    };

    return {
      loadingAction,
      second,
      invalid,
      v$,
      onSubmit
    };
  }
}
</script>