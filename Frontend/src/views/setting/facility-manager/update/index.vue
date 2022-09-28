<script>
import "@vueform/multiselect/themes/default.css";

import Layout from "@/layouts/main.vue";
import PageHeader from "@/components/page-header";
import { userService } from "@/services";
import { cloneDeep, union, keys, filter, isEqual } from 'lodash';
import Swal from "sweetalert2";

export default {
    page: {
        title: "ユーザ管理",
    },
    data() {
        return {
            title: this.$i18n.t('t-user-management'),
            items: [
                {
                    text: 'SETTING',
                    href: "/",
                },
                {
                    text: this.$i18n.t('t-user-management'),
                    active: true,
                },
            ],
            userInfo: {
                createdAt: "",
                email: "",
                facilityId: "",
                firstName: "",
                id: "",
                lastName: "",
                name: "",
                password: "",
                phone: "",
                role: "",
                roomId: "",
                status: "",
                updatedAt: "",
                username: "",
            },
            modelChange: {
                newPassword: "",
                confirmPassword: "",
            },
            isPassword: true,
            tab: 'personalDetails'
        };
    },
    components: {
        Layout,
        PageHeader
    },
    mounted() {
        this.getUserById()
    },
    methods: {
        async getUserById() {
            try {
                const { userId } = this.$route.params;
                const response = await userService.getUser(userId);
                if (typeof response.data === 'undefined') {
                    this.userInfo = cloneDeep(response);
                    this.userRef = cloneDeep(response);
                } else {
                    this.userInfo = response.data;
                    this.userRef = cloneDeep(response.data);
                }
                console.log(response, 'user')
            } catch (error) {
                console.log('eror', error)
            }
        },
        getChange() {
            const userInfo = cloneDeep(this.userInfo);
            const userRef = cloneDeep(this.userRef);
            const unionKeys = union(keys(userInfo), keys(userRef));
            return filter(unionKeys, key => {
                return userInfo[key] !== userRef[key]
            })
        },
        async onUpdateInfo(e) {
            e.preventDefault();
            try {

                const { id, firstName, lastName, status, email, phone } = this.userInfo;

                let body = {
                    firstName,
                    lastName,
                    email,
                    phone,
                    status
                };

                const changes = this.getChange();
                if (changes && changes.length > 0) {
                    for (const changeKey of changes) {
                        body[changeKey] = this.userInfo[changeKey]
                    }
                }

                console.log(body, 'body')
                const response = await userService.updateUser(
                    id,
                    body
                );
                console.log(response, "oK")
                if (response.data) {
                    console.log('dsadsa', response.data);
                    this.userInfo = { ...this.userInfo, ...response.data };
                    this.userRef = { ...this.userRef, ...response.data };

                    await Swal.fire({
                        title: "",
                        text: this.$t('t-update-success'),
                        icon: "success",
                        showConfirmButton: false,
                        timer: 1500,
                    });

                } else {
                    this.userInfo = { ...this.userInfo, ...response };
                    this.userRef = { ...this.userRef, ...response };

                    await Swal.fire({
                        title: "",
                        text: this.$t('t-update-success'),
                        icon: "success",
                        showConfirmButton: false,
                        timer: 1500,
                    });
                }

            } catch (error) {
                console.log(error, 'update user')
            }
        },
        async onUpdatePassword(e) {
            e.preventDefault();
            if (!isEqual(this.modelChange.confirmPassword, this.modelChange.newPassword)) {
                await Swal.fire({
                    title: "",
                    text: "Password not match",
                    icon: "error",
                    showConfirmButton: false,
                    timer: 1500,
                });
                return;
            }
            try {
                const { firstName, lastName, id } = this.userInfo;
                const response = await userService.updateUser(
                    id,
                    { firstName, lastName, password: this.modelChange.newPassword }
                );
                console.log(response, "updatePassword")
                if (response.data) {
                    console.log('dsadsa', response.data)
                    this.userInfo = { ...this.userInfo, ...response.data };
                    this.userRef = { ...this.userRef, ...response.data };
                    await Swal.fire({
                        title: "",
                        text: this.$t('t-update-success'),
                        icon: "success",
                        showConfirmButton: false,
                        timer: 1500,
                    });
                } else {
                    this.userInfo = { ...this.userInfo, ...response };
                    this.userRef = { ...this.userRef, ...response };
                    await Swal.fire({
                        title: "",
                        text: this.$t('t-update-success'),
                        icon: "success",
                        showConfirmButton: false,
                        timer: 1500,
                    });
                }
            } catch (error) {
                console.log(error, 'update user')
            }
        },
        clearInfoChange() {
            this.userInfo = cloneDeep(this.userRef);
        },
        onStatusChange(event) {
            this.userInfo.status = event.target.checked ? 'ACTIVE' : 'INACTIVE';
        },
        toggle() {
            this.isPassword = !this.isPassword;
        }
    },
};
</script>

