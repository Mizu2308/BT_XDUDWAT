<script>
import Swal from "sweetalert2";
import { userService } from '../../../../services';
import { cloneDeep } from 'lodash';
import * as moment from 'moment';
import { DATE_FORMAT } from '@/constants';
import { mapGetters } from 'vuex';
import Pagination from "@/components/pagination";
import Loading from "@/components/Loading";

export default {
    components: {
        Pagination,
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
                pageSize: 10,
                role: 'TABLET'
            },
            loading: false,
        }
    },
    methods: {
        formatDate(date) {
            return moment(date).format(DATE_FORMAT)
        },
        async getRequest(query) {
            try {
                this.loading = true;
                const response = await userService.getRequest(query);
                if (response.data) {
                    this.rows = cloneDeep(response.data);
                }
                if (response.pagination) {
                    this.pagination = cloneDeep(response.pagination);
                }
                this.loading = false;
            } catch (e) {
                this.loading = false;
                console.log('error')
            }
        },
        async refreshTable() {
            await this.getRequest(this.query)
        },
        navigateUpdateTabletAccount(userId) {
            if (this.currentUser.id === userId) {
                this.$router.push({ name: `profile` })
            } else {
                this.$router.push({ name: `admin-update-user`, params: { userId } })
            }
        },
        async handleDeleteTabletAccount(userId, username) {
            const accept = await Swal.fire({
                title:  this.$t('deleted_message', { message: username }),
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#34c38f",
                cancelButtonColor: "#f46a6a",
                confirmButtonText: this.$t('yes'),
                cancelButtonText: this.$t('cancel'),
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
                        icon: "error",
                        showConfirmButton: false,
                        timer: 1500,
                    });
                }
            }
        },
        paginate(pageNumber) {
            this.query.page = pageNumber;
        }
    },
    mounted() {
        this.getRequest(this.query);
    },
    computed: {
        bindingClass() {
            return {
                'flex-grow-1': 'flex-grow-1',
                'ms-2': this.loading,
                'fw-bold': 'fw-bold',
                'fs-12': 'fs-12'
            }
        },
        ...mapGetters({
            currentUser: 'auth/currentUser'
        }),
    },
    watch: {
        query: {
            handler(newValue) {
                this.getRequest(newValue)
            },
            deep: true
        }
    },
}
</script>

<template>
    <div class="table-responsive">
        <table class="table table-hover table-nowrap align-middle">
            <thead style="border-bottom: 0; border-bottom-color: transparent;">
                <tr>
                    <th scope="col"></th>
                    <th class="fs-12" scope="col">Creator Role</th>
                    <th class="fs-12" scope="col">Method</th>
                    <th class="fs-12" scope="col">Body</th>
                    <th class="fs-12" scope="col">{{ $t("t-registration-date") }}</th>
                    <th class="fs-12" scope="col">{{ $t("t-last-updated") }}</th>
                    <th class="fs-12" scope="col">{{ $t("t-enable-disable") }}</th>
                    <th scope="col"></th>
                </tr>
            </thead>
            <tbody>
                <template v-if="!loading">
                    <tr v-for="(row, index) in rows" :key="index">
                        <td class="fs-12 fw-medium text-normal" scope="row">
                            {{ index + 1 }}
                        </td>
                        <td data-bs-toggle="tooltip" data-bs-placement="bottom" :title="row?.facility?.name || ''"
                            class="text-truncate fs-12 fw-medium text-normal" style="max-width: 200px;">{{ row?.creatorRole || '' }}
                        </td>
                        <td data-bs-toggle="tooltip" data-bs-placement="bottom" :title="row.tabletId"
                            class="text-truncate fs-12 fw-bold text-black text-normal" style="max-width: 200px;">{{ row.method }}</td>
                            <td class="fs-12 fw-medium text-normal">{{ row.body }}</td>
                            <td class="fs-12 fw-medium text-normal">{{ formatDate(row.createdAt) }}</td>
                            <td class="fs-12 fw-medium text-normal">{{ formatDate(row.updatedAt) }}</td>
                            <td class="fs-12 fw-medium text-normal">{{ row.status }}</td>
                        <!-- <td>
                            <div v-if="row.status === 'ACTIVE'" class="d-flex flex-row align-items-center">
                                <i class="bx bx-check-circle fs-18 text-success"></i>
                                <p class="mb-0 ps-1 fs-12 fw-semibold text-normal">{{ $t("t-enable") }}</p>
                            </div>
                            <div v-else class="d-flex flex-row align-items-center">
                                <i class="bx bx-x-circle fs-18 text-danger"></i>
                                <p class="mb-0 ps-1 fs-12 fw-semibold text-normal">{{ $t("t-disable") }}</p>
                            </div>
                        </td> -->
                        <td>
                            <button class="btn btn-primary w-sm" size="sm"
                                @click="() => navigateUpdateTabletAccount(row.id)">
                                {{ $t("t-edit") }}
                            </button>
                            <button class="btn btn-danger ms-2 w-sm" size="sm"
                                @click="() => handleDeleteTabletAccount(row.id, row.username)">
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
            <tfoot v-if="pagination" style="border-bottom: 0; border-bottom-color: transparent;">
                <tr>
                    <td colspan="12">
                        <div class="d-flex flex-row justify-content-end">
                            <div class="d-flex justify-content-end mt-3">
                                <Pagination :pagination="pagination" @onChangePage="paginate" />
                            </div>
                        </div>

                    </td>
                </tr>
            </tfoot>
        </table>
    </div>
</template>
