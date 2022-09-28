<script>
import Layout from "@/layouts/main.vue";
import PageHeader from "@/components/page-header";
import { userService } from "@/services";
// import { cloneDeep, union, keys, filter, isEqual } from 'lodash';
import Swal from "sweetalert2";
import randomString from "randomstring";
import { required, numeric, email, maxLength } from '@vuelidate/validators';
import useVuelidate from "@vuelidate/core";

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
                username: "",
                firstName: "",
                lastName: "",
                email: "",
                phone: "",
                role: "",
                status: "ACTIVE"
            },
            isActive: true
        };
    },
    components: {
        Layout,
        PageHeader
    },
    mounted() {
        this.userInfo.username = this.generatorUsername();
        this.userInfo.role = this.$route.query.role;
    },
    methods: {
        onStatusChange(payload) {
            console.log(payload)
            this.isActive = payload.target.checked;
            this.userInfo.status = this.isActive ? 'ACTIVE' : 'INACTIVE';
        },
        generatorPassword() {
            return randomString.generate(8);
        },
        generatorUsername() {
            return randomString.generate(12);
        },
        async onCreateUser(e) {
            e.preventDefault();
            // temp validator
            const hasFilled = Object.values(this.userInfo).every(value => value && value.length > 0);
            if (hasFilled) {
                try {
                    const response = await userService.createUser(this.userInfo);
                    if (response) {
                        await Swal.fire({
                            title: "",
                            text: this.$t('t-create-success'),
                            icon: "success",
                            showConfirmButton: false,
                            timer: 1500,
                        });
                        this.$router.replace({ name: 'facility-manager-user-list' });
                    }
                } catch (e) {
                    console.log(e);
                    await Swal.fire({
                        title: "Create failed",
                        text: e.message,
                        icon: "error",
                        showConfirmButton: false,
                        timer: 1500,
                    });
                }
            }
        }
    },
    setup() {
        return { v$: useVuelidate() }
    },
    validations() {
        return {
            userInfo: {
                email: {
                    required,
                    email
                },
                phone: {
                    required,
                    numeric,
                    maxLength: maxLength(15)
                },
                username: {
                    required,
                },
                firstname: {
                    required,
                },
                lastname: {
                    required,
                }
            }
        }
    }
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
                                        id="flexSwitchCheckChecked" checked @change="onStatusChange">
                                </div>
                            </div>
                        </div>
                        <div class="d-flex justify-content-center mb-2">
                            <div class="d-flex align-items-center">
                                <i v-if="isActive" class="bx bx-check-circle fs-22 text-success"></i>
                                <i v-else class="bx bx-x-circle fs-22 text-danger"></i>

                                <h6 v-if="isActive" class="mb-0 fs-18 ps-1">{{ $t("t-enable") }}</h6>
                                <h6 v-else class="mb-0 fs-18 ps-1">{{ $t("t-disable") }}</h6>
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
                                <a class="nav-link active text-body" data-bs-toggle="tab" href="#personalDetails"
                                    role="tab">
                                    <i class="fas fa-home"></i>
                                    {{ $t("t-personal-detail") }}
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div class="card-body p-4">
                        <div class="tab-content">
                            <div class="tab-pane active" id="personalDetails" role="tabpanel">
                                <form @submit="onCreateUser">
                                    <div class="row">
                                        <div class="col-lg-6">
                                            <div class="mb-3">
                                                <label for="firstnameInput" class="form-label">{{ $t("t-firstname")
                                                }}</label>
                                                <input v-model="userInfo.firstName" type="text" class="form-control"
                                                    id="firstnameInput" :placeholder="$t('t-enter-firstname')" />
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

                                        <div class="col-lg-6">
                                            <div class="mb-3">
                                                <label for="username" class="form-label">{{ $t("t-username") }}</label>
                                                <input v-model="userInfo.username" type="text" class="form-control"
                                                    id="username" :placeholder="$t('t-enter-username')" />
                                            </div>
                                        </div>

                                        <!--end col-->
                                        <div class="col-lg-12">
                                            <div class="hstack gap-2 justify-content-end">
                                                <button type="submit" class="btn btn-primary">
                                                    {{ $t('t-create') }}
                                                </button>
                                            </div>
                                        </div>
                                        <!--end col-->
                                    </div>
                                    <!--end row-->
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!--end col-->
        </div>
        <!--end row-->
    </Layout>
</template>