<template>
    <Layout>
        <PageHeader :title="title" :items="items" />
        <div class="position-relative mx-n4 mt-n4">
            <div class="profile-wid-bg profile-setting-img">
                <img src="@/assets/images/profile-bg.jpg" class="profile-wid-img" alt="" />
                <div class="overlay-content">
                    <div class="text-end p-3">
                        <div class="p-0 ms-auto rounded-circle profile-photo-edit">
                            <input id="profile-foreground-img-file-input" type="file"
                                class="profile-foreground-img-file-input" />
                            <label for="profile-foreground-img-file-input" class="profile-photo-edit btn btn-light">
                                <i class="ri-image-edit-line align-bottom me-1"></i> Change
                                Cover
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-xxl-3">
                <div class="card mt-n5">
                    <div class="card-body p-4">
                        <div class="text-center">
                            <div class="
                  profile-user
                  position-relative
                  d-inline-block
                  mx-auto
                  mb-4
                ">
                                <img src="@/assets/images/users/avatar-1.jpg" class="
                    rounded-circle
                    avatar-xl
                    img-thumbnail
                    user-profile-image
                  " alt="user-profile-image" />
                                <div class="avatar-xs p-0 rounded-circle profile-photo-edit">
                                    <input id="profile-img-file-input" type="file" class="profile-img-file-input" />
                                    <label for="profile-img-file-input" class="profile-photo-edit avatar-xs">
                                        <span class="avatar-title rounded-circle bg-light text-body">
                                            <i class="ri-camera-fill"></i>
                                        </span>
                                    </label>
                                </div>
                            </div>
                            <h5 class="fs-16 mb-1">{{ userInfo.name }}</h5>
                        </div>
                    </div>
                </div>
                <!--end card-->
                <div class="card">
                    <div class="card-body">
                        <div class="d-flex align-items-center mb-3">
                            <div class="flex-grow-1">
                                <h5 class="card-title mb-0">{{ $t("t-enable-disable") }}</h5>
                            </div>
                            <div class="flex-shrink-0">
                                <div class="form-check form-switch">
                                    <input class="form-check-input" type="checkbox" role="switch"
                                        id="flexSwitchCheckChecked"
                                        :checked="userInfo.status === 'ACTIVE' ? true : false" @change="onStatusChange">
                                </div>
                            </div>
                        </div>
                        <div class="d-flex justify-content-center mb-2">
                            <div class="d-flex align-items-center">
                                <i v-if="userInfo.status === 'ACTIVE'"
                                    class="bx bx-check-circle fs-22 text-success"></i>
                                <i v-else class="bx bx-x-circle fs-22 text-danger"></i>

                                <h6 class="mb-0 fs-16 ps-1" v-if="userInfo.status === 'ACTIVE'">{{ $t("t-enable") }}
                                </h6>
                                <h6 class="mb-0 fs-16 ps-1" v-else>{{ $t("t-disable") }}</h6>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!--end col-->
            <div class="col-xxl-9">
                <div class="card mt-xxl-n5">
                    <div class="card-header">
                        <ul class="
                nav nav-tabs-custom
                rounded
                card-header-tabs
                border-bottom-0
              " role="tablist">
                            <li class="nav-item">
                                <a :class="{ 'active': tab == 'personalDetails' }" @click="tab = 'personalDetails'" class="nav-link text-body" data-bs-toggle="tab" href="#personalDetails"
                                    role="tab">
                                    <i class="fas fa-home"></i>
                                    {{ $t('t-personal-detail') }}
                                </a>
                            </li>
                            <li class="nav-item">
                                <a :class="{ 'active': tab == 'changePassword' }" @click="tab = 'changePassword'" class="nav-link text-body" data-bs-toggle="tab" href="#changePassword" role="tab">
                                    <i class="far fa-user"></i>
                                    {{ $t('t-change-password') }}
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div class="card-body p-4">
                        <div class="tab-content">
                            <div class="tab-pane" :class="{ 'active': tab == 'personalDetails'}" id="personalDetails" role="tabpanel">
                                <form @submit="onUpdateInfo">
                                    <div class="row">
                                        <div class="col-lg-6">
                                            <div class="mb-3">
                                                <label for="firstnameInput" class="form-label">{{ $t("t-firstname")
                                                }}</label>
                                                <input v-model="userInfo.firstName" type="text" class="form-control"
                                                    id="firstnameInput" :placeholder="$t('t-enter-fistname')" />
                                            </div>
                                        </div>
                                        <!--end col-->
                                        <div class="col-lg-6">
                                            <div class="mb-3">
                                                <label for="lastnameInput" class="form-label">{{ $t("t-lastname")
                                                }}</label>
                                                <input type="text" v-model="userInfo.lastName" class="form-control"
                                                    id="lastnameInput" :placeholder="$t('t-enter-lastname')" />
                                            </div>
                                        </div>
                                        <!--end col-->
                                        <div class="col-lg-6">
                                            <div class="mb-3">
                                                <label for="emailInput" class="form-label">{{ $t("t-email") }}</label>
                                                <input type="email" v-model="userInfo.email" class="form-control"
                                                    id="emailInput" :placeholder="$t('t-enter-email')" />
                                            </div>
                                        </div>
                                        <div class="col-lg-6">
                                            <div class="mb-3">
                                                <label for="phonenumberInput" class="form-label">{{ $t("t-phone")
                                                }}</label>
                                                <input v-model="userInfo.phone" type="text" class="form-control"
                                                    id="phonenumberInput" :placeholder="$t('t-enter-phone')" />
                                            </div>
                                        </div>
                                        <!--end col-->
                                        <div class="col-lg-12">
                                            <div class="hstack gap-2 justify-content-end">
                                                <button type="submit" class="btn btn-primary">
                                                    {{ $t('t-update') }}
                                                </button>
                                                <button type="button" class="btn btn-soft-success"
                                                    @click="clearInfoChange">
                                                    {{ $t('t-cancel') }}
                                                </button>
                                            </div>
                                        </div>
                                        <!--end col-->
                                    </div>
                                    <!--end row-->
                                </form>
                            </div>
                            <!--end tab-pane-->
                            <div class="tab-pane" :class="{ 'active': tab == 'changePassword'}" id="changePassword" role="tabpanel">
                                <form @submit="onUpdatePassword">
                                    <div class="row g-2">
                                        <div class="col-lg-4">
                                            <div>
                                                <label for="iconrightInput" class="form-label">{{$t('t-old-password')}}*</label>
                                                <div class="form-icon right">
                                                    <input :type="isPassword ? 'password': 'text'" class="form-control form-control-icon"
                                                        id="iconrightInput" :placeholder="$t('t-old-password')"
                                                        v-model="userInfo.password">
                                                    <i class=" bx bxs-show fs-18" @click="toggle"></i>
                                                </div>
                                            </div>
                                        </div>
                                        <!--end col-->
                                        <div class="col-lg-4">
                                            <div>
                                                <label for="newpasswordInput" class="form-label">{{$t('t-new-password')}}*</label>
                                                <input type="password" class="form-control" id="newpasswordInput"
                                                    :placeholder="$t('t-new-password')"
                                                    v-model="modelChange.newPassword" />
                                            </div>
                                        </div>
                                        <!--end col-->
                                        <div class="col-lg-4">
                                            <div>
                                                <label for="confirmpasswordInput" class="form-label">{{$t('t-confirm-password')}}*</label>
                                                <input type="password" class="form-control" id="confirmpasswordInput"
                                                    :placeholder="$t('t-confirm-password')"
                                                    v-model="modelChange.confirmPassword" />
                                            </div>
                                        </div>
                                        <!--end col-->
                                        <div class="col-lg-12">
                                            <div class="mb-3">
                                                <a href="javascript:void(0);"
                                                    class="link-primary text-decoration-underline">{{$t('t-forgot-password')}}</a>
                                            </div>
                                        </div>
                                        <!--end col-->
                                        <div class="col-lg-12">
                                            <div class="text-end">
                                                <button type="submit" class="btn btn-success bg-sauna-green">
                                                   {{ $t('t-change-password') }}
                                                </button>
                                            </div>
                                        </div>
                                        <!--end col-->
                                    </div>
                                    <!--end row-->
                                </form>
                            </div>
                            <!--end tab-pane-->
                        </div>
                    </div>
                </div>
            </div>
            <!--end col-->
        </div>
        <!--end row-->
    </Layout>
</template>