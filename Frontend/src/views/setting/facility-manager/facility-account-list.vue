<script>
import Swal from "sweetalert2";
import { userService } from '../../../services';
import { cloneDeep } from 'lodash'
import Loading from "@/components/Loading";

export default {
    components: {
        Loading
    },
    setup() {

    },
    data() {
        return {
            rows: [],
            query: {
                search: '',
                page: 1,
                pageSize: 2,
                role: 'FACILITY_ACCOUNT'
            },
            loading: false,
            hasMore: true
        }
    },
    methods: {
        async getUsers(query) {
            try {
                this.loading = true;
                const response = await userService.getUsers(query);
                if (response.data) {
                    this.rows = this.rows.concat(cloneDeep(response.data));
                }
                if(response.pagination) {
                    const { totalPage } = response.pagination;
                    if (totalPage <= 1) {
                        this.hasMore = false;
                    }
                    if(query.page === totalPage) {
                        this.hasMore = false;
                    }
                }
                this.loading = false;
            } catch (e) {
                this.loading = false;
                console.log('error')
            }
        },
        async refreshTable() {
            try {
                const response = await userService.getUsers(
                    {
                        ...this.query,
                        page: 1,
                        pageSize: this.query.page * this.query.pageSize
                    }
                );
                if (response.data) {
                    this.rows = response.data;
                }
            } catch (e) {
                console.log('error')
            }
        },
        navigateUpdateFacility(userId) {
            this.$router.push({ name: `facility-manager-update-user`, params: { userId } })
        },
        async handleDeleteFacility(userId, username) {
            const accept = await Swal.fire({
                title: `Are you sure to delete ${username}?`,
                text: "You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#34c38f",
                cancelButtonColor: "#f46a6a",
                confirmButtonText: "Yes, delete it!",
            });

            if (accept.value) {

                try {
                    const response = await userService.deleteUser(userId);
                    if (response && response.deleted) {
                        console.log(response, 'delete');
                        await Swal.fire({
                            title: "Deleted!",
                            text: "User has been deleted.",
                            icon: "success",
                            showConfirmButton: false,
                            timer: 1500,
                        });
                        this.refreshTable();
                    }
                } catch (e) {
                    console.log('error', e)
                    await Swal.fire({
                        title: "",
                        text: "User delete failed!",
                        icon: "danger",
                        showConfirmButton: false,
                        timer: 1500,
                    });
                }
            }
        },
        paginate() {
            if (this.hasMore) {
                this.loading = true;
                this.query.page = this.query.page + 1;
                this.getUsers()
            }
        }
    },
    mounted() {
        this.getUsers(this.query);
    },
    computed: {
        bindingClass() {
            return {
                flexGrow: 'flex-grow-1',
                'ms-2': this.loading
            }
        }
    }
}
</script>

<template>
    <div class="table-responsive">
        <table class="table table-hover table-nowrap align-middle">
            <thead style="border-bottom: 0; border-bottom-color: transparent;">
                <tr>
                    <th scope="col"></th>
                    <th scope="col">{{ $t("t-name-of-facility") }}</th>
                    <th scope="col">{{ $t("t-email-address") }}</th>
                    <th scope="col">{{ $t("t-name") }}</th>
                    <th scope="col">{{ $t("t-registration-date") }}</th>
                    <th scope="col">{{ $t("t-last-updated") }}</th>
                    <th scope="col">{{ $t("t-enable-disable") }}</th>
                    <th scope="col"></th>
                </tr>
            </thead>
            <tbody>
                <template v-if="!loading">
                    <tr v-for="(row, index) in rows" :key="index">
                        <td scope="row">
                        {{ index + 1 }}
                        </td>
                        <td>{{ row.username }}</td>
                        <td>{{ row.email }}</td>
                        <td>{{ row.name }}</td>
                        <td>{{ row.createdAt }}</td>
                        <td>{{ row.updatedAt }}</td>
                        <td>
                            <div v-if="row.status === 'ACTIVE'" class="d-flex flex-row align-items-center">
                                <i class=" bx bx-check-circle fs-18 text-success"></i>
                                <p class="mb-0 ps-1">{{ $t("t-enable") }}</p>
                            </div>
                            <div v-else class="d-flex flex-row align-items-center">
                                <i class=" bx bx-x-circle fs-18 text-danger"></i>
                                <p class="mb-0 ps-1">{{ $t("t-disable") }}</p>
                            </div>
                        </td>
                        <td>
                                <button class="btn btn-primary w-sm btn-sm" size="sm"
                                    @click="() => navigateUpdateFacility(row.id)">
                                    {{ $t("t-edit") }}
                                </button>
                                <button size="sm" class="btn btn-danger ms-2 w-sm btn-sm"
                                    @click="() => handleDeleteFacility(row.id, row.username)">
                                    {{ $t("t-delete") }}
                                </button>
                        </td>
                    </tr>

                    <tr v-if="!rows || rows.length === 0">
                        <td colspan="8" class="text-center text-no-data p-5">
                            {{ $t('t-no-data') }}
                        </td>
                    </tr>
                </template>

                <tr v-else>
                    <td colspan="8" class="text-center p-5">
                        <Loading />
                    </td>
                </tr>
                
            </tbody>
            <tfoot v-if="hasMore" style="border-bottom: 0; border-bottom-color: transparent;">
                <tr>
                    <td colspan="12">
                        <div class="d-flex flex-row justify-content-center">
                            <b-button size="sm" variant="dark" class="btn btn-load w-sm" @click="paginate">
                                <span class="d-flex align-items-center">
                                    <span v-if="loading" class="spinner-border flex-shrink-0" role="status">
                                        <span class="visually-hidden">Loading...</span>
                                    </span>
                                    <span :class="bindingClass">
                                        {{ $t("t-more") }}
                                    </span>
                                </span>
                            </b-button>
                        </div>

                    </td>
                </tr>
            </tfoot>
        </table>
    </div>
</template>
