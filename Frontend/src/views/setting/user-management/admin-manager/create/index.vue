<script>
import Layout from "@/layouts/main.vue";
import PageHeader from "@/components/page-header";
import { userService, facilityService, uploadService } from "@/services";
import { cloneDeep } from 'lodash';
import Swal from "sweetalert2";
import randomString from "randomstring";
import { ROLES } from '@/constants';
import { minLength, email, maxLength, helpers, requiredIf } from '@vuelidate/validators';
import useVuelidate from "@vuelidate/core";
import { mapGetters } from 'vuex';
import vSelect from 'vue-select';

export default {
  page: {
    title: "ユーザ管理",
  },
  data() {
    return {
      title: this.$i18n.t(''),
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
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        status: "ACTIVE",
        username: '',
        pathAvatar: null,
        pathCover: null
      },
      isActive: true,
      submitted: false,
      error: {

      },
      facilities: [],
      query: {
        search: '',
        page: 1,
        pageSize: 20,
      },
      pagination: {
        totalPage: 1,
        currentPage: 1,
        pageSize: 20,
        totalCount: 0
      },
      observer: null,
      backupFacilities: [],
      backupPagination: {
        totalPage: 1,
        currentPage: 1,
        pageSize: 20,
        totalCount: 0
      },
      avatar: null,
      cover: null
    };
  },
  components: {
    Layout,
    PageHeader,
    'v-select': vSelect,
  },
  mounted() {
    this.userInfo.role = this.$route.query.role;
    this.observer = new IntersectionObserver(this.infiniteScroll)
    this.getFacilities(this.query);
    this.avatar = require("@/assets/images/users/avatar-1.jpg")
    this.cover = require("@/assets/images/profile-bg.jpg")
  },
  methods: {
    async onAvatarChange(e) {
      const files = e.target.files || e.dataTransfer.files;
      const file = files[0] || null;
      if (file.size / 1024 / 1024 > 10) {
        Swal.fire({
          title: "",
          text: this.$t('t-err-upload'),
          icon: "error",
          showConfirmButton: false,
          timer: 2000,
        });
        return;
      }
      if (files) {
        try {
          const response = await uploadService.uploadAvatar(files[0]);
          this.avatar = URL.createObjectURL(files[0]);
          this.userInfo.pathAvatar = response.filepath || null;
        } catch (e) {
          console.log(e)
        }
      }
    },
    async onCoverChange(e) {
      const files = e.target.files || e.dataTransfer.files;
      const file = files[0] || null;
      if (file.size / 1024 / 1024 > 10) {
        Swal.fire({
          title: "",
          text: this.$t('t-err-upload'),
          icon: "error",
          showConfirmButton: false,
          timer: 2000,
        });
        return;
      }
      if (files) {
        try {
          const response = await uploadService.uploadCover(files[0]);
          this.cover = URL.createObjectURL(files[0]);
          this.userInfo.pathCover = response.filepath || null;
        } catch (e) {
          console.log(e)
        }
      }
    },
    handleSelect(e) {
      console.log(e)
    },
    onKeyPress: (e) => {
      if (e.which >= 48 && e.which <= 57) {
        return true;
      }

      e.preventDefault();
      return false;
    },
    onKeyPressEmailField: (e) => {
      if (e.which !== 32) {
        return true;
      }

      e.preventDefault();
      return false;
    },
    async onOpen() {
      if (this.hasNextPage) {
        await this.$nextTick()
        this.observer.observe(this.$refs.load)
      }
    },
    onClose() {
      this.observer.disconnect()
    },
    async infiniteScroll([{ isIntersecting }]) {
      if (isIntersecting) {
        if (this.pagination.currentPage < this.pagination.totalPage) {
          this.query.page = this.query.page + 1;
          this.getFacilities(this.query);
        }
      }
    },
    async getFacilities(queryObject) {
      try {
        const response = await facilityService.getFacilities(queryObject);
        this.facilities = this.facilities.concat(response.data.map(facility => ({ value: facility.id, label: facility.name })));
        this.pagination = response.pagination;

        this.backupPagination = cloneDeep(this.pagination);
        this.backupFacilities = cloneDeep(this.facilities)
        console.log(response);
      } catch (e) {
        console.log(e);
      }
    },
    onStatusChange(event) {
      this.isActive = event.target.checked;
      this.userInfo.status = this.isActive ? 'ACTIVE' : 'INACTIVE';
    },
    generatorFacilityName() {
      return randomString.generate(12);
    },
    generatorUsername() {
      return randomString.generate(8);
    },
    async onCreateUser() {
      this.submitted = true;
      this.v$.userInfo.$touch();
      console.log(this.v$.userInfo)
      if (this.v$.userInfo.$invalid) {
        return;
      } else {
        try {
          let body = cloneDeep(this.userInfo);

          let data = {
            "username": this.userInfo.username,
            "email": this.userInfo.email
          };

          const response = await userService.createUser(data);
          if (response && !response.error) {
            await Swal.fire({
              title: "",
              text: this.$t('t-create-success'),
              icon: "success",
              showConfirmButton: true,
              html: `<div class="d-flex flex-column flex-start">
                <h6 class="fs-16 text-center">${this.$t(this.isFacilityManager ? 't-facility-create' : 't-tablet-create')}</h6>
                <div class="mt-4 d-flex flex-column flex-start">
                  <p class="fs-14 p-0 text-start ">
                    <span class="box-120">
                      ${this.$t(this.isFacilityManager ? 't-create-update-facility-account.success-message.t-create-success-email' : 't-create-success-tabletId')} 
                      </span>
                    ${this.isFacilityManager ? response.email: response.tabletId}</p>
                  <p class="fs-14 p-0 text-start ">
                    <span class="box-120">
                      ${this.$t('t-password')}: 
                    </span>
                    ${response.password}
                  </p>
                </div>
              </div>`
            });
            this.$router.replace({
              name: 'user-management-by-admin', query: {
                activeTab: body.role === ROLES.FACILITY_MANAGER ? 'facilityManager' : 'tablet'
              }
            });
            this.submitted = false;
          } else {
            if (response.statusCode === 409) {
              if (response.message.includes('username') || response.message.includes('email')) {
                this.error.email = this.$t('t-error-exists', { field: this.$t('t-email') })
              }

              if (response.message.includes('phone')) {
                this.error.phone = this.$t('t-error-exists', { field: this.$t('t-phone') })
              }

              if (response.message.toLowerCase().includes('facility')) {
                this.error.facilityName = this.$t('t-error-exists', { field: this.$t('t-facility-name') })
              }

              this.$nextTick(() => {
                this.v$.$reset();
                this.v$.$touch();
              })
              return;
            }
          }
        } catch (e) {
          this.submitted = false;
          if (e.statusCode === 409) {
            if (e.message.includes('email')) {
              this.error.email = this.$t('t-error-exists', { field: this.$t('t-email') })
            }

            if (e.message.includes('phone')) {
              this.error.phone = this.$t('t-error-exists', { field: this.$t('t-phone') })
            }

            if (e.message.toLowercase().includes('facility')) {
              this.error.facilityName = this.$t('t-error-exists', { field: this.$t('t-facility-name') })
            }

            this.$nextTick(() => {
              this.v$.$reset();
              this.v$.$touch();
            })
            return;
          }
          console.log(e);
        }
      }
    },
    onResetValidationField(field) {
      this.$nextTick(() => {
        this.error = {};
        this.v$.userInfo[field].$reset();
      });
    },
    cancel() {
      this.submitted = false;
      this.v$.userInfo.$reset();
      this.avatar = require("@/assets/images/users/avatar-1.jpg")
      this.cover = require("@/assets/images/profile-bg.jpg");
      this.isActive = true;
      this.userInfo = {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        role: this.$route.query.role,
        status: "ACTIVE",
        facilityName: '',
        username: '',
        facilityId: null,
        pathAvatar: null,
        pathCover: null
      }
    },
    handleBlur(event, field) {
      this.userInfo[field] = this.userInfo[field].trim();
    },
    async searchFacility(text) {
      if (!text) {
        this.facilities = cloneDeep(this.backupFacilities);
        this.pagination = cloneDeep(this.backupPagination);
        return;
      }
      try {
        const query = {
          search: text,
          page: 1,
          pageSize: 100000
        }
        const response = await facilityService.getFacilities(query);
        this.facilities = response.data.map(facility => ({ value: facility.id, label: facility.name }));
        this.pagination = response.pagination;
        console.log(response);
      } catch (e) {
        console.log(e);
      }
    }
  },
  computed: {
    isFacilityManager() {
      return this.$route.query.role === ROLES.FACILITY_MANAGER
    },
    isTabletRole() {
      return this.$route.query.role === ROLES.TABLET
    },
    hasNextPage() {
      return this.pagination.currentPage < this.pagination.totalPage
    },
    ...mapGetters({
      currentUser: 'auth/currentUser'
    }),
  },
  setup() {
    return { v$: useVuelidate() }
  },
  validations() {
    const that = this;
    return {
      userInfo: {
        email: {
          required: helpers.withMessage(that.$t('field_required', { field: that.$t('t-email') }), requiredIf(() => {
            return that.isFacilityManager
          })),
          maxLength: helpers.withMessage(that.$t('field_maxlength', { maxlength: 255, field: that.$t('t-email') }), maxLength(255)),
          email: helpers.withMessage(that.$t('t-invalid', {field: that.$t('t-email')}), email),
          server: {
            $message() {
              return that.error.email
            },
            $validator() {
              return !that.error.email
            }
          },
          $autoDirty: true
        },
        phone: {
          // required: helpers.withMessage(that.$t('field_required', { field: that.$t('t-phone') }), requiredIf(() => {
          //   return that.isFacilityManager
          // })),
          match: helpers.withMessage(that.$t('t-invalid', {field: that.$t('t-phone')}), helpers.regex(/[\d]+$/i)),
          maxLength: helpers.withMessage(that.$t('field_maxlength', { maxlength: 17, field: that.$t('t-phone') }), maxLength(17)),
          minLength: helpers.withMessage(that.$t('field_minlength', {
            minlength: 10,
            field: that.$t('t-phone')
          }), minLength(10)),
          //match: helpers.withMessage(`phone is invalid`, helpers.regex(/^(0([1-9]{1}-?[1-9]\d{3}|[1-9]{2}-?\d{3}|[1-9]{2}\d{1}-?\d{2}|[1-9]{2}\d{2}-?\d{1})-?\d{4}|0[789]0-?\d{4}-?\d{4}|050-?\d{4}-?\d{4})$/i)),
          server: {
            $message() {
              return that.error.phone
            },
            $validator() {
              return !that.error.phone
            }
          },
          $autoDirty: true
        },
        firstName: {
          required: helpers.withMessage(that.$t('field_required', { field: that.$t('t-firstname') }), requiredIf(() => {
            return that.isFacilityManager
          })),
          maxLength: helpers.withMessage(that.$t('field_maxlength', { maxlength: 255, field: that.$t('t-firstname') }), maxLength(255)),
          //match: helpers.withMessage(`firstName is invalid`, helpers.regex(/[一-龠]+|[ぁ-ゔ]+|[ァ-ヴー]+|[a-zA-Z]+|[ａ-ｚＡ-Ｚ]+|[々〆〤ヶ]+/u))
        },
        lastName: {
          required: helpers.withMessage(that.$t('field_required', { field: that.$t('t-lastname') }), requiredIf(() => {
            return that.isFacilityManager
          })),
          maxLength: helpers.withMessage(that.$t('field_maxlength', { maxlength: 255, field: that.$t('t-lastname') }), maxLength(255)),
          //match: helpers.withMessage(`lastName is invalid`, helpers.regex(/[一-龠]+|[ぁ-ゔ]+|[ァ-ヴー]+|[a-zA-Z]+|[ａ-ｚＡ-Ｚ]+|[々〆〤ヶ]+/u))
        },
        facilityName: {
          required: helpers.withMessage(that.$t('field_required', { field: that.$t('t-facility-name') }), requiredIf(() => {
            return that.isFacilityManager
          })),
          maxLength: helpers.withMessage(that.$t('field_maxlength', { maxlength: 255, field: that.$t('t-facility-name') }), maxLength(255)),
          server: {
            $message() {
              return that.error.facilityName
            },
            $validator() {
              return !that.error.facilityName
            }
          },
          $autoDirty: true
          //match: helpers.withMessage(`facilityName is invalid`, helpers.regex(/\w/i))
        },
        facilityId: {
          required: helpers.withMessage(that.$t('field_required', { field: that.$t('t-facility-name') }), requiredIf(() => {
            return that.isTabletRole
          })),
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
        <img :src="cover" class="profile-wid-img" alt="" />
        <div class="overlay-content">
          <div class="text-end p-3">
            <div v-if="isFacilityManager" class="p-0 ms-auto rounded-circle profile-photo-edit">
              <input @change="onCoverChange" id="profile-foreground-img-file-input" accept="image/*" type="file"
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
        <div v-if="isFacilityManager" class="card mt-n5">
          <div class="card-body p-4">
            <div class="text-center">
              <div class="
                  profile-user
                  position-relative
                  d-inline-block
                  mx-auto
                  mb-4
                ">
                <img :src="avatar" class="
                    rounded-circle
                    avatar-xl
                    img-thumbnail
                    user-profile-image
                  " alt="user-profile-image" />
                <div class="avatar-xs p-0 rounded-circle profile-photo-edit">
                  <input id="profile-img-file-input" type="file" accept="image/*" class="profile-img-file-input"
                    @change="onAvatarChange" />
                  <label for="profile-img-file-input" class="profile-photo-edit avatar-xs">
                    <span class="avatar-title rounded-circle bg-light text-body">
                      <i class="bx bxs-camera"></i>
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="card" :class="isFacilityManager ? '': 'mt-n5'">
          <div class="card-body" :class="isFacilityManager ? '': 'p-4'">
            <div class="d-flex align-items-center mb-3">
              <div class="flex-grow-1">
                <h5 class="card-title mb-0">{{ $t("t-enable-disable") }}</h5>
              </div>
              <div class="flex-shrink-0">
                <div class="form-check form-switch">
                  <input class="form-check-input" v-model="isActive" type="checkbox" role="switch" id="flexSwitchCheckChecked" checked
                    @change="onStatusChange">
                </div>
              </div>
            </div>
            <div class="d-flex justify-content-center mb-2">
              <div class="d-flex align-items-center">
                <i v-if="isActive" class="bx bx-check-circle fs-22 text-success"></i>
                <i v-else class="bx bx-x-circle fs-22 text-danger"></i>

                <h6 v-if="isActive" class="mb-0 fs-18 ps-1">{{ $t("t-status-enable") }}</h6>
                <h6 v-else class="mb-0 fs-18 ps-1">{{ $t("t-status-disable") }}</h6>
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
                <a class="nav-link active text-body" data-bs-toggle="tab" href="#personalDetails" role="tab">
                  <i class="fas fa-home"></i>
                  {{ $t("t-personal-detail") }}
                </a>
              </li>
            </ul>
          </div>
          <div class="card-body p-4">
            <div class="tab-content">
              <div class="tab-pane active" id="personalDetails" role="tabpanel">
                <form @submit.prevent="onCreateUser">
                  <div class="row">
                    <div v-if="isFacilityManager" class="col-lg-12">
                      <div class="row">
                        <div class="col-lg-6">
                          <div class="mb-3">
                            <label for="facilityName" class="form-label">{{ $t("t-facility-name") }}<span
                                class="text-danger">*</span></label>
                            <input v-model="userInfo.facilityName" type="text" class="form-control" id="facilityName"
                            :placeholder="$t('field_required',{field: $t('t-facility-name')})"
                              @focus="() => onResetValidationField('facilityName')"
                              :class="{ 'is-invalid': submitted && v$.userInfo.facilityName.$error }" maxlength="255"
                              @blur="handleBlur($event, 'facilityName')" />
                            <div v-if="submitted && v$.userInfo.facilityName.$error" class="invalid-feedback">
                              <span v-if="v$.userInfo.facilityName.required.$invalid">{{
                              v$.userInfo.facilityName.required.$message
                              }}</span>

                              <span
                                v-if=" v$.userInfo.facilityName.maxLength.$invalid && !v$.userInfo.facilityName.required.$invalid">{{
                                v$.userInfo.facilityName.maxLength.$message
                                }}</span>

                              <span v-if="v$.userInfo.facilityName.server.$invalid">{{
                              v$.userInfo.facilityName.server.$message
                              }}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div v-if="isTabletRole" class="col-lg-12">
                      <div class="row">
                        <div class="col-lg-6">
                          <div class="mb-3">
                            <label for="facilityId" class="form-label">{{ $t("t-facility-name") }}<span
                                class="text-danger">*</span></label>
                            <v-select class="style-chooser pt-2 pb-2" id='facilityId' :options="facilities"
                              :placeholder="$t('t-select-placeholder')" v-model="userInfo.facilityId" label="label"
                              :filterable="false" @open="onOpen" @close="onClose" searchable="true"
                              @search="(query) => searchFacility(query)"
                              :class="{ 'is-invalid': submitted && v$.userInfo.facilityId.$error }">
                              <template #list-footer>
                                <li v-show="hasNextPage" ref="load" class="loader">
                                  
                                </li>
                              </template>
                            </v-select>
                            <div v-if="submitted && v$.userInfo.facilityId.$error" class="invalid-feedback">
                              <span v-if="v$.userInfo.facilityId.required.$invalid">{{
                              v$.userInfo.facilityId.required.$message
                              }}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div v-if="isFacilityManager" class="col-lg-6">
                      <div class="mb-3">
                        <label for="firstnameInput" class="form-label">{{ $t("t-firstname") }}<span
                            class="text-danger">*</span></label>
                        <input v-model="userInfo.firstName" type="text" class="form-control" id="firstnameInput"
                        :placeholder="$t('field_required',{field: $t('t-firstname')})"
                          @focus="() => onResetValidationField('firstName')"
                          :class="{ 'is-invalid': submitted && v$.userInfo.firstName.$error }" maxlength="255"
                          @blur="handleBlur($event, 'firstName')" />
                        <div v-if="submitted && v$.userInfo.firstName.$error"
                          class="invalid-feedback d-flex flex-column">
                          <span v-if="v$.userInfo.firstName.required.$invalid">{{
                          v$.userInfo.firstName.required.$message
                          }}</span>

                          <span
                            v-if=" v$.userInfo.firstName.maxLength.$invalid && !v$.userInfo.firstName.required.$invalid">{{
                            v$.userInfo.firstName.maxLength.$message
                            }}</span>

                          <!-- <span
                            v-if="v$.userInfo.firstName.match.$invalid && !v$.userInfo.firstName.required.$invalid">{{
                            v$.userInfo.firstName.match.$message
                            }}</span> -->
                        </div>
                      </div>
                    </div>
                    <!--end col-->
                    <div v-if="isFacilityManager" class="col-lg-6">
                      <div class="mb-3">
                        <label for="lastnameInput" class="form-label">{{ $t("t-lastname") }}<span
                            class="text-danger">*</span></label>
                        <input type="text" v-model="userInfo.lastName" class="form-control" id="lastnameInput"
                        :placeholder="$t('field_required',{field: $t('t-lastname')})"
                         @focus="() => onResetValidationField('lastName')"
                          :class="{ 'is-invalid': submitted && v$.userInfo.lastName.$error }" maxlength="255"
                          @blur="handleBlur($event, 'lastName')" />
                        <div v-if="submitted && v$.userInfo.lastName.$error" class="invalid-feedback">
                          <span v-if="v$.userInfo.lastName.required.$invalid">{{
                          v$.userInfo.lastName.required.$message
                          }}</span>

                          <span
                            v-if=" v$.userInfo.lastName.maxLength.$invalid && !v$.userInfo.lastName.required.$invalid">{{
                            v$.userInfo.lastName.maxLength.$message
                            }}</span>

                          <!-- <span v-if="v$.userInfo.lastName.match.$invalid && !v$.userInfo.lastName.required.$invalid">{{
                          v$.userInfo.lastName.match.$message
                          }}</span> -->
                        </div>
                      </div>
                    </div>
                    <!--end col-->
                    <div v-if="isFacilityManager" class="col-lg-6">
                      <div class="mb-3">
                        <label for="emailInput" class="form-label">{{ $t("t-email") }}<span
                            class="text-danger">*</span></label>
                        <input type="email" v-model="userInfo.email" class="form-control" id="emailInput"
                        :placeholder="$t('field_required',{field: $t('t-email')})"
                          @focus="() => onResetValidationField('email')"
                          :class="{ 'is-invalid': submitted && v$.userInfo.email.$error }" maxlength="255"
                          @keypress="onKeyPressEmailField" />
                        <div v-if="submitted && v$.userInfo.email.$error" class="invalid-feedback">
                          <span v-if="v$.userInfo.email.required.$invalid">{{
                          v$.userInfo.email.required.$message
                          }}</span>

                          <span v-if="v$.userInfo.email.email.$invalid && !v$.userInfo.email.required.$invalid">{{
                          v$.userInfo.email.email.$message
                          }}</span>

                          <span
                            v-if=" v$.userInfo.email.maxLength.$invalid && !v$.userInfo.email.email.$invalid && !v$.userInfo.email.required.$invalid">{{
                            v$.userInfo.email.maxLength.$message
                            }}</span>

                          <span v-if="v$.userInfo.email.server.$invalid">{{
                          v$.userInfo.email.server.$message
                          }}</span>
                        </div>
                      </div>
                    </div>
                    <div v-if="isFacilityManager" class="col-lg-6">
                      <div class="mb-3">
                        <label for="phonenumberInput" class="form-label">{{ $t("t-phone") }}</label>
                        <input v-model="userInfo.phone" type="text" class="form-control" id="phonenumberInput"
                        :placeholder="$t('field_required',{field: $t('t-phone')})"
                           @focus="() => onResetValidationField('phone')"
                          :class="{ 'is-invalid': submitted && v$.userInfo.phone.$error }" maxlength="17"
                          @keypress="onKeyPress" />
                        <div v-if="submitted && v$.userInfo.phone.$error" class="invalid-feedback">

                          <span v-if="v$.userInfo.phone.match.$invalid">{{
                          v$.userInfo.phone.match.$message
                          }}</span>

                          <span v-if="v$.userInfo.phone.minLength.$invalid && !v$.userInfo.phone.match.$invalid">{{
                          v$.userInfo.phone.minLength.$message
                          }}</span>

                          <span
                            v-if="v$.userInfo.phone.maxLength.$invalid && !v$.userInfo.phone.minLength.$invalid && !v$.userInfo.phone.match.$invalid">{{
                            v$.userInfo.phone.maxLength.$message
                            }}</span>

                          <span v-if="v$.userInfo.phone.server.$invalid">{{
                          v$.userInfo.phone.server.$message
                          }}</span>
                        </div>
                      </div>
                    </div>

                    <!-- <div class="col-lg-6">
                      <div class="mb-3">
                        <label for="username" class="form-label">{{ $t("t-username") }}</label>
                        <input v-model="userInfo.username" type="text" class="form-control" id="facilityName"
                          :placeholder="$t('t-enter-username')" @focus="() => onResetValidationField('username')"
                          :class="{ 'is-invalid': submitted && v$.userInfo.username.$error }" />
                        <div v-if="submitted && v$.userInfo.username.$error" class="invalid-feedback">
                          <span v-if="v$.userInfo.username.required.$invalid">{{
                              v$.userInfo.username.required.$message
                          }}</span>

                        </div>
                      </div>
                    </div> -->

                    <!--end col-->
                    <div class="col-lg-12">
                      <div class="hstack gap-2 justify-content-end">
                        <button type="submit" class="btn btn-primary">
                          {{ $t('t-submit-create') }}
                        </button>
                        <button type="button" class="btn btn-soft-success" @click="cancel">
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
            </div>
          </div>
        </div>
      </div>
      <!--end col-->
    </div>
    <!--end row-->
  </Layout>
</template>

<style scoped lang="scss">
.loader {
  text-align: center;
  color: #bbbbbb;
}

.form-control:disabled {
  background: #c5bebe !important;
  color: #707070 !important;
}

[data-layout-mode="dark"] {
  .form-control:disabled {
    background: #212529 !important;
    color: #ced4da !important;
  }
}

:deep {

  .style-chooser .vs__search::placeholder {
    color: #878a99;
  }

  .style-chooser .vs__search,
  .style-chooser .vs__selected {
    font-size: .85rem;
  }

  .vs__dropdown-menu {
    z-index: 1500 !important;
    height: 270px !important;
  }

  .style-chooser .vs__dropdown-toggle {
    padding-top: 8px;
    padding-bottom: 8px;
  }

  .style-chooser .vs__dropdown-toggle,
  .style-chooser .vs__dropdown-menu {
    color: #394066;
  }

  .style-chooser .vs__clear,
  .style-chooser .vs__open-indicator {
    fill: #394066;
  }

  .swal2-html-container {
    text-align: left !important;
  }
}
</style>