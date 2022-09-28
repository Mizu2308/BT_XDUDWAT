

<template>
  <Layout>
    <PageHeader :title="state.title" :items="state.items" />

    <div class="row">
      <div class="card card-body table-component">

        <div class="align-middle flex justify-between table-header">
          <div class="table-header-title">新規ルーム作成</div>
          <div>
          </div>
        </div>

        <div class="card-body" id="create-room">
          <div class="row gy-2">

            <div class="col-xxl-3 col-md-6">
              <div>
                <label for="room-name" class="form-label">Name</label>
                <input v-model="v$.name.$model" :class="{ 'is-invalid': v$.name.$dirty && v$.name.$invalid }" type="text" class="form-control" id="room-name">

                <div v-if="v$.name.$error" class="invalid-feedback">
                  
                  <div v-if="v$.name.required.$invalid">
                    Name is required.
                  </div>

                </div>

              </div>
            </div>

            <div class="col-xxl-3 col-md-6">
              <div>
                <label for="room-name" class="form-label">Facility</label>

                <select
                  class="form-select mb-3"
                  aria-label="Default select example"
                  v-model="v$.facilityId.$model"
                  :class="{ 'is-invalid': v$.facilityId.$dirty && v$.facilityId.$invalid }"
                >
                  <option value="" >Select Facility</option>
                  <option v-for="(faci, i) in state.facilitys" :key="i" :value="faci.id">
                    {{ faci.name }}
                  </option>
                </select>

                <div v-if="v$.facilityId.$error" class="invalid-feedback">
                  
                  <div v-if="v$.facilityId.required.$invalid">
                    Facility is required.
                  </div>

                </div>

              </div>
            </div>

            <div class="col-xxl-3 col-md-6">
              <div>
                <label for="room-name" class="form-label">Type</label>

                <select
                  class="form-select mb-3"
                  aria-label="Default select example"
                  v-model="v$.type.$model"
                  :class="{ 'is-invalid': v$.type.$dirty && v$.type.$invalid }"
                >
                  <option value="">Select room type</option>
                  <option v-for="t in state.roomTypes" :key="t" :value="t">
                    {{ t }}
                  </option>
                </select>

                <div v-if="v$.type.$error" class="invalid-feedback">
                  
                  <div v-if="v$.type.required.$invalid">
                    Type is required.
                  </div>

                </div>

              </div>
            </div>

            <div class="col-xxl-3 col-md-6">
              <div>
                <label for="room-name" class="form-label">Sub Type</label>

                <select
                  class="form-select mb-3"
                  aria-label="Default select example"
                  v-model="v$.subType.$model"
                  :class="{ 'is-invalid': v$.subType.$dirty && v$.subType.$invalid }"
                >
                  <option value="">Select room sub type</option>
                  <option v-for="t in state.roomSubTypes" :key="t" :value="t">
                    {{ t }}
                  </option>
                </select>

                <div v-if="v$.subType.$error" class="invalid-feedback">
                  
                  <div v-if="v$.subType.required.$invalid">
                    Sub Type is required.
                  </div>

                </div>
              </div>
            </div>

            <div class="col-xxl-3 col-md-6">
              <div>
                <label for="capacity" class="form-label">Capacity</label>
                <input type="number" v-model="v$.capacity.$model" :class="{ 'is-invalid': v$.capacity.$dirty && v$.capacity.$invalid }" class="form-control" id="capacity">
              
                <div v-if="v$.capacity.$error" class="invalid-feedback">
                  
                  <div v-if="v$.capacity.required.$invalid">
                    Capacity is required.
                  </div>

                </div>

              </div>
            </div>

            <div class="col-xxl-3 col-md-6">
              <div>
                <label for="room-name" class="form-label">Peopel Count</label>
                <input v-model="state.room.currentPeopleCount" type="number" class="form-control" id="room-name">
              </div>
            </div>

            <div class="col-xxl-3 col-md-6">
              <div>
                <label for="room-name" class="form-label">Temperature</label>
                <input v-model="state.room.avgTemperature" type="number" class="form-control" id="room-name">
              </div>
            </div>

            <div class="col-xxl-3 col-md-6">
              <div>
                <label for="openTime" class="form-label">Open Time</label>
                <input v-model="v$.openTime.$model" type="number" class="form-control" id="openTime" :class="{ 'is-invalid': v$.openTime.$dirty && v$.openTime.$invalid }">
                
                <div v-if="v$.openTime.$error" class="invalid-feedback">
                  
                  <div v-if="v$.openTime.required.$invalid">
                    Close Time is required.
                  </div>

                  <div v-if="v$.openTime.numeric.$invalid">
                    Close Time must be numeric.
                  </div>

                  <div v-if="v$.openTime.minValue.$invalid">
                    The minimum value allowed is 0.
                  </div>

                  <div v-if="v$.openTime.maxValue.$invalid">
                    Close Time maximum value is 144.
                  </div>
                </div>

              </div>
            </div>

            <div class="col-xxl-3 col-md-6">
              <div>
                {{ v$.closeTime.$minValue }}
                <label for="closeTime" class="form-label">Close Time</label>
                <input
                  v-model="v$.closeTime.$model"
                  type="number"
                  class="form-control"
                  id="closeTime"
                  :class="{ 'is-invalid': v$.closeTime.$dirty && v$.closeTime.$invalid }"
                >

                <div v-if="v$.closeTime.$error" class="invalid-feedback">
                  
                  <div v-if="v$.closeTime.required.$invalid">
                    Close Time is required.
                  </div>

                  <div v-if="v$.closeTime.numeric.$invalid">
                    Close Time must be numeric.
                  </div>

                  <div v-if="v$.closeTime.minValue.$invalid">
                    The minimum value allowed is 0.
                  </div>

                  <div v-if="v$.closeTime.maxValue.$invalid">
                    Close Time maximum value is 144.
                  </div>
                </div>
              </div>
            </div>

            <div class="col-xxl-3 col-md-6">
                <div>
                    <label for="exampleFormControlTextarea5" class="form-label">Description</label>
                    <textarea v-model="state.room.description" class="form-control" id="exampleFormControlTextarea5"
                        rows="3"></textarea>
                </div>
            </div>

          </div>

          <div class="mt-5 text-end">
            <b-button @click="onSaveRoom" variant="primary" class="waves-effect waves-light">
            <span v-if="state.loading" class="d-flex align-items-center">
              <span class="spinner-border flex-shrink-0" role="status">
                <span class="visually-hidden">Loading...</span>
              </span>
            </span>
              Save
            </b-button>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script>
  import Layout from "@/layouts/main.vue";
  import PageHeader from "@/components/page-header";
  import { onMounted, reactive } from "vue";
  import { roomService } from "@/services/room.service";
  import { facilityService } from "@/services/facility.service";
  import useVuelidate from '@vuelidate/core';
  import { required, numeric, minValue, maxValue } from '@vuelidate/validators';
  import { useRouter } from 'vue-router';

  export default {
    name: "RoomList",
    components: {
      Layout,
      PageHeader,
    },
    page: {
      title: "List Rooms",
      meta: [{
        name: "description",
        content: ''
      }],
    },

    setup() {
      
      // Using vue router
      const router = useRouter();

      // State
      const state = reactive({
        loading: false,
        loadingAction: false,
        params: {
          page: 1,
          pageSize: 10
        },
        pagination: null,
        rooms: [],
        facilitys: [],
        roomTypes: [ 'SAUNA_ROOM_MALE', 'SAUNA_ROOM_FEMALE', 'OTHER' ],
        roomSubTypes: [ 'SAUNA_DRIED', 'SAUNA_WET', 'SAUNA_RESTED', 'RESTAURANT_ROOM', 'OTHER_ROOM_REST_SPACE', 'OTHER_ROOM_OTHER' ],
        room: {
          name: '',
          description: '',
          facilityId: '',
          subType: '',
          capacity: '',
          currentPeopleCount: '',
          avgTemperature: '',
          openTime: '',
          closeTime: '',
          isRegister: true,
        },
        roomId: null,
        title: "Create Room",
        items: [{
            text: "Rooms",
            href: "/room/list",
          },
          {
            text: "新規ルーム作成",
            active: true,
          },
        ],
      });
      

      // Validate rules room
      const rules = {
        name: { required }, 
        facilityId: { required },
        type: { required },
        subType: { required },
        capacity: { required, numeric },
        openTime: { required, numeric, minValue: minValue(0), maxValue: maxValue(144) },
        closeTime: { required, numeric, minValue: minValue(0), maxValue: maxValue(144) },
      };

      const v$ = useVuelidate(rules, state.room);

      // Function get all Facilities
      const getFacilities = async () => {
        try {
          state.loading = true;
          let res = await facilityService.getFacilities(state.params);
          if (res) {
            state.pagination = res?.pagination || null;
            state.facilitys = res?.data || [];
          }
          state.loading = false;
        } catch (error) {
          console.log(error);
          state.loading = false;
        }
      };

      const onChangePage = async (pageNumber) => {
        state.params.page = pageNumber;
      };

      // Function on create room
      const onSaveRoom = async () => {
        v$.value.$touch();

        const invalid = v$.value.$invalid;

        if (!invalid) {
          try {

            state.loadingAction = true;

            let res = await roomService.create(state.room);

            if (res) {
              router.push({ name: 'list room' });
            }

            state.loadingAction = false;
          } catch (error) {
            state.loadingAction = false;
          }
          console.log(state.room);
        }
      }

      onMounted(() => {
        getFacilities();
      });

      return {
        state,
        onChangePage,
        onSaveRoom,
        v$,
      };

    },
  };
</script>
