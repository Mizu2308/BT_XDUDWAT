<template>
  <Layout>
    <PageHeader :title="title" :items="items"/>
    <ListAccountsTable
      :tableData="listAccounts"
      :showGetMoreButton="showGetMoreButton"
      :isLoading="isLoading"
      :pagination="pagination"
      @onChangePage="onChangePage"
      @onDeleteAccount="onDeleteAccount"
      @onGetMoreAccounts="onGetMoreAccounts"
    />
  </Layout>
</template>

<script>
import Layout from "../../../layouts/main.vue";
import PageHeader from "@/components/page-header";
import ListAccountsTable from "@/components/facility-account/ListAccountsTable";
import { userService } from "@/services/user.service";
import { DEFAULT_PARAMS, USER_STATUS } from "@/constants";
import Swal from "sweetalert2";
import i18n from "@/i18n";

export default {
  name: "List Account",
  components: {
    Layout, PageHeader, ListAccountsTable
  },
  data() {
    return {
      listAccounts: [],
      showGetMoreButton: false,
      currentPage: DEFAULT_PARAMS.PAGE,
      isUserClickGetMoreButton: false,
      isLoading: false,
      pagination: null,
      params: {
        "page": DEFAULT_PARAMS.PAGE,
        "pageSize": DEFAULT_PARAMS.PAGE_SIZE,
      },
      title: "ユーザ管理",
      items: [
        {
          text: "SETTING",
          href: "/"
        },
        {
          text: "ユーザー管理",
          active: true,
        }
      ],
    }
  },

  async created(){
    await this.getListUserAccounts(this.params);
  },

  methods: {
    onChangePage(pageNumber){
      this.params.page = pageNumber;
      this.getListUserAccounts(this.params)
    },

   async getListUserAccounts (params){
      try {
        this.isLoading = true;
        const res = await userService.getUsers(params);
        if (res && res.data.length > 0) {
          const data = res.data;
          let tempData = data.map((item, index) => {
            item.createdAt = this.handleTimeData(item.createdAt);
            item.updatedAt = this.handleTimeData(item.updatedAt);
            return {
              id: item.id,
              index: index + 1,
              email: item.email ? item.email : "",
              createdAt: item.createdAt,
              updatedAt: item.updatedAt,
              name: item.name ? item.name : "",
              disabled: item.status === USER_STATUS.ACTIVE,
            }
          });
          const pagination = res.pagination;
          this.pagination = res.pagination;
          if (!this.isUserClickGetMoreButton){
            this.showGetMoreButton = pagination.pageSize < pagination.totalCount;
            this.listAccounts = tempData;
          } else {
            this.listAccounts = [...this.listAccounts, ...tempData];
            this.listAccounts.forEach((item, index) => {
              delete item.index;
              item['index'] = index + 1;
            });
            this.showGetMoreButton = this.currentPage < pagination.totalPage;
          }
          this.currentPage = pagination.currentPage;
        }
        this.isLoading = false;
      } catch (err){
        this.isLoading = false;
        console.log(err);
      }
    },

    handleTimeData(data){
     let convertData = data;
     if (convertData){
       return convertData.substring(0, 10);
     } else return "";
    },

    async handleDeleteAccount (id) {
      try {
        const res = await userService.deleteUser(id);

        if(res) {
          this.listAccounts = this.listAccounts.filter(item => item.id !== id);
          this.listAccounts.forEach((item, index) => {
            delete item.index;
            item['index'] = index + 1;
          });
          return this.listAccounts;
        }
      } catch (err) {
        console.log(err);
        return null;
      }
    },

    onDeleteAccount(id){
      let user = this.listAccounts.find(a => a.id == id);

      Swal.fire({
        text: i18n.global.t('deleted_message', { message: user?.email || ''}),
        icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#34c38f",
          cancelButtonColor: "#f46a6a",
          confirmButtonText: i18n.global.t('yes'),
          cancelButtonText: i18n.global.t('cancel'),
      })
       .then((result) => {
         if(result.value){
          const tempArr = this.handleDeleteAccount(id);
            if (tempArr) {
                this.params= {
                "page": DEFAULT_PARAMS.PAGE,
                "pageSize": DEFAULT_PARAMS.PAGE_SIZE,
              };
                this.getListUserAccounts(this.params);
            }
          }
      });
    },

    async onGetMoreAccounts(isLoading) {
      this.isUserClickGetMoreButton = true;
      this.isLoading = isLoading;
      this.currentPage += 1;
      const params = {
        "page": this.currentPage,
        "pageSize": DEFAULT_PARAMS.PAGE_SIZE,
      };
      await this.getListUserAccounts(params);
    },

  }
}
</script>
