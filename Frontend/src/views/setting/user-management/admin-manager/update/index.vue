<script>
import "@vueform/multiselect/themes/default.css";

import Layout from "@/layouts/main.vue";
import PageHeader from "@/components/page-header";
import { userService, uploadService } from "@/services";
import { cloneDeep, union, keys, filter } from 'lodash';
import Swal from "sweetalert2";
import useVuelidate from "@vuelidate/core";
import { requiredIf, email, maxLength, minLength, sameAs, helpers, required } from '@vuelidate/validators';
import { ROLES } from '@/constants';
import { imageURL } from "@/helpers/image";

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
        tabletId: "",
        facilityName: "",
        pathAvatar: null,
        pathCover: null
      },
      password: {
        newPassword: "",
        confirmPassword: "",
      },
      submitted: false,
      error: {},
      isPassword: true,
      isHideNewPassword: true,
      isHideConfirmPassword: true,
      tabActive: 'personalInfo',
      avatar: null,
      cover: null,
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
    clearPasswordChange() {
      this.password.newPassword = '';
      this.password.confirmPassword = '';
      this.userInfo.status = this.userRef.status;
      this.userInfo.pathCover = this.userRef.pathCover;
      this.userInfo.pathAvatar = this.userRef.pathAvatar;
      this.avatar = this.userInfo.pathAvatar ? imageURL(this.userInfo.pathAvatar) : require("@/assets/images/users/avatar-1.jpg");
      this.cover = this.userInfo.pathCover ? imageURL(this.userInfo.pathCover) : require("@/assets/images/profile-bg.jpg");
    },
    getIconClass(hide, isSubmitted, isError) {
      if ((hide && !isSubmitted && !isError) || (hide && isSubmitted && !isError)) {
        return 'bx bx-show'
      }

      if ((!hide && !isSubmitted && !isError) || (!hide && isSubmitted && !isError)) {
        return 'bx bx-hide'
      }

      if (hide && isSubmitted && isError) {
        return 'bx bx-show right-3'
      }

      if (!hide && isSubmitted && isError) {
        return 'bx bx-hide right-3'
      }

      return hide ? 'bx bx-show' : 'bx bx-hide';
    },
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
        e.target.value = null;
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
        e.target.value = null;
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
        e.target.value = null;
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
        e.target.value = null;
      }
    },
    handleBlur(event, field) {
      this.userInfo[field] = this.userInfo[field].trim();
    },
    onKeyPress: (e) => {
      if (e.which >= 48 && e.which <= 57) {
        return true;
      }

      e.preventDefault();
      return false;
    },
    async getUserById() {
      try {
        const { userId } = this.$route.params;
        const response = await userService.getUser(userId);
        if (typeof response.data === 'undefined') {
          this.userInfo = cloneDeep(response);
          this.avatar = this.userInfo.pathAvatar ? imageURL(this.userInfo.pathAvatar) : require("@/assets/images/users/avatar-1.jpg");
          this.cover = this.userInfo.pathCover ? imageURL(this.userInfo.pathCover) : require("@/assets/images/profile-bg.jpg");
          this.userInfo.facilityName = response?.facility?.name || ''
          this.userRef = cloneDeep(response);
          this.userRef.facilityName = response?.facility?.name || ''
        } else {
          this.userInfo = response.data;
          this.avatar = this.userInfo.pathAvatar ? imageURL(this.userInfo.pathAvatar) : require("@/assets/images/users/avatar-1.jpg");
          this.cover = this.userInfo.pathCover ? imageURL(this.userInfo.pathCover) : require("@/assets/images/profile-bg.jpg");
          this.userInfo.facilityName = response.data?.facility?.name || '';
          this.userRef = cloneDeep(response.data);
          this.userRef.facilityName = response.data?.facility?.name || ''
        }
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
    onResetValidationField(field) {
      this.submitted = false;
      this.$nextTick(() => {
        this.error = {};
        this.v$.userInfo[field].$reset();
      });
    },
    async onUpdateInfo() {
      this.submitted = true;
      this.v$.userInfo.$touch();
      console.log(this.v$.userInfo)
      if (this.v$.userInfo.$invalid) {
        return;
      } else {
        try {

          const { id, firstName, lastName, role, email, phone, status, tabletId, facilityId, pathAvatar, pathCover } = this.userInfo;

          const body = role === ROLES.FACILITY_MANAGER ? {
            firstName,
            lastName,
            email,
            phone,
            status,
            pathAvatar,
            pathCover
          } : {
            tabletId,
            facilityId,
            status,
            pathAvatar,
            pathCover,
            firstName,
            lastName,
          };

          const response = await userService.updateUser(
            id,
            body
          );
          if (response && !response.error) {
            this.getUserById();
            this.submitted = false;

            await Swal.fire({
              title: "",
              text: this.$t('t-update-success'),
              icon: "success",
              showConfirmButton: false,
              timer: 1500,
            });
          } else if (response.error) {
            if (response.statusCode === 409) {
              if (response.message.includes('email')) {
                this.error.email = this.$t('t-error-exists', { field: this.$t('t-email') })
              }

              if (response.message.includes('phone')) {
                this.error.phone = this.$t('t-error-exists', { field: this.$t('t-phone') })
              }

              if (response.message.includes('tabletId')) {
                this.error.tabletId = this.$t('t-error-exists', { field: this.$t('t-tabletId') })
              }

              this.$nextTick(() => {
                this.v$.userInfo.$reset();
                this.v$.userInfo.$touch();
              })
              return;
            }
            this.submitted = false;
          }

        } catch (error) {
          console.log(error, 'update user')
          if (error.statusCode === 409) {
            if (error.message.includes('email')) {
              this.error.email = this.$t('t-error-exists', { field: this.$t('t-email') })
            }

            if (error.message.includes('phone')) {
              this.error.phone = this.$t('t-error-exists', { field: this.$t('t-phone') })
            }

            if (error.message.includes('tabletId')) {
              this.error.tabletId = this.$t('t-error-exists', { field: this.$t('t-tabletId') })
            }

            this.$nextTick(() => {
              this.v$.userInfo.$reset();
              this.v$.userInfo.$touch();
            })
            return;
          }
          this.submitted = false;
        }
      }

    },
    async onUpdatePassword() {
      this.submitted = true;
      this.v$.password.$touch();
      if (this.v$.password.$invalid) {
        return;
      } else {
        try {
          const { id, pathAvatar, pathCover, status, role } = this.userInfo;
          const { firstName, lastName, email, phone, tabletId, facilityId } = this.userRef;

          const body = role === ROLES.FACILITY_MANAGER ? {
            firstName, lastName, email, phone, status, pathAvatar, pathCover
          } : {
            firstName, lastName, status, tabletId, facilityId, pathAvatar, pathCover
          }

          const responseUpdateUser = await userService.updateUser(id, body);

          if (responseUpdateUser && !responseUpdateUser.error) {
            this.getUserById();
          }

          const response = await userService.changeUserPasswdByAdmin(
            id,
            { 'new': this.password.newPassword }
          );
          if (response.updated) {
            this.submitted = false;
            this.userInfo.password = this.password.newPassword;
            this.password.newPassword = '';
            this.password.confirmPassword = '';
            await Swal.fire({
              title: "",
              text: this.$t('t-update-success'),
              icon: "success",
              showConfirmButton: false,
              timer: 1500,
            });
          }
        } catch (error) {
          console.log(error, 'changePasswdByAdmin')
        }
      }
    },
    cancel() {
      this.submitted = false;
      this.v$.userInfo.$reset();
      this.userInfo = cloneDeep(this.userRef);
      this.avatar = this.userInfo.pathAvatar ? imageURL(this.userInfo.pathAvatar) : require("@/assets/images/users/avatar-1.jpg");
      this.cover = this.userInfo.pathCover ? imageURL(this.userInfo.pathCover) : require("@/assets/images/profile-bg.jpg");
    },
    onStatusChange(event) {
      this.userInfo.status = event.target.checked ? 'ACTIVE' : 'INACTIVE';
    },
    toggle() {
      this.isPassword = !this.isPassword;
    },
    toggleNewPassword() {
      this.isHideNewPassword = !this.isHideNewPassword;
    },
    toggleConfirmPassword() {
      this.isHideConfirmPassword = !this.isHideConfirmPassword;
    },
    onTabChange(tabId) {
      this.tabActive = tabId;
    },
    onResetPasswordValidationField(field) {
      this.submitted = false;
      this.$nextTick(() => {
        this.error = {};
        this.v$.password[field].$reset();
      });
    },
    onKeyPressEmailField: (e) => {
      if (e.which !== 32) {
        return true;
      }

      e.preventDefault();
      return false;
    },
  },
  setup() {
    return { v$: useVuelidate() }
  },
  validations() {
    const that = this;
    const appendPhone = that.isFacilityManager ? {
      maxLength: helpers.withMessage(that.$t('field_maxlength', { maxlength: 17, field: that.$t('t-phone') }), maxLength(17)),
      minLength: helpers.withMessage(that.$t('field_minlength', {
        minlength: 10,
        field: that.$t('t-phone')
      }), minLength(10)),
      match: helpers.withMessage(that.$t('t-invalid', { field: that.$t('t-phone') }), helpers.regex(/[\d]+$/i)),
    } : {}
    return {
      userInfo: {
        email: {
          required: helpers.withMessage(that.$t('field_required', { field: that.$t('t-email') }), requiredIf(() => {
            return that.isFacilityManager
          })),
          maxLength: helpers.withMessage(that.$t('field_maxlength', { maxlength: 255, field: that.$t('t-email') }), maxLength(255)),
          email: helpers.withMessage(that.$t('t-invalid', { field: that.$t('t-email') }), email),
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
          ...appendPhone,
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
        tabletId: {
          required: helpers.withMessage(that.$t('field_required', { field: that.$t('t-tabletId') }), requiredIf(() => {
            return that.isTablet
          })),
          maxLength: helpers.withMessage(that.$t('field_maxlength', { maxlength: 255, field: that.$t('t-tabletId') }), maxLength(255)),
          server: {
            $message() {
              return that.error.tabletId
            },
            $validator() {
              return !that.error.tabletId
            }
          },
          $autoDirty: true
        }
      },
      password: {
        newPassword: {
          required: helpers.withMessage(that.$t('field_required', { field: that.$t('t-new-password') }), required),
          //match: helpers.withMessage(`newPassword must contain at least one uppercase letter, a number and one lowercase letter`, helpers.regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/i)),
          maxLength: helpers.withMessage(that.$t('field_maxlength', { maxlength: 255, field: that.$t('t-new-password') }), maxLength(255)),
          minLength: helpers.withMessage(that.$t('field_minlength', {
            minlength: 6,
            field: that.$t('t-new-password')
          }), minLength(6)),
        },
        confirmPassword: {
          required: helpers.withMessage(that.$t('field_required', { field: that.$t('t-new-password-confirm') }), required),
          sameAs: helpers.withMessage(that.$t('t-confirm-password-not-match'), sameAs(that.password.newPassword)),
        }
      }
    }
  },
  computed: {
    isTablet() {
      return this.userInfo.role === ROLES.TABLET
    },
    isFacilityManager() {
      return this.userInfo.role === ROLES.FACILITY_MANAGER
    },
  },
  // watch: {
  //   avatar: {
  //     handler(newValue) {
  //       this.avatar = newValue;
  //     },
  //     deep: true
  //   },
  //   cover: {
  //     handler(newValue) {
  //       this.cover = newValue;
  //     },
  //     deep: true
  //   }
  // }
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
              <input @change="onCoverChange" accept="image/*" id="profile-foreground-img-file-input" type="file"
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
              <h5 class="fs-16 mb-1">{{ userInfo.name }}</h5>
            </div>
          </div>
        </div>
        <!--end card-->
        <div class="card" :class="isFacilityManager ? '': 'mt-n5'">
          <div class="card-body" :class="isFacilityManager ? '': 'p-4'">
            <div class="d-flex align-items-center mb-3">
              <div class="flex-grow-1">
                <h5 class="card-title mb-0">{{ $t("t-enable-disable") }}</h5>
              </div>
              <div class="flex-shrink-0">
                <div class="form-check form-switch">
                  <input class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckChecked"
                    :checked="userInfo.status === 'ACTIVE' ? true : false" @change="onStatusChange">
                </div>
              </div>
            </div>
            <div class="d-flex justify-content-center mb-2">
              <div class="d-flex align-items-center">
                <i v-if="userInfo.status === 'ACTIVE'" class="bx bx-check-circle fs-22 text-success"></i>
                <i v-else class="bx bx-x-circle fs-22 text-danger"></i>

                <h6 class="mb-0 fs-18 ps-1" v-if="userInfo.status === 'ACTIVE'">{{ $t("t-status-enable") }}</h6>
                <h6 class="mb-0 fs-18 ps-1" v-else>{{ $t("t-status-disable") }}</h6>
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
                <a class="nav-link text-body cursor-pointer" :class="{'active': tabActive === 'personalInfo'}"
                  @click="onTabChange('personalInfo')" data-bs-toggle="tab" role="tab">
                  <i class="fas fa-home"></i>
                  {{ $t('t-personal-detail') }}
                </a>
              </li>
              <li class="nav-item cursor-pointer">
                <a class="nav-link text-body" :class="{'active': tabActive === 'changePassword'}" data-bs-toggle="tab"
                  @click="onTabChange('changePassword')" role="tab">
                  <i class="far fa-user"></i>
                  {{ $t('t-change-password') }}
                </a>
              </li>
            </ul>
          </div>
          <div class="card-body p-4">
            <div class="tab-content">
              <div class="tab-pane" :class="{'active': tabActive === 'personalInfo' }" id="personalInfo"
                role="tabpanel">
                <form @submit.prevent="onUpdateInfo">
                  <div class="row">
                    <div v-if="isFacilityManager" class="col-lg-12">
                      <div class="row">
                        <div class="col-lg-6 pe-1">
                          <div class="mb-3">
                            <label for="facilityName" class="form-label">{{ $t("t-facility-name") }}</label>
                            <input :disabled="true" v-model="userInfo.facilityName" class="form-control"
                              id="facilityName" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div v-if="isTablet" class="col-lg-6">
                      <div class="mb-3">
                        <label for="facilityName" class="form-label">{{ $t("t-facility-name") }}</label>
                        <input :disabled="true" v-model="userInfo.facilityName" class="form-control"
                          id="facilityName" />
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
                            v-if="v$.userInfo.firstName.maxLength.$invalid && !v$.userInfo.firstName.required.$invalid">{{
                            v$.userInfo.firstName.maxLength.$message
                            }}</span>

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
                        <div v-if="submitted && v$.userInfo.lastName.$error"
                          class="invalid-feedback d-flex flex-column">
                          <span v-if="v$.userInfo.lastName.required.$invalid">{{
                          v$.userInfo.lastName.required.$message
                          }}</span>

                          <span
                            v-if="v$.userInfo.lastName.maxLength.$invalid && !v$.userInfo.lastName.required.$invalid">{{
                            v$.userInfo.lastName.maxLength.$message
                            }}</span>
                        </div>
                      </div>
                    </div>
                    <!--end col-->
                    <div v-if="isFacilityManager" class="col-lg-6">
                      <div class="mb-3">
                        <label for="emailInput" class="form-label">{{ $t("t-email") }}</label>
                        <input type="email" v-model="userInfo.email" class="form-control" id="emailInput"
                          :disabled="true" :placeholder="$t('t-enter-email')"
                          @focus="() => onResetValidationField('email')" @keypress="onKeyPressEmailField"
                          style="background:#C5BEBE;"
                          :class="{ 'is-invalid': submitted && v$.userInfo.email.$error }" />
                        <div v-if="submitted && v$.userInfo.email.$error" class="invalid-feedback">
                          <span v-if="v$.userInfo.email.required.$invalid">{{
                          v$.userInfo.email.required.$message
                          }}</span>

                          <span v-if="v$.userInfo.email.email.$invalid && !v$.userInfo.email.required.$invalid">{{
                          v$.userInfo.email.email.$message
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

                    <div v-if="isTablet" class="col-lg-6">
                      <div class="mb-3">
                        <label for="tabletId" class="form-label">{{ $t("t-tabletId") }}<span
                            class="text-danger">*</span></label>
                        <input v-model="userInfo.tabletId" class="form-control" id="tabletId"
                          :placeholder="$t('field_required',{field: $t('t-tabletId')})"
                          @focus="() => onResetValidationField('tabletId')"
                          :class="{ 'is-invalid': submitted && v$.userInfo.tabletId.$error }" maxlength="255"
                          @blur="handleBlur($event, 'tabletId')" />
                        <div v-if="submitted && v$.userInfo.tabletId.$error" class="invalid-feedback">
                          <span v-if="v$.userInfo.tabletId.required.$invalid">{{
                          v$.userInfo.tabletId.required.$message
                          }}</span>

                          <span v-if="v$.userInfo.tabletId.server.$invalid">{{
                          v$.userInfo.tabletId.server.$message
                          }}</span>
                        </div>
                      </div>
                    </div>

                    <!--end col-->
                    <div class="col-lg-12">
                      <div class="hstack gap-2 justify-content-end">
                        <button type="submit" class="btn btn-primary">
                          {{ $t('t-submit-update') }}
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
              <div class="tab-pane" id="changePassword" role="tabpanel"
                :class="{'active': tabActive === 'changePassword' }">
                <form @submit.prevent="onUpdatePassword">
                  <div class="row g-2">
                    <div v-if="isTablet" class="col-lg-12">
                      <div class="row">
                        <div class="col-lg-6 pe-1">
                          <div>
                            <label for="tabletId" class="form-label">{{ $t("t-tabletId") }}</label>
                            <input v-model="userInfo.tabletId" class="form-control" id="tabletId" :disabled="true" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <!--end col-->

                    <div v-if="isFacilityManager" class="col-lg-12">
                      <div class="row">
                        <div class="col-lg-6 pe-1">
                          <div>
                            <label for="email" class="form-label">{{ $t("t-email") }}</label>
                            <input style="background:#C5BEBE;" v-model="userInfo.email" class="form-control" id="email"
                              :disabled="true" />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="col-lg-6">
                      <div>
                        <div>
                          <label for="newpasswordInput" class="form-label">{{ $t('t-new-password') }}<span
                              class="text-danger">*</span></label>
                          <div class="form-icon right">
                            <input :type="isHideNewPassword ? 'password' : 'text'"
                              class="form-control form-control-icon" id="newpasswordInput"
                              :placeholder="$t('field_required',{field: $t('t-new-password')})"
                              v-model="password.newPassword"
                              :class="{ 'is-invalid': submitted && v$.password.newPassword.$error }"
                              @focus="() => onResetPasswordValidationField('newPassword')" />
                            <i :class="getIconClass(isHideNewPassword, submitted, v$.password.newPassword.$error )"
                              @click="toggleNewPassword"></i>
                          </div>
                        </div>
                        <div v-if="submitted && v$.password.newPassword.$error"
                          class="invalid-feedback d-flex flex-column">
                          <span v-if="v$.password.newPassword.required.$invalid">{{
                          v$.password.newPassword.required.$message
                          }}</span>

                          <span
                            v-if="v$.password.newPassword.minLength.$invalid && !v$.password.newPassword.required.$invalid">{{
                            v$.password.newPassword.minLength.$message
                            }}</span>

                          <span
                            v-if="v$.password.newPassword.maxLength.$invalid && !v$.password.newPassword.minLength.$invalid && !v$.password.newPassword.required.$invalid">{{
                            v$.password.newPassword.maxLength.$message
                            }}</span>

                        </div>
                      </div>
                    </div>
                    <!--end col-->
                    <div class="col-lg-6">
                      <div>
                        <label for="confirmpasswordInput" class="form-label">{{ $t('t-new-password-confirm') }}<span
                            class="text-danger">*</span></label>
                        <div class="form-icon right">
                          <input :type="isHideConfirmPassword ? 'password' : 'text'"
                            class="form-control form-control-icon" id="confirmpasswordInput"
                            :placeholder="$t('field_required',{field: $t('t-new-password-confirm')})"
                            v-model="password.confirmPassword"
                            :class="{ 'is-invalid': submitted && v$.password.confirmPassword.$error }"
                            @focus="() => onResetPasswordValidationField('confirmPassword')" />
                          <i :class="getIconClass(isHideConfirmPassword, submitted, v$.password.confirmPassword.$error )"
                            @click="toggleConfirmPassword"></i>
                        </div>

                        <div v-if="submitted && v$.password.confirmPassword.$error"
                          class="invalid-feedback d-flex flex-column">
                          <span v-if="v$.password.confirmPassword.required.$invalid">{{
                          v$.password.confirmPassword.required.$message
                          }}</span>

                          <span
                            v-if="v$.password.confirmPassword.sameAs.$invalid && !v$.password.confirmPassword.required.$invalid">{{
                            v$.password.confirmPassword.sameAs.$message
                            }}</span>
                        </div>
                      </div>
                    </div>
                    <!--end col-->
                    <div class="col-lg-12">
                      <div class="hstack gap-2 justify-content-end">
                        <button type="submit" class="btn btn-primary">
                          {{ $t('t-update') }}
                        </button>
                        <button type="button" class="btn btn-soft-success" @click="clearPasswordChange">
                          {{ $t("t-cancel") }}
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

.right-3 {
  right: 28px !important;
}
</style>