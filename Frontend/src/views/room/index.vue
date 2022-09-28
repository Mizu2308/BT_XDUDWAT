

<template>
  <Layout>
    <PageHeader :title="state.title" :items="state.items" />

    <div class="row">
      <div class="card card-body table-component">

        <div class="align-middle flex justify-between table-header">
          <div class="table-header-title">ルームリスト</div>
          <div>
            <b-button @click="$router.push({ name: 'Create room', params: {} })" variant="dark" class="waves-effect waves-light">
              新規ルーム作成
            </b-button>
          </div>
        </div>

        <div class="card-body" id="room-list0table">

          <div class="table-responsive table-card ">
            <table class="table align-middle table-nowrap" id="customerTable">
              <thead class="">
                <tr>
                  <th class="sort" data-sort="currency_name" scope="col">ID</th>
                  <th class="sort" data-sort="current_value" scope="col">
                    Name
                  </th>
                  <th class="sort" data-sort="high" scope="col">Open Time</th>
                  <th class="sort" data-sort="high" scope="col">Close Time</th>
                  <th class="sort" data-sort="low" scope="col">Desciption</th>
                  <th class="sort" data-sort="market_cap" scope="col">
                    Status
                  </th>
                  <th scope="col"></th>
                </tr>
              </thead>
              <!--end thead-->
              <tbody class="list form-check-all">
                
                <template v-if="!state.loading">
                  <tr v-for="(room, index) of state.rooms" :key="index">
                    <td class="id">
                      {{ index + 1 }}
                    </td>
                    <td>{{ room.name }}</td>
                    <td class="pairs">{{ room.openTime }}</td>
                    <td class="high">{{ room.closeTime }}</td>
                    <td class="low">{{ room.description }}</td>
                    <td class="market_cap">{{ room.status }}</td>
                    <td>
                      <div class="text-end">
                        <b-button @click="$router.push({ name: 'Update room', params: { id: room.id } })" variant="primary" class="waves-effect waves-light mx-2">Edit</b-button>

                        <b-button @click="onClickDeleteRoom(room.id)" variant="danger" class="r waves-effect waves-light mx-2">
                          Delete
                        </b-button>
                      </div>
                    </td>
                  </tr>
                </template>

                <tr v-else>
                  <td colspan="7" class="text-center p-5">
                    <Loading />
                  </td>
                </tr>
              </tbody>
              <!--end tbody-->
            </table>
          </div>
          <div v-if="state.pagination" class="d-flex justify-content-end mt-3">
            <Pagination :pagination="state.pagination" @onChangePage="onChangePage" />
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script>
  import Layout from "@/layouts/main.vue";
  import PageHeader from "@/components/page-header";
  import Pagination from "@/components/pagination";
  import Loading from "@/components/Loading";
  import { onMounted, reactive } from "vue";
  import { roomService } from "@/services/room.service";
  import Swal from "sweetalert2";

  export default {
    name: "RoomList",
    components: {
      Layout,
      PageHeader,
      Pagination,
      Loading,
    },
    page: {
      title: "ルームリスト",
      meta: [{
        name: "description",
        content: ''
      }],
    },

    setup() {
      
      const state = reactive({
        loading: false,
        params: {
          page: 1,
          pageSize: 10
        },
        pagination: null,
        rooms: [],
        roomId: null,
        title: "ルームリスト",
        items: [{
            text: "Rooms",
            href: "/room/list",
          },
          {
            text: "ルームリスト",
            active: true,
          },
        ],
      });

      const getRooms = async () => {
        try {
          state.loading = true;
          let res = await roomService.getRooms(state.params);
          if (res) {
            state.pagination = res?.pagination || null;
            state.rooms = res?.data || [];
          }
          state.loading = false;
        } catch (error) {
          console.log(error);
          state.loading = false;
        }
      };

      const onChangePage = async (pageNumber) => {
        state.params.page = pageNumber;
        getRooms();
      };

      const onClickDeleteRoom = (roomId) => {
        state.roomId = roomId;
        Swal.fire({
          title: "Are you sure?",
          text: "You won't be able to revert this!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#34c38f",
          cancelButtonColor: "#f46a6a",
          confirmButtonText: "Yes, delete it!",
        }).then((result) => {
          if (result.value) {
            Swal.fire("Deleted!", "Your file has been deleted.", "success")
            .then((result) => {
              if (result.value) {
                // Reload data when delete room successfuly
                state.params.page = 1;
                getRooms();
              }
            });
          }
        });
      }

      onMounted(() => {
        getRooms();
      });

      return {
        state,
        getRooms,
        onChangePage,
        onClickDeleteRoom,
      };

    },
  };
</script>
