<template>
  <div class="card card-body room-sauna-dried">
    <div class="row table-component">
      <div class="col-xxl-12 col-md-12">
        <div class="align-middle flex justify-between table-header mx-2">
          <div class="table-header-title flex align-center justify-center">{{ $t(roomTitle) }}</div>
          <div>
            <b-button @click="onSubmit" :disabled="state.loadingAction || disabled" variant="primary" class="waves-effect waves-light">
              <div class="flex">
                <span v-if="state.loadingAction" class="d-flex align-items-center mr-2">
                  <Loading />
                </span>
                {{ $t('t-renew') }}
              </div>
            </b-button>
          </div>
        </div>
      </div>

      <div class="col-xxl-12 col-md-12 room-container">
        <table class="table align-middle table-nowrap">
          <thead class="">
            <tr>
              <th v-for="column in columns" :key="column.value" class="sort" data-sort="currency_name" scope="col">
                {{ $t(column.title) }}
              </th>
            </tr>
          </thead>

          <tbody class="list form-check-all">
                
            <template v-if="!state.loading">

              <tr v-for="(room, index) of state.rooms" :key="index">
                
                <td v-for="column in columns" :key="column.value">

                  <!-- Room id -->
                  <template v-if="column.value === 'ID'">
                    {{ index + 1 }}
                  </template>
                  <!-- Select type -->
                  <template v-else-if="column.value === 'type'">
                    <div>
                      <select
                        class="form-select select-room-type"
                        aria-label="Default select example"
                        v-model="v$.rooms.$model[index][column.value]"
                        :class="{ 'is-invalid': v$.rooms.$each.$response.$data[index][column.value].$invalid && invalid }"
                        :disabled="disabled"
                      >
                        <option v-for="t in state.roomTypes" :key="t" :value="t">
                          {{ $t(t) }}
                        </option>
                      </select>
                      <div class="invalid-feedback" v-if="v$.rooms.$each.$response.$data[index][column.value].$invalid && invalid">
                      
                        <div v-if="!v$.rooms.$each.$response.$data[index][column.value].required">
                          {{ $t('field_required', { field: $t('facility_category') }) }}
                        </div>

                      </div>
                    </div>
                  </template>

                  <template v-else-if="column.value === 'name'">
                    <div>
                      <input
                        v-model="v$.rooms.$model[index][column.value]"
                        :disabled="disabled"
                        :class="{
                          'is-invalid': (v$.rooms.$each.$response.$data[index][column.value].$invalid || duplicatedNames.includes(v$.rooms.$model[index][column.value]))
                            && invalid
                        }"
                        type="text" class="form-control room-name" id="name">
                      
                      <div class="invalid-feedback"
                        v-if="(v$.rooms.$each.$response.$data[index][column.value].$invalid
                        || duplicatedNames.includes(v$.rooms.$model[index][column.value])) && invalid">
                      
                        <div v-if="!v$.rooms.$each.$response.$data[index][column.value].required">
                          {{ $t('field_required', { field: $t('t-room-number')}) }}
                        </div>

                        <div v-else-if="!v$.rooms.$each.$response.$data[index][column.value].maxLength">
                          {{ $t('field_maxlength', { maxlength: 10, field: $t('t-room-number')}) }}
                        </div>

                        <div v-else-if="duplicatedNames.includes(v$.rooms.$model[index][column.value])">
                          {{ $t('duplicated', { field: $t('t-room-number')}) }}
                        </div>

                      </div>
                    </div>
                  </template>
                  
                  <template v-else-if="column.value === 'avgTemperature'">
                    <div class="form-icon right">
                      <input
                        type="number"
                        min="0"
                        v-model="v$.rooms.$model[index][column.value]"
                        :class="{ 'is-invalid': v$.rooms.$each.$response.$data[index][column.value].$invalid && invalid }"
                        :disabled="disabled" class="form-control" id="avgTemperature">
                      
                      <i v-if="!v$.rooms.$each.$response.$data[index][column.value].$invalid || !invalid">℃</i>

                      <div class="invalid-feedback" v-if="v$.rooms.$each.$response.$data[index][column.value].$invalid && invalid">
                    
                        <div v-if="!v$.rooms.$each.$response.$data[index][column.value].requiredIf">
                          {{ $t('field_required', { field: $t('t-average-temperature')}) }}
                        </div>

                        <div v-else-if="!v$.rooms.$each.$response.$data[index][column.value].alphaNum">
                          {{ $t('has-integer') }}
                        </div>

                        <div v-else-if="!v$.rooms.$each.$response.$data[index][column.value].maxLength">
                          {{ $t('field_maxlength', { maxlength: 3, field: $t('t-average-temperature')}) }}
                        </div>

                      </div>

                    </div>
                  </template>

                  <template v-else-if="column.value === 'capacity'">
                    <div>
                      <div class="form-icon right ">
                        <input
                          type="number"
                          v-model="v$.rooms.$model[index][column.value]"
                          class="form-control"
                          :class="{ 'is-invalid': v$.rooms.$each.$response.$data[index][column.value].$invalid && invalid }"
                          id="capacity"
                          :disabled="disabled"
                        >
                        <i v-if="!v$.rooms.$each.$response.$data[index][column.value].$invalid || !invalid">名</i>
                        <div class="invalid-feedback" v-if="v$.rooms.$each.$response.$data[index][column.value].$invalid && invalid">
                      
                          <div v-if="!v$.rooms.$each.$response.$data[index][column.value].required">
                            {{ $t('field_required', { field: $t('t-capacity')}) }}
                          </div>

                          <div v-else-if="!v$.rooms.$each.$response.$data[index][column.value].alphaNum">
                            {{ $t('has-integer') }}
                          </div>

                          <div v-if="!v$.rooms.$each.$response.$data[index][column.value].maxLength">
                            {{ $t('field_maxlength', { maxlength: 5, field: $t('t-capacity') }) }}
                          </div>

                        </div>
                      </div>
                    </div>
                  </template>

                  <template v-else-if="column.value === 'userTabletId'">
                    <select
                      class="form-select select-room-type"
                      v-model="room[column.value]"
                      :disabled="disabled"
                    >
                      <template v-if="room.user">
                        <option value="">{{$t('t-no-selection')}}</option>
                        <option v-for="t in [ ...userTablets, room.user ]" :key="t.id" :value="t.id">
                          {{ t.tabletId }}
                        </option>
                      </template>
                      <template v-else>
                        <option value="">{{$t('t-no-selection')}}</option>
                        <option v-for="t in [ ...userTablets ].filter(u => state.rooms.findIndex((r, i) => r[column.value] === u.id && index !== i) === -1)" :key="t.id" :value="t.id">
                          {{ t.tabletId }}
                        </option>
                      </template>
                    </select>
                  </template>

                  <template v-else-if="column.value === 'subTypeRested'">
                    <div>
                      <select
                        class="form-select select-room-type"
                        aria-label="Default select example"
                        v-model="v$.rooms.$model[index][column.value]"
                        :class="{ 'is-invalid': v$.rooms.$each.$response.$data[index][column.value].$invalid && invalid }"
                        @change="room.isEditable = true"
                        :disabled="disabled"
                      >
                        <option v-for="t in state.subTypesRested" :key="t" :value="t">
                          {{ $t(t) }}
                        </option>
                      </select>
                      <div class="invalid-feedback" v-if="v$.rooms.$each.$response.$data[index][column.value].$invalid && invalid">
                      
                        <div v-if="!v$.rooms.$each.$response.$data[index][column.value].requiredIf">
                          {{ $t('field_required', { field: $t('facility_category') }) }}
                        </div>

                      </div>

                    </div>
                  </template>

                  <template v-else-if="column.value === 'description'">
                    <input
                      type="text"
                      :disabled="disabled" @change="room.isEditable = true" class="form-control" id=""
                      :class="{ 'is-invalid': v$.rooms.$each.$response.$data[index][column.value].$invalid && invalid }"
                      v-model="v$.rooms.$model[index][column.value]">

                      <div class="invalid-feedback" v-if="v$.rooms.$each.$response.$data[index][column.value].$invalid && invalid">
                      
                        <div v-if="!v$.rooms.$each.$response.$data[index][column.value].maxLength">
                          {{ $t('field_maxlength', { maxlength: 255, field: $t('t-remarks') }) }}
                        </div>

                      </div>
                  </template>

                </td>
                
                <td class="text-end">
                  <b-button @click="onClickDeleteRoom(room, index)" :disabled="disabled" variant="danger" class="r waves-effect waves-light">
                    {{$t('t-delete')}}
                  </b-button>
                </td>
              </tr>

            </template>

            <tr v-else>
              <td colspan="7" class="text-center p-5">
                <Loading />
              </td>
            </tr>

            <tr v-if="!state.rooms || state.rooms.length === 0">
              <td colspan="7" class="text-center text-no-data p-5">
                {{ $t('t-no-data') }}
              </td>
            </tr>

          </tbody>

        </table>

        <div v-if="pagination" class="d-flex justify-content-end mt-3">
          <Pagination :pagination="pagination" @onChangePage="onChangePage" />
        </div>

        <div class="text-center my-3">
          <b-button @click="onAddNewRoom" :disabled="disabled" variant="dark" class="waves-effect waves-light">
            {{$t('t-create')}}
          </b-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { onMounted, reactive, computed, ref } from "vue";
  import { roomService } from "@/services/room.service";
  import { userService } from "@/services/user.service";
  import { required, helpers, maxLength, alphaNum, requiredIf } from '@vuelidate/validators';
  import useVuelidate from '@vuelidate/core';
  import { useStore } from 'vuex';
  import Swal from "sweetalert2";
  import Loading from "@/components/Loading";
  import { ROLES } from "@/constants";
  import i18n from '@/i18n'
  import Pagination from "@/components/pagination";
  import { cloneDeep } from 'lodash';

  export default {
    name: "SAUNAROOM",
    props: {
      roomSubType: {
        type: String,
        default: 'SAUNA_DRIED',
      }
    },
    components: {
      Loading,
      Pagination,
    },
    setup(props) {

      const store = useStore();
      const currentUser = computed(() => store.getters['auth/currentUser']);
      const disabled = computed(() => currentUser.value.role !== ROLES.FACILITY_MANAGER);
      const userTablets = ref([
      ]);
      const invalid = ref(false);
      const pagination = ref();
      const roomTitle = ref('t-sauna-room-information');
      const columns = ref([]);
      const duplicatedNames = ref([]);

      // Set title
      if (props.roomSubType === 'SAUNA_DRIED') {
        roomTitle.value = 't-sauna-room-information';
        columns.value = [
          {
            title: 'ID',
            value: 'ID',
          },
          {
            title: 't-registered-facility-category',
            value: 'type'
          },
          {
            title: 't-room-number',
            value: 'name'
          },
          {
            title: 't-average-temperature',
            value: 'avgTemperature',
          },
          {
            title: 't-capacity',
            value: 'capacity',
          },
          {
            title: 't-Sensor ID (automatic numbering)',
            value: 'userTabletId'
          }
        ];
      } else if (props.roomSubType === 'SAUNA_RESTED') {
        columns.value = [
          {
            title: 'ID',
            value: 'ID',
          },
          {
            title: 't-registered-facility-category',
            value: 'type'
          },
          {
            title: 't-room-number',
            value: 'name'
          },
          {
            title: 't-type',
            value: 'subTypeRested',
          },
          {
            title: 't-capacity',
            value: 'capacity',
          },
          {
            title: 't-remarks',
            value: 'description'
          }
        ];
        roomTitle.value = 't-break-information';
      } else {
        columns.value = [
          {
            title: 'ID',
            value: 'ID',
          },
          {
            title: 't-registered-facility-category',
            value: 'type'
          },
          {
            title: 't-room-number',
            value: 'name'
          },
          {
            title: 't-average-temperature',
            value: 'avgTemperature',
          },
          {
            title: 't-capacity',
            value: 'capacity',
          },
          {
            title: 't-remarks',
            value: 'description'
          }
        ];
        roomTitle.value = 't-water-bath-information';
      }

      const state = reactive({
        loading: false,
        loadingAction: false,
        params: {
          page: 1,
          pageSize: 5,
          subType: props.roomSubType,
          facilityId: currentUser?.value?.facilityId || '',
        },
        pagination: null,
        rooms: [],
        addedRooms: [],
        addedRoomsForm: [],
        roomsForm: [],
        roomId: null,
        roomTypes: [ 'SAUNA_ROOM_MALE', 'SAUNA_ROOM_FEMALE', 'OTHER' ],
        roomSubTypes: [ 'SAUNA_DRIED', 'SAUNA_WET', 'SAUNA_RESTED', 'RESTAURANT_ROOM', 'OTHER_ROOM_REST_SPACE', 'OTHER_ROOM_OTHER' ],
        subTypesRested: [ 'OUTSIDE_RESTED', 'INSIDE_RESTED' ],
        room: {
          name: '',
          description: '',
          facilityId: currentUser?.value?.facilityId || '',
          subType: props.roomSubType,
          type: '',
          capacity: null,
          currentPeopleCount: '',
          avgTemperature: null,
          openTime: 0,
          closeTime: 144,
          isRegister: true,
          userTabletId: ''
        },
      });
      
      // Function get all Rooms by room sub type
      const getRooms = async () => {
        try {
          state.loading = true;
          state.rooms.length = 0;
          state.rooms.length = 0;
          let res = await roomService.getRooms(state.params);
          if (res) {
            state.pagination = res?.pagination || null;
            pagination.value = res?.pagination || null;
            let data = res?.data || res || [];
            state.rooms = data?.map(d => {
              return {
                ...d,
                userTabletId: d?.user?.id || '',
                isRegister: false,
                isEditable: false,
              }
            }) || [];
          }
          state.loading = false;
        } catch (error) {
          console.log(error);
          state.loading = false;
        }
      };

      // Validate rules
      const rules = {
        rooms: {
          $each: helpers.forEach({
            name: { required, maxLength: maxLength(10) },
            facilityId: { required },
            type: { required },
            capacity: { required, maxLength: maxLength(5), alphaNum },
            avgTemperature: { maxLength: maxLength(3), alphaNum,
              requiredIf: requiredIf(function() {
                if (props.roomSubType === 'SAUNA_RESTED') {
                  return false;
                }
                return true;
              }),
            },
            description: { maxLength: maxLength(255)},
            subTypeRested: {
              requiredIf: requiredIf(function() {
                if (props.roomSubType === 'SAUNA_RESTED') {
                  return true;
                }
                return false;
              }),
            }
          }),
        },
        addedRooms: {
          $each: helpers.forEach({
            name: { required, maxLength: maxLength(10) },
            facilityId: { required },
            type: { required },
            capacity: { required, maxLength: maxLength(5), alphaNum },
            avgTemperature: {required, maxLength: maxLength(3), alphaNum }
          }),
        }
      };
      

      let v$ = useVuelidate(rules, state);

      // Function added room record to addedRooms
      const onAddNewRoom = () => {
        let room = { ...state.room };
        if (props.roomSubType === 'SAUNA_RESTED') {
          room = { ...state.room, subTypeRested: '' };
        }
        state.rooms = [ ...[ room ], ...state.rooms ];
      }

      // Function submit api room
      const submitRooms = async (rooms) => {
        try {
          state.loadingAction = true;
          await roomService.createUpdateRooms(rooms);
          state.loadingAction = false;
          Swal.fire({
            title: "",
            text: i18n.global.t('t-update-success'),
            icon: "success",
            showConfirmButton: false,
            timer: 2000,
          });
          state.params.page = 1;
          onLoadData();
          return;
        } catch(error) {
          state.loadingAction = false;
          duplicatedNames.value = error?.response?.data?.duplicatedNames || [];
          invalid.value = true;
          if (!duplicatedNames.value || duplicatedNames.value.length === 0) {
            let message = error?.response?.data?.message || '';
            Swal.fire({
              title: "",
              text: message,
              icon: "error",
              showConfirmButton: false,
              timer: 2000,
            });
          } 
          return;
        }
      }

      // Function submit data
      const onSubmit = async () => {
        v$.value.$touch();
        invalid.value = v$.value.$invalid;

        if (!v$.value.$invalid) {
          let roomsClone = cloneDeep(state.rooms);
          let rooms = roomsClone.map(r => {
            delete r.facility;
            delete r.updatedAt;
            delete r.createdAt;
            delete r.isRegister;
            delete r.isEditable;
            delete r.user;
            return {
              ...r
            }
          });
          if (rooms && rooms.length) {
            await submitRooms(rooms);
          }
        }
      }

      // Function onClick delete room
      const onClickDeleteRoom = (room, index) => {
        let message = '';
        if (props.roomSubType === 'SAUNA_DRIED') {
          message = i18n.global.t('t-sauna-room-information');
        } else if (props.roomSubType === 'SAUNA_WET') {
          message = i18n.global.t('t-water-bath-information');
        } else {
          message = i18n.global.t('t-break-information');
        }
        if (room.id) {
          Swal.fire({
            text: i18n.global.t('deleted_message', { message: message }),
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#34c38f",
            cancelButtonColor: "#f46a6a",
            confirmButtonText: i18n.global.t('yes'),
            cancelButtonText: i18n.global.t('cancel'),
          }).then(async (result) => {
            if (result.value) {
              try {
                let roomDeleteRes = await roomService.deleteRoom(room.id);
                if (roomDeleteRes) {
                  state.params.page = 1;
                  onLoadData();
                }
              } catch (error) {
                console.log(error);
              }
            }
          });
        } else {
          state.rooms.splice(index, 1);
        }
        
      }

      // Onload user tablets
      const getUserTablets = async () => {
        try {
          let res = await userService.getUserTablets();
          if (res) {
            userTablets.value = res;
          }
        } catch (error) {
          console.log(error);
        }
      }

      //Chane page pagination
      const onChangePage = (pageNumber) => {
        state.params.page = pageNumber;
        getRooms();
      }

      const onLoadData = () => {
        getRooms();
        if (props.roomSubType === 'SAUNA_DRIED') {
          getUserTablets();
        }
      }

      // On load rooms when components created
      onMounted(() => {
        onLoadData();
      });

      return {
        roomTitle,
        columns,
        state,
        pagination,
        v$,
        invalid,
        disabled,
        userTablets,
        duplicatedNames,
        onChangePage,
        onAddNewRoom,
        onSubmit,
        onClickDeleteRoom
      };
      
    },
  }
</script>

<style lang="scss">
.room-sauna-dried {
  .room-container {
    max-height: 500px;
    overflow: auto;
    .select-room-type {
      width: 200px;
    }
    .room-name {
      width: 180px;
    }
    input {
      min-width: 100px;
    }
    .room-w-100, .form-icon {
      width: 100px;
    }

    table {
      td {
        vertical-align: top;
      }
    }
  }
}
</style>