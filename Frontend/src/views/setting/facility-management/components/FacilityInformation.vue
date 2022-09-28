<template>
  <div class="card card-body">
    <div class="row table-component">
      <div class="col-xxl-12 col-md-12">
        <div class="align-middle flex justify-between table-header">
          <div class="table-header-title flex align-center justify-center">{{ $t("t-facility-information") }}</div>
          <div>
            <b-button variant="primary" :disabled="state.loadingAction || disabled" @click="onSubmit" class="waves-effect waves-light">
              <div class="flex">
                <span v-if="state.loadingAction" class="d-flex align-items-center mr-2">
                  <Loading />
                </span>
                {{ $t("t-renew") }}
              </div>
            </b-button>
          </div>
        </div>
      </div>

      <div v-if="!state.loading" class="col-xxl-12 col-md-12">
        <div class="row py-3">
          <div class="col-xxl-4 col-md-4">

            <div>
              <span>{{$t("t-facility-ID")}}</span>
              <div class="font-weight-bold mt-2">{{ facilityForm.facilityIdStr }}</div>
            </div>

            <div class="mt-3">
              <label for="name" class="form-label">{{$t("t-facility-name")}} <span class="text-danger">*</span></label>
              <input
                type="text" v-model="v$.name.$model"
                :disabled="disabled"
                :class="{ 'is-invalid': (v$.name.$error && invalid) || invalidFacilityName }"
                @input="invalidFacilityName = false"
                class="form-control"
              >

              <div v-if="(v$.name.$error && invalid) || invalidFacilityName" class="invalid-feedback">
                
                <div v-if="v$.name.required.$invalid">
                  {{$t('field_required', { field: $t('facility-name') })}}
                </div>

                <div v-else-if="invalidFacilityName">
                  {{$t('duplicated', { field: $t('facility-name') })}}
                </div>

              </div>

            </div>

            <div class="mt-3">
              <label for="name" class="form-label">{{$t("t-address")}}<span class="text-danger">*</span></label>
              <div class="flex align-items-center" :class="{ 'is-invalid': (v$p.first.$invalid || v$p.last.$invalid) && invalid }">
                <div class="mr-2">〒</div>

                <input v-model="v$p.first.$model" :disabled="disabled" @change="getPostalCode" type="text" class="form-control">

                <div class="mx-2">ー</div>
                <input v-model="v$p.last.$model" :disabled="disabled" @change="getPostalCode" type="text" class="form-control">
              
              </div>

              <div v-if="(v$p.first.$invalid || v$p.last.$invalid) && invalid" class="invalid-feedback">
                
                <div v-if="v$p.first.required.$invalid || v$p.last.required.$invalid">
                  {{$t('field_required', { field: $t('postal-code') })}}
                </div>

                <div v-else-if="v$p.first.haftwidth.$invalid || v$p.last.haftwidth.$invalid">
                  {{$t('field_haftwidth', { field: $t('postal-code') })}}
                </div>

                <div
                  v-else-if="
                    v$p.first.minLength.$invalid
                    || v$p.last.minLength.$invalid
                    || v$p.first.maxLength.$invalid
                    || v$p.last.maxLength.$invalid
                  ">
                  {{$t('invalid_postal_code')}}
                </div>

              </div>


              <div class="mt-3">
                <label for="name" class="form-label">{{$t("t-address1")}}<span class="text-danger">*</span></label>
                <input type="text" v-model="v$.address1.$model" :class="{ 'is-invalid': invalid && v$.address1.$invalid }" :disabled="disabled" class="form-control">
                
                <div v-if="v$.address1.$error && invalid" class="invalid-feedback">
                
                  <div v-if="v$.address1.required.$invalid">
                    {{$t('field_required', { field: $t('t-address1') })}}
                  </div>

                  <div v-if="v$.address1.maxLength.$invalid">
                    {{$t('field_maxlength', { maxlength: 255, field: $t('t-address1') })}}
                  </div>

                </div>
              </div>

              <div class="mt-3">
                <label for="name" class="form-label">{{$t("t-address2")}}<span class="text-danger">*</span></label>
                <input type="text" v-model="v$.address2.$model" :class="{ 'is-invalid': invalid && v$.address2.$invalid }" :disabled="disabled" class="form-control">
                
                <div v-if="v$.address2.$error && invalid" class="invalid-feedback">
                
                  <div v-if="v$.address2.required.$invalid">
                    {{$t('field_required', { field: $t('t-address2') })}}
                  </div>

                  <div v-if="v$.address2.maxLength.$invalid">
                    {{$t('field_maxlength', { maxlength: 255, field: $t('t-address') })}}
                  </div>

                </div>
              </div>

              <div class="mt-3">
                <label for="name" class="form-label">{{$t("t-address3")}}</label>
                <input type="text" v-model="v$.address3.$model" :class="{ 'is-invalid': invalid && v$.address3.$invalid }" :disabled="disabled" class="form-control">

                <div v-if="v$.address2.$error && invalid" class="invalid-feedback">
                  <div v-if="v$.address3.maxLength.$invalid">
                    {{$t('field_maxlength', { maxlength: 255, field: $t('t-address3') })}}
                  </div>
                </div>
                
              </div>

            </div>

            <div class="mt-3">
              <label for="name" class="form-label">{{$t("t-map-information")}}<span class="text-danger">*</span></label>
              <input type="text" class="form-control"
                @input="checkLocation"
                :class="{ 'is-invalid': (v$l.mapInfomation.$error && invalid) || invalidLocation }" v-model="v$l.mapInfomation.$model" :disabled="disabled">
              
              <div v-if="(v$l.mapInfomation.$error && invalid) || invalidLocation" class="invalid-feedback">
                
                <div v-if="v$l.mapInfomation.required.$invalid">
                    {{ $t('field_required', { field: $t('map-information') }) }}
                </div>

                <div v-else-if="v$l.mapInfomation.location.$invalid">
                    {{ $t('invalid_location') }}
                </div>

                <div v-else-if="invalidLocation">
                    {{ $t('field_incorrect', { field: $t('map-information') }) }}
                </div>

            </div>

            </div>

            <div class="mt-3">
              <label for="name" class="form-label">{{$t("t-phone-number")}}</label>
              <input type="text" v-model="v$.phone.$model" :class="{ 'is-invalid': invalid && v$.phone.$invalid }" class="form-control" :disabled="disabled">

              <div v-if="v$.phone.$error && invalid" class="invalid-feedback">
                <div v-if="v$.phone.maxLength.$invalid">
                    {{ $t('field_maxlength', { maxlength: 17, field: $t('t-phone-number') }) }}
                </div>
                <div v-if="v$.phone.minLength.$invalid">
                    {{ $t('field_minlength', { minlength: 10, field: $t('t-phone-number') }) }}
                </div>
                <div v-if="v$.phone.phoneNumber.$invalid">
                    {{ $t('t-phone-error') }}
                </div>
              </div>

            </div>

            <div class="mt-3">
              <label for="name" class="form-label">{{$t("t-store-thumbnail-image")}}</label>

              <DropZone type="file-input" @selectedFile="selectedFile" :disabled="disabled" />

              <DropZone v-if="!facilityImage" :type="'drop-file'" @selectedFile="selectedFile" :disabled="disabled" />

              <img :src="facilityImage" v-if="facilityImage" alt="facilityForm-image" class="w-100">

            </div>

          </div>

          <div class="col-xxl-4 col-md-4">

            <div class="" :class="{ 'is-invalid': invalidHours && !state.businessHours.some(b => b.checked) }">
              <label for="name" class="form-label">{{$t("t-business-hours")}}<span class="text-danger">*</span></label>

              <div v-for="hour in state.businessHours" :key="hour.type" class="input-group mt-2">
                  <div class="input-group-text">
                      <input v-model="hour.checked" :disabled="disabled" class="form-check-input mt-0" type="checkbox" value=""
                          aria-label="Checkbox for following text input">
                  </div>
                  <div class="form-control">
                    <div class="flex">
                      <div class="mr-3 flex align-items-center">{{ hour.text }}</div>
                      <div class="mx-3 flex flex-wrap align-items-center justify-content-center">
                        <cleave
                          :disabled="disabled"
                          v-model="hour.start"
                          :options="state.hourtimePicker"
                          :raw="false"
                          placeholder="hh:mm"
                          class="form-control flatpickr-input w-80-px"
                        />
                        <div class="mx-3">-</div>
                        <cleave
                          :disabled="disabled"
                          v-model="hour.end"
                          :options="state.hourtimePicker"
                          placeholder="hh:mm"
                          :raw="false"
                          class="form-control flatpickr-input w-80-px"
                        />
                      </div>
                    </div>
                  </div>
              </div>

            </div>
            <div v-if="invalidHours && !state.businessHours.some(b => b.checked)" class="invalid-feedback">
              {{$t('field_required', { field: $t('t-business-hours') })}}
            </div>

            <div class="mt-3">
              <label for="name" class="form-label">{{$t("t-regular-holiday")}}</label>

              <div v-for="hour in state.regularHoliday" :key="hour.type" class="input-group mt-2">
                  <div class="input-group-text">
                      <input v-model="hour.checked" :disabled="disabled" class="form-check-input mt-0" type="checkbox" value=""
                          aria-label="Checkbox for following text input">
                  </div>
                  <div class="form-control">
                    <div class="flex align-items-center">
                      <div v-if="hour.text" class="mr-3 w-40-px">{{ $t(hour.text) }}</div>
                      <input v-if="hour.type === 'OTHER_DAY'" :disabled="disabled" type="text" v-model="hour.date" class="form-control ml-3" />

                    </div>
                  </div>
              </div>
            </div>

          </div>

          <div class="col-xxl-4 col-md-4">

            <div >
              <label for="facilityForm-costSt" class="form-label">
                {{ $t("t-price") }}<span class="text-danger">*</span>
              </label>

              <div class="form-icon right ">
                <input :disabled="disabled" type="number" :class="{ 'is-invalid': invalid && v$.cost.$invalid }" v-model="v$.cost.$model" class="form-control" />
              
                <i v-if="!v$.cost.$invalid || !invalid">{{ $t("t-unit") }}</i>

                <div v-if="v$.cost.$error && invalid" class="invalid-feedback">
                  
                  <div v-if="v$.cost.required.$invalid">
                    {{$t('field_required', { field: $t('t-price') })}}
                  </div>

                  <div v-else-if="v$.cost.alphaNum.$invalid">
                    {{$t('has-integer')}}
                  </div>

                  <div v-else-if="v$.cost.maxLength.$invalid">
                    {{$t('field_maxlength', { maxlength: 10, field: that.$t('t-phone') })}}
                  </div>

                </div>
              </div>
              
            </div>

            <div class="mt-3">
              <label for="facilityForm-costSt" class="form-label">
                {{ $t("t-fee") }}
              </label>
              <textarea v-model="v$.costStr.$model" :class="{ 'is-invalid': invalid && v$.costStr.$invalid }" :disabled="disabled" class="form-control mt-2" id="facilityForm-costSt"
                rows="3"></textarea>

              <div v-if="v$.costStr.$error && invalid" class="invalid-feedback">

                <div v-if="v$.costStr.maxLength.$invalid">
                  {{$t('field_maxlength', { maxlength: 255, field: $t('t-fee') })}}
                </div>

              </div>
            </div>

            <div class="mt-3">
              <label for="name" class="form-label">{{$t("t-registered-facility-category")}}</label>

              <div v-for="c in state.facilityCategory" :key="c.value" class="input-group mt-2">
                  <div class="input-group-text">
                      <input v-model="facilityForm[c.value]" :disabled="disabled" class="form-check-input mt-0" type="checkbox" value=""
                          aria-label="Checkbox for following text input">
                  </div>
                  <div class="form-control">
                    <div class="flex">
                      <div class="mr-3">{{ c.text }}</div>
                    </div>
                  </div>
              </div>
            </div>

            <div class="mt-3">
              <label for="name" class="form-label">{{$t("t-remarks")}}</label>
              <textarea :class="{ 'is-invalid': invalid && v$.description.$invalid }" class="form-control" v-model="v$.description.$model" :disabled="disabled" id="exampleFormControlTextarea5"
                        rows="3"></textarea>

              <div v-if="v$.description.$error && invalid" class="invalid-feedback">

                <div v-if="v$.description.maxLength.$invalid">
                  {{$t('field_maxlength', { maxlength: 255, field: $t('t-remarks') })}}
                </div>

              </div>
            </div>

            <div class="mt-3">
              <label for="name" class="form-label">{{$t("t-SNS account URL")}}</label>
              
              <div class="input-group">
                <span class="input-group-text" id="twiter">
                  <i class="mdi mdi-twitter"></i>
                </span>
                <input v-model="v$.twitter.$model" :class="{ 'is-invalid': invalid && v$.twitter.$invalid }" :disabled="disabled" type="text" class="form-control" placeholder=""
                    aria-label="Username" aria-describedby="twiter">
                
                <div v-if="v$.twitter.$error && invalid" class="invalid-feedback">
                
                  <div v-if="v$.twitter.maxLength.$invalid">
                    {{$t('field_maxlength', { maxlength: 255, field: $t('t-SNS account URL') })}}
                  </div>

                </div>
              </div>

              <div class="input-group mt-2">
                <span class="input-group-text" id="instagram">
                  <i class="mdi mdi-instagram"></i>
                </span>
                <input v-model="v$.instagram.$model" :class="{ 'is-invalid': invalid && v$.instagram.$invalid }" :disabled="disabled" type="text" class="form-control" placeholder=""
                    aria-label="Username" aria-describedby="instagram">

                <div v-if="v$.instagram.$error && invalid" class="invalid-feedback">

                  <div v-if="v$.instagram.maxLength.$invalid">
                    {{$t('field_maxlength', { maxlength: 255, field: $t('t-link') })}}
                  </div>

                </div>

              </div>

              <div class="input-group mt-2">
                <span class="input-group-text" id="website">
                  <i class=" bx bx-world"></i>
                </span>
                <input v-model="v$.website.$model" :class="{ 'is-invalid': invalid && v$.website.$invalid }" :disabled="disabled" type="text" class="form-control" placeholder=""
                    aria-label="Username" aria-describedby="website">

                <div v-if="v$.website.$error && invalid" class="invalid-feedback">

                  <div v-if="v$.website.maxLength.$invalid">
                    {{$t('field_maxlength', { maxlength: 255, field: $t('t-link') })}}
                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script>

  import { ref, watch, reactive, computed, onMounted } from "vue";
  import useVuelidate from "@vuelidate/core";
  import { facilityService } from "@/services/facility.service";
  import { uploadService } from "@/services/upload.service";
  import { useStore } from 'vuex';
  import { required, helpers, maxLength, minLength, alphaNum } from '@vuelidate/validators';
  import { getCountMinutes, convertMinutesToTimes } from "@/helpers/moment";
  import { imageURL } from "@/helpers/image";
  import Swal from "sweetalert2";
  import i18n from '@/i18n'
  import { ROLES, REGEX } from "@/constants";
  import { isNumber } from "@/helpers";

  // Components
  import Cleave from 'vue-cleave-component';
  import DropZone from "@/components/widgets/dropZone";
  import Loading from "@/components/Loading";
  
  export default {
    name: 'FacilityInformation',
    props: {
      facility: {
        type: Object,
        default: () => {}
      }
    },
    components: {
      DropZone,
      Loading,
      Cleave
    },
    setup(props, { emit }) {

      let files = ref([]);
      let dropzoneFile = ref(null);
      const invalid = ref(false);
      const invalidPostalCode = ref(false);

      const store = useStore();
      const currentUser = computed(() => store.getters['auth/currentUser']);
      const disabled = computed(() => currentUser.value.role !== ROLES.FACILITY_MANAGER);
      const fileUpload = ref(null);

      let state = reactive({
        loading: false,
        loadingAction: false,
        hourtimePicker: {
          time: true,
          timeFormat: '24',
          timePattern: ['h', 'm'],
          delimiter: ':'
        },
        businessHours: [
          {
            checked: false,
            text: '平日',
            type: 'weekday',
            start: '00:00',
            end: '00:00',
          },
          {
            checked: false,
            text: '土日',
            type: 'weekend',
            start: '00:00',
            end: '00:00',
          },
          {
            checked: false,
            text: '祝日',
            type: 'holiday',
            start: '00:00',
            end: '00:00',
          },
        ],
        regularHoliday: [
          {
            checked: false,
            text: 't-Monday',
            date: '1',
            descriptionFDO: '',
            type: "DAY_OF_WEEK",
          },
          {
            checked: false,
            text: 't-Tuesday',
            descriptionFDO: '',
            date: '2',
            type: "DAY_OF_WEEK",
          },
          {
            checked: false,
            text: 't-Wednesday',
            date: '3',
            descriptionFDO: '',
            type: "DAY_OF_WEEK",
          },
          {
            checked: false,
            text: 't-Thursday',
            date: '4',
            descriptionFDO: '',
            type: "DAY_OF_WEEK",
          },
          {
            checked: false,
            text: 't-Friday',
            date: '5',
            descriptionFDO: '',
            type: "DAY_OF_WEEK",
          },
          {
            checked: false,
            text: 't-Saturday',
            date: '6',
            descriptionFDO: '',
            type: "DAY_OF_WEEK",
          },
          {
            checked: false,
            text: 't-Sunday',
            date: '7',
            descriptionFDO: '',
            type: "DAY_OF_WEEK",
          },
          {
            checked: false,
            text: 't-holiday',
            descriptionFDO: '',
            date: '8',
            type: "HOLIDAY",
          },
          {
            checked: false,
            text: '',
            descriptionFDO: '',
            date: '',
            type: "OTHER_DAY",
          },
        ],
        facilityCategory: [
          {
            text: '男湯サウナ',
            value: 'isHaveRoomMale',
            key: 'SAUNA_ROOM_MALE'
          },
          {
            text: '女湯サウナ',
            value: 'isHaveRoomFemale',
            key: 'SAUNA_ROOM_FEMALE'
          },
          {
            text: '館内全体',
            value: 'isHaveRoomOther',
            key: 'OTHER'
          },
        ],
        postalCode: {
          first: '',
          last: ''
        },
        facilityId: currentUser?.value?.facilityId || '',
      });

      const facilityForm = ref({
        "name": "",
        "description": "",
        "lat": 0,
        "lng": 0,
        "currentPeopleCount": 0,
        "capacity": 0,
        "image": "",
        "phone": "",
        "website": "",
        "twitter": "",
        "instagram": "",
        "address1": "",
        "address2": "",
        "address3": "",
        "cost": 0,
        costStr: "",
        "costDescription": "",
        "surcharge": 0,
        "surchargeDescription": "",
        "openTime": 0,
        "closeTime": 1440,
        "isRegister": false,
        "status": "ACTIVE",
      });

      const facilityImage = ref('');

      const mapInfomation =  ref('');

      const invalidHours = ref(false);

      const invalidLocation = ref(false);

      const invalidFacilityName = ref(false);

      const drop = async (e) => {
        fileUpload.value = e.dataTransfer.files[0];
        files.value.push(fileUpload.value);
      };

      const selectedFile = async (file) => {
        fileUpload.value = file;
        facilityImage.value = URL.createObjectURL(file);
      };

      const uploadImage = async () => {
        
        try {
          let res = await uploadService.uploadFacility(fileUpload.value);
          return res?.filepath || '';
        } catch (error) {
          console.log(error);
          return '';
        }
      }

      watch(
        () => [...files.value],
        (currentValue) => {
          return currentValue;
        }
      );

      const regexHaftWidth = helpers.regex(REGEX.NUMBER_HAFTWIDTH);

      // rules
      const rules = {
        name: { required },
        cost: { required, alphaNum, maxLength: maxLength(10)},
        openTime: { required },
        closeTime: { required },
        status: { required },
        address1: { required, maxLength: maxLength(255) },
        address2: { required, maxLength: maxLength(255) },
        address3: { maxLength: maxLength(255) },
        description: { maxLength: maxLength(255) },
        costStr: { maxLength: maxLength(255) },
        twitter: { maxLength: maxLength(255) },
        instagram: { maxLength: maxLength(255) },
        website: { maxLength: maxLength(255) },
        phone: {
          maxLength: maxLength(17),
          minLength: minLength(10),
          phoneNumber: helpers.regex(REGEX.NUMBER_HAFTWIDTH)
        }
      };

      const v$ = useVuelidate(rules, facilityForm);

      const location = helpers.regex(/^[0-9\d.\d,\s,]*$/);
      const rulesLocation = {
        mapInfomation: {
          location,
          required
        }
      };

      const v$l = useVuelidate(rulesLocation, { mapInfomation });
      
      const rulesPostalCode = {
        first: { required , minLength: minLength(3), maxLength: maxLength(3), haftwidth: regexHaftWidth },
        last: { required , minLength: minLength(4), maxLength: maxLength(4), haftwidth: regexHaftWidth },
      }

      const v$p = useVuelidate(rulesPostalCode, state.postalCode);

      const getFacility = async () => {
        try {
          state.loading = true;
          let facilityRes = props.facility;
          if (facilityRes) {
            state.facility = facilityRes;
            facilityForm.value = facilityRes;
            facilityImage.value = imageURL(facilityRes?.image || null);
            // Set default state postalCode
            if (facilityRes && facilityRes.postalCode) {
              let postalCodeArr = facilityRes.postalCode.split('-');
              state.postalCode.first = postalCodeArr[0] || '';
              state.postalCode.last = postalCodeArr[1] || '';
            }

            // Set default state regularHoliday
            let datesOther = ``;
            if (facilityRes && facilityRes.fixedDayOff && facilityRes.fixedDayOff.length > 0) {
              for (let index = 0; index < facilityRes.fixedDayOff.length; index++) {
                const element = facilityRes.fixedDayOff[index];

                if (element.type === 'DAY_OF_WEEK') {
                  let findIndexNormal = state.regularHoliday.findIndex(r => r.date === element.date);
                  if (findIndexNormal > -1) {
                    let re = { ...state.regularHoliday[findIndexNormal], checked: true, date: element.date };
                    state.regularHoliday[findIndexNormal] = re;
                  }
                }
                

                if (element.type === 'OTHER_DAY') {
                  datesOther = [ ...datesOther, element.date ];
                }
                
              }

              // Set default state other day
              let findIndexOther = state.regularHoliday.findIndex(r => (r.type === 'OTHER_DAY'));
              if (findIndexOther > -1) {
                let re = { ...state.regularHoliday[findIndexOther], checked: facilityRes.checkOtherDay, date: datesOther ? datesOther.join(',') : '' };
                state.regularHoliday[findIndexOther] = re;
              }

              // Set default state holoday
              let findIndexHoliday = state.regularHoliday.findIndex(r => (r.type === 'HOLIDAY'));
              if (findIndexHoliday > -1) {
                let re = { ...state.regularHoliday[findIndexHoliday], checked: facilityRes.checkHoliday };
                state.regularHoliday[findIndexHoliday] = re;
              }

            }

            // Set default state businessHours
            for (let i = 0; i < state.businessHours.length; i++) {
              let business = state.businessHours[i];
              if (business.type === 'weekday') {
                business.start = convertMinutesToTimes(facilityRes.openTime);
                business.end = convertMinutesToTimes(facilityRes.closeTime);
                business.checked = facilityRes.checkTimeOpenNormal;
              }

              if (business.type === 'weekend') {
                business.start = convertMinutesToTimes(facilityRes.openTimeWeek);
                business.end = convertMinutesToTimes(facilityRes.closeTimeWeek);
                business.checked = facilityRes.checkTimeOpenWeek;
              }

              if (business.type === 'holiday') {
                business.start = convertMinutesToTimes(facilityRes.openTimeHoliday);
                business.end = convertMinutesToTimes(facilityRes.closeTimeHoliday);
                business.checked = facilityRes.checkTimeOpenHoliday;
              }
            }

            if (facilityRes) {
              let lat = facilityRes?.lat || '';
              let lng = facilityRes?.lng || '';
              if (lat && lng) {
                mapInfomation.value = `${lat},${lng}`;
              } else {
                mapInfomation.value = lat || lng || '';
              }
            }

          }
          state.loading = false;
        } catch (error) {
          state.loading = false;
          console.log(error);
        }
      };
      
      const checkLocation = () => {
        let formData = { ...facilityForm.value };
        if ((mapInfomation.value.match(/,/g) || []).length > 1) {
          invalidLocation.value = true;
          return;
        }

        formData.lat = mapInfomation.value?.split(',')[0]?.replace(/\s/g, '') || '';
        formData.lng = mapInfomation.value?.split(',')[1]?.replace(/\s/g, '') || '';
        
        if (!formData.lat || !formData.lng) {
          invalidLocation.value = true;
          return;
        } else {
          if ((formData.lat.match(/\./g) || []).length > 1 || (formData.lng.match(/\./g) || []).length > 1) {
            invalidLocation.value = true;
            return;
          }

          if (!isNumber(formData.lat) || !isNumber(formData.lng)) {
            invalidLocation.value = true;
            return;
          }
        }
        invalidLocation.value = false;
      }

      const getPostalCode = async () => {
        try {
          let postalCode = (state.postalCode.first + "" + state.postalCode.last);
          if (state.postalCode.first && state.postalCode.last) {
            let res = await facilityService.getPostalCodeInfo({ zipcode: postalCode });
            if (res) {
              if (res.results && res.results.length > 0) {
                facilityForm.value.address1 = `${res?.results[0]?.address1} ${res?.results[0]?.address2} ${res?.results[0]?.address3}`;
              } else {
                facilityForm.value.address1 = '';
              }
            }
          }
        } catch (error) {
          console.log(error);
        }
      }

      onMounted(() => {
        getFacility();
      });

      const onSubmit = async () => {
        v$.value.$touch();
        v$l.value.$touch();
        v$p.value.$touch();

        invalid.value = v$.value.$invalid || v$l.value.$invalid || v$p.value.$invalid || invalidLocation.value;
        invalidPostalCode.value = v$p.value.$invalid;

        // invalidHours
        if (!state.businessHours.some(h => h.checked)) {
          invalidHours.value = true;
          return;
        }

        if (!v$.value.$invalid && !v$l.value.$invalid && !v$p.value.$invalid) {
          try {
            let formData = { ...facilityForm.value };
            let postalCode = Object.keys(state.postalCode).map(function(k) { return state.postalCode[k] })?.join("-");
            formData.postalCode = postalCode !== '-' ? postalCode : '';
            formData.cost = formData.cost.toString();

            if ((mapInfomation.value.match(/,/g) || []).length > 1) {
              invalidLocation.value = true;
              return;
            }

            formData.lat = mapInfomation.value?.split(',')[0]?.replace(/\s/g, '') || '';
            formData.lng = mapInfomation.value?.split(',')[1]?.replace(/\s/g, '') || '';
            
            if (!formData.lat || !formData.lng) {
              invalidLocation.value = true;
              return;
            } else {
              if ((formData.lat.match(/\./g) || []).length > 1 || (formData.lng.match(/\./g) || []).length > 1) {
                invalidLocation.value = true;
                return;
              }

              if (!isNumber(formData.lat) || !isNumber(formData.lng)) {
                invalidLocation.value = true;
                return;
              }
            }

            for (let i = 0; i < state.businessHours.length; i++) {
              let business = state.businessHours[i];
              if (business.type === 'weekday') {
                formData.openTime = getCountMinutes('00:00', business.start);
                formData.closeTime = getCountMinutes('00:00', business.end);
                formData.checkTimeOpenNormal = business.checked;
              }

              if (business.type === 'weekend') {
                formData.checkTimeOpenWeek = business.checked;
                formData.openTimeWeek = getCountMinutes('00:00', business.start);
                formData.closeTimeWeek = getCountMinutes('00:00', business.end);
              }

              if (business.type === 'holiday') {
                formData.checkTimeOpenHoliday = business.checked;
                formData.openTimeHoliday = getCountMinutes('00:00', business.start);
                formData.closeTimeHoliday = getCountMinutes('00:00', business.end);
              }
            }

            let fixedDayOffDay = [ ...state.regularHoliday ].filter(r => r.checked && r.type !== 'HOLIDAY' && r.type !== 'OTHER_DAY').map(r => {
              let re = { ...r };
              delete re.checked;
              return {
                ...re,
              }
            });
            
            let holidayData = [ ...state.regularHoliday ].find(s => s.type === 'HOLIDAY');
            formData.checkHoliday = holidayData?.checked || false;

            let otherDayData = [ ...state.regularHoliday ].find(s => s.type === 'OTHER_DAY');
            let fixedDayOffOther = [];
            if (otherDayData) {
              let dates = otherDayData.date.split('、').join(',').split(',');
              for (let index = 0; index < dates.length; index++) {
                const date = dates[index].replace(/\s/g, '');
                if (date) {
                  let dayOffHoliday = { ...otherDayData, date: date };
                  delete dayOffHoliday.checked;
                  fixedDayOffOther = [
                    ...fixedDayOffOther,
                    dayOffHoliday
                  ]
                }
              }
              formData.checkOtherDay = otherDayData?.checked || false;
            }

            formData.fixedDayOff = [ ...fixedDayOffDay, ...fixedDayOffOther ].filter(f => f.date);

            if (fileUpload.value) {
              formData.image = await uploadImage();
            }

            state.loadingAction = true;

            await facilityService.updateMyFacility(formData);
            Swal.fire({
              title: "",
              text: i18n.global.t('t-update-success'),
              icon: "success",
              showConfirmButton: false,
              timer: 2000,
            });
            store.dispatch('auth/getUserProfile')
            emit('reload');
            state.loadingAction = false;
          } catch (error) {
            let message = error?.response?.data?.message || '';
            if (message.includes('already exists')) {
              invalidFacilityName.value = true;
            } else {
              Swal.fire({
                title: "",
                text: message,
                icon: "error",
                showConfirmButton: false,
                timer: 2000,
              });
            }
            
            state.loadingAction = false;

            console.log(error);
          }
        }
      }

      const getImageURL = (url) => {
        return imageURL(url);
      }

      return {
        state,
        facilityForm,
        v$, v$l, v$p,
        dropzoneFile, files, facilityImage, disabled, mapInfomation, invalid, invalidPostalCode,
        invalidHours,
        invalidLocation,
        invalidFacilityName,
        checkLocation,
        drop, selectedFile, onSubmit, getImageURL, getPostalCode };
    },
  }
</script>

<style lang="scss">
  .w-80-px {
    width: 80px;
  }

  .w-40-px {
    width: 40px;
  }
</style>