<template>
  <div>
    <div class="row">
      <div class="col-lg-12">
        <div class="card">
          <!-- Header-->
          <div class="card-header d-flex align-items-center">
            <h4 class="card-title mb-0 flex-grow-1 fs-16 fw-700">{{$t('t-personal-detail')}}</h4>
            <div class="flex-shrink-0">
              <button
                :disabled="disabled"
                  class="btn btn-dark fs-12 fw-700"
                  style="width: 100px; margin-right: 7px"
                  @click="redirectToCreateAccount"
              >
                {{ $t('t-create' )}}
              </button>
            </div>
          </div>

          <!-- Body-->
          <div class="card-body">
            <div class="row">
              <div class="">
                <div class="table-responsive">
                  <table class="table table-hover align-middle table-nowrap mb-3">

                    <thead class="list-account-table-header">
                    <tr>
                      <th v-for="(itemHeader, headerIndex) in tableDataHeader" :key="headerIndex">
                        <span class="fs-12 fw-700 table-header-th">{{ itemHeader.text }}</span>
                      </th>
                    </tr>
                    </thead>

                    <tbody>
                      <template v-if="!isLoading">
                        <tr v-for="itemBody in tableData" :key="itemBody.id">
                          <td v-for="(itemHeaderBody, idx) in tableDataHeader" :key="idx" class="fs-12 fw-500">
                              <span v-if="itemHeaderBody.hasIcon">
                                <span v-if="itemBody[itemHeaderBody.value]">
                                  <span class="d-flex align-items-start">
                                    <i class=" bx bx-check-circle fs-18 text-success mr-1"></i>
                                    {{ $t("t-enable") }}
                                  </span>
                              </span>
                                <span v-else>
                                  <span class="d-flex align-items-start">
                                    <i class=" bx bx-x-circle fs-18 text-danger"></i>
                                    {{ $t("t-disable") }}
                                  </span>
                                </span>
                              </span>

                            <div v-else-if="itemHeaderBody.hasButtons" class="w-100">
                              <div class="d-flex justify-content-end align-items-center w-100">
                                <button
                                    type="button"
                                    class="btn btn-primary"
                                    :disabled="disabled && currentUser.id !== itemBody.id"
                                    style="width: 100px; margin-right: 5px"
                                    @click="redirectToEditAccount(itemBody.id)"
                                >
                                  {{ $t("t-edit") }}
                                </button>
                                <button
                                    :disabled="disabled"
                                    type="button"
                                    class="btn btn-danger"
                                    style="width: 100px;"
                                    @click="handleDeleteAccount(itemBody.id)"
                                >
                                  {{ $t("t-delete") }}
                                </button>
                              </div>
                            </div>
                            <span v-else>{{ itemBody[itemHeaderBody.value] }}</span>
                          </td>
                        </tr>

                        <tr v-if="!tableData || tableData.length === 0">
                            <td colspan="7" class="text-center text-no-data p-5">
                                {{ $t('t-no-data') }}
                            </td>
                        </tr>
                      </template>
                      
                      <tr v-else>
                          <td colspan="7" class="text-center p-5">
                              <Loading />
                          </td>
                      </tr>

                    </tbody>
                  </table>
                  <div v-if="pagination" class="d-flex justify-content-end mt-3">
                    <Pagination :pagination="pagination" @onChangePage="onChangePage" />
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
import accountTableData from "@/views/account/tableData.json";
import { mapGetters } from "vuex";
import { ROLES } from "@/constants";
import Pagination from "@/components/pagination";
import Loading from "@/components/Loading";

export default {
  name: "ListAccountsTable",
  components: { Pagination, Loading },
  component: {
    Pagination
  },
  props: {
    tableData: { type: Array },
    pagination: { type: Object },
    showGetMoreButton: { type: Boolean, default: false },
    isLoading: { type: Boolean, default: false },
  },
  data() {
    return {
      tableDataHeader: [],
    };
  },
  computed: {
    ...mapGetters({
      currentUser: 'auth/currentUser'
    }),
    disabled() {
      return this.currentUser.role !== ROLES.FACILITY_MANAGER;
    },
  },
  created() {
    this.tableDataHeader = accountTableData.accounts.header;
  },
  methods: {
    onChangePage(pageNumber){
      this.$emit('onChangePage', pageNumber);
    },

    redirectToCreateAccount() {
      this.$router.push({ name: 'create-account' });
    },
    redirectToEditAccount(id){
      if (this.currentUser.role === ROLES.FACILITY_MANAGER){
        this.$router.push({ name: 'edit-account', params: { id: id } });
      } else if (this.currentUser.id === id) {
        this.$router.push('/profile');
      }
    },
    handleDeleteAccount(id){
      this.$emit('onDeleteAccount', id);
    },
    onGetMoreAccounts(){
      this.$emit('onGetMoreAccounts', true);
    },
  }
}
</script>

<style scoped>
.list-account-table-header {
  /*border: none;*/
}
</style>