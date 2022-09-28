<script>
import "@vueform/multiselect/themes/default.css";

import Layout from "@/layouts/main.vue";
import PageHeader from "@/components/page-header";
import { userService } from "@/services";
import { cloneDeep, union, keys, filter } from "lodash";
import Swal from "sweetalert2";
import { uploadService } from "@/services/upload.service";
import { imageURL } from "@/helpers/image";
import { authService } from "@/services/auth.service";
import { mapGetters } from "vuex";
import useVuelidate from '@vuelidate/core'
import { required, email, maxLength, minLength, sameAs, helpers } from '@vuelidate/validators';
import { STORAGE_KEY, ROLES } from '@/constants'
export default {
  page: {
    title: "ユーザ管理",
  },
  setup() {
    return { v$: useVuelidate() }
  },
  data() {
    return {
      title: this.$i18n.t(""),
      items: [
        {
          text: "SETTING",
          href: "/",
        },
        {
          text: this.$i18n.t("t-user-management"),
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
      coverImage: null,
      avatarImage: null,
      password: {
        newPassword: "",
        confirmPassword: "",
        oldPassword: "",
      },
      userRef: null,
      isPassword: true,
      allowedExtensions: ["image/jpeg", "image/png", "image/jpg", "image/gif"],
      isHideNewPassword: true,
      isHideConfirmPassword: true,
      submitted: false,
      error: {},
      tab: 'personalDetails',
      fileAvatarImage: null,
      fileCoverImage: null,
    };
  },
  validations() {
    const that = this;
    return {
      userInfo: {
        email: {
          required: helpers.withMessage(that.$t('field_required', { field: that.$t('t-email') }), required),
          email: helpers.withMessage(that.$t('t-email-invalid'), email),
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
          // required: helpers.withMessage(that.$t('field_required', { field: that.$t('t-phone') }), required),
          maxLength: helpers.withMessage(that.$t('field_maxlength', { maxlength: 17, field: that.$t('t-phone') }), maxLength(17)),
          minLength: helpers.withMessage(that.$t('field_minlength', { minlength: 10, field: that.$t('t-phone') }), minLength(10)),
          match: helpers.withMessage(that.$t('t-invalid', { field: that.$t('t-phone') }), helpers.regex(/[\d]+$/i)),
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
          required: helpers.withMessage(that.$t('field_required', { field: that.$t('t-firstname') }), required),
          maxLength: helpers.withMessage(that.$t('field_maxlength', { maxlength: 255, field: that.$t('t-firstname') }), maxLength(255)),
          //match: helpers.withMessage(`firstName is invalid`, helpers.regex(/[一-龠]+|[ぁ-ゔ]+|[ァ-ヴー]+|[a-zA-Z]+|[ａ-ｚＡ-Ｚ]+|[々〆〤ヶ]+/u))
        },
        lastName: {
          required: helpers.withMessage(that.$t('field_required', { field: that.$t('t-lastname') }), required),
          maxLength: helpers.withMessage(that.$t('field_maxlength', { maxlength: 255, field: that.$t('t-lastname') }), maxLength(255)),
          //match: helpers.withMessage(`lastName is invalid`, helpers.regex(/[一-龠]+|[ぁ-ゔ]+|[ァ-ヴー]+|[a-zA-Z]+|[ａ-ｚＡ-Ｚ]+|[々〆〤ヶ]+/u))
        },
      },
      password: {
        oldPassword: {
          required: helpers.withMessage(that.$t('field_required', { field: that.$t('t-old-password') }), required),
          maxLength: helpers.withMessage(that.$t('field_maxlength', { maxlength: 255, field: that.$t('t-old-password') }), maxLength(255)),
          minLength: helpers.withMessage(that.$t('field_minlength', {
            minlength: 6,
            field: that.$t('t-old-password')
          }), minLength(6)),
          server: {
            $message() {
              return that.error.oldPassword
            },
            $validator() {
              return !that.error.oldPassword
            }
          },
          $autoDirty: true
        },
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
    ...mapGetters({
      currentUser: 'auth/currentUser'
    }),
    isAdmin() {
      return this.userInfo.role === ROLES.ADMIN;
    }
  },
  components: {
    Layout,
    PageHeader,
  },
  mounted() {
    this.getProfile();
  },
  methods: {
    onKeyPress: (e) => {
      console.log(e)
      if (e.which >= 48 && e.which <= 57) {
        return true;
      }

      e.preventDefault();
      return false;
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
    async onChangeAvatar(e) {
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
      if (!this.allowedExtensions.includes(file.type)) {
        return;
      }
      this.avatarImage = URL.createObjectURL(file);
      this.fileAvatarImage = file;
      e.target.value = null;
    },
    async upload(type) {
      let file = type === 'avatar' ? this.fileAvatarImage : this.fileCoverImage;

      if (file) {
        try {
          let res = null;
          if (type === 'avatar') {
            res = await uploadService.uploadAvatar(file);
          } else {
            res = await uploadService.uploadCover(file);
          }
          return res?.filepath || '';

        } catch (error) {
          console.log(error);
        }
      }
    },
    async onChangeCover(e) {
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
      if (!this.allowedExtensions.includes(file.type)) {
        return;
      }
      this.coverImage = URL.createObjectURL(file);
      this.fileCoverImage = file;
      e.target.value = null;
    },
    async getProfile() {
      this.userRef = cloneDeep(this.currentUser);
      this.userInfo = cloneDeep(this.currentUser);
      this.coverImage = this.userInfo.pathCover
        ? imageURL(this.userInfo.pathCover)
        : require("@/assets/images/profile-bg.jpg");
      this.avatarImage = this.userInfo.pathAvatar
        ? imageURL(this.userInfo.pathAvatar)
        : require("@/assets/images/me.jpg");
    },
    getChange() {
      const userInfo = cloneDeep(this.userInfo);
      const userRef = cloneDeep(this.userRef);
      const unionKeys = union(keys(userInfo), keys(userRef));
      return filter(unionKeys, (key) => {
        return userInfo[key] !== userRef[key];
      });
    },
    async onUpdateInfo() {
      this.submitted = true;
      this.v$.userInfo.$touch();
      if (this.v$.userInfo.$invalid) {
        return;
      }
      if (this.fileAvatarImage) {
        this.userInfo.pathAvatar = await this.upload('avatar')
      }

      if (this.fileCoverImage) {
        this.userInfo.pathCover = await this.upload('cover')
      }

      try {
        let res = await authService.updateUserProfile(this.userInfo);
        if (res) {
          this.submitted = false;
          this.$store.commit('auth/SET_CURRENT_USER', res);
          this.getProfile();
          await Swal.fire({
            title: "",
            text: this.$t('t-update-success'),
            icon: "success",
            showConfirmButton: false,
            timer: 1500,
          });
        }
      } catch (error) {
        console.log(error, "update user");
      }
    },
    onChangeOldPassword() {
      this.error.oldPassword = '';
    },
    async onUpdatePassword() {
      this.submitted = true;
      this.v$.password.$touch();
      if (this.v$.password.$invalid) {
        return;
      }
      try {
        const { firstName, lastName, email, phone, status } = this.userRef;

        if (this.fileAvatarImage) {
          this.userInfo.pathAvatar = await this.upload('avatar')
        }

        if (this.fileCoverImage) {
          this.userInfo.pathCover = await this.upload('cover')
        }

        const body = {
          firstName, lastName, email, phone, status, pathAvatar: this.userInfo.pathAvatar, pathCover: this.userInfo.pathCover
        }

        const responseUpdate = await authService.updateUserProfile(body);

        if(responseUpdate) {
          this.$store.commit('auth/SET_CURRENT_USER', responseUpdate);
          this.getProfile();
        }

        const response = await userService.changeMyPasswd({
          oldPass: this.password.oldPassword,
          newPass: this.password.newPassword,
          confirmNewPass: this.password.confirmPassword
        });
        if (response.updated) {
          if (response.token) {
            localStorage.setItem(STORAGE_KEY.ACCESS_TOKEN, response.token)
          }
          this.submitted = false;
          this.userInfo.password = this.password.newPassword;
          this.password.oldPassword = '';
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
        if (error.message && error.message.toLowerCase().includes('password')) {
          this.error.oldPassword = this.$t('t-incorrect-password');
          this.v$.password.$reset();
          this.v$.password.$touch();
        }
        console.log(error, "update user");
      }
    },
    clearInfoChange() {
      this.userInfo = cloneDeep(this.userRef);
      this.avatarImage = this.userInfo.pathAvatar ? imageURL(this.userInfo.pathAvatar) : require("@/assets/images/users/avatar-1.jpg");
      this.coverImage = this.userInfo.pathCover ? imageURL(this.userInfo.pathCover) : require("@/assets/images/profile-bg.jpg");
      this.fileAvatarImage = null;
      this.fileCoverImage = null;
    },
    clearPasswordChange() {
      this.password.oldPassword = '';
      this.password.newPassword = '';
      this.password.confirmPassword = '';
      this.userInfo.status = this.userRef.status;
      this.userInfo.pathCover = this.userRef.pathCover;
      this.userInfo.pathAvatar = this.userRef.pathAvatar;
      this.avatarImage = this.userInfo.pathAvatar ? imageURL(this.userInfo.pathAvatar) : require("@/assets/images/users/avatar-1.jpg");
      this.coverImage = this.userInfo.pathCover ? imageURL(this.userInfo.pathCover) : require("@/assets/images/profile-bg.jpg");
      this.fileAvatarImage = null;
      this.fileCoverImage = null;
    },
    onStatusChange(event) {
      this.userInfo.status = event.target.checked ? "ACTIVE" : "INACTIVE";
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
    onResetPasswordValidationField(field) {
      this.submitted = false;
      this.$nextTick(() => {
        this.error = {};
        this.v$.password[field].$reset();
      });
    },
    onResetValidationField(field) {
      this.submitted = false;
      this.$nextTick(() => {
        this.error = {};
        this.v$.userInfo[field].$reset();
      });
    },
  },
};
</script>
    
<template>
  <Layout>
    <PageHeader :title="title" :items="items" />
    <div class="position-relative mx-n4 mt-n4">
      <div v-if="userInfo" class="profile-wid-bg profile-setting-img">
        <img :src="coverImage" class="profile-wid-img" alt="profile-cover-image" />

        <div class="overlay-content">
          <div class="text-end p-3">
            <div class="p-0 ms-auto rounded-circle profile-photo-edit">
              <input @change="onChangeCover" id="profile-foreground-img-file-input" accept="image/*" type="file"
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
              <div v-if="userInfo" class="
                    profile-user
                    position-relative
                    d-inline-block
                    mx-auto
                    mb-4
                  ">
                <img :src="avatarImage" class="
                      rounded-circle
                      avatar-xl
                      img-thumbnail
                      user-profile-image
                    " alt="user-profile-image" />
                <div class="avatar-xs p-0 rounded-circle profile-photo-edit">
                  <input @change="onChangeAvatar" accept="image/*" id="profile-img-file-input" type="file"
                    class="profile-img-file-input" />
                  <label for="profile-img-file-input" class="profile-photo-edit avatar-xs">
                    <span class="avatar-title rounded-circle bg-light text-body">
                      <i class="bx bx-camera"></i>
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
              <!-- <div class="flex-shrink-0">
                  <div class="form-check form-switch">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      role="switch"
                      id="flexSwitchCheckChecked"
                      :checked="userInfo.status === 'ACTIVE' ? true : false"
                      @change="onStatusChange"
                    />
                  </div>
                </div> -->
            </div>
            <div class="d-flex justify-content-center mb-2">
              <div class="d-flex align-items-center">
                <i v-if="userInfo.status === 'ACTIVE'" class="bx bx-check-circle fs-22 text-success"></i>
                <i v-else class="bx bx-x-circle fs-22 text-danger"></i>

                <h6 class="mb-0 fs-16 ps-1" v-if="userInfo.status === 'ACTIVE'">
                  {{ $t("t-enable") }}
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
                <a class="nav-link text-body" :class="{ 'active': tab == 'personalDetails' }" data-bs-toggle="tab"
                  @click="tab = 'personalDetails'" href="javascript:void(0);" role="tab">
                  <i class="fas fa-home"></i>
                  {{ $t("t-personal-detail") }}
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link text-body" :class="{ 'active': tab == 'changePassword' }" data-bs-toggle="tab"
                  @click="tab = 'changePassword'" href="javascript:void(0);" role="tab">
                  <i class="far fa-user"></i>
                  {{ $t("t-change-password") }}
                </a>
              </li>
            </ul>
          </div>
          <div class="card-body p-4">
            <div class="tab-content">
              <div class="tab-pane" :class="{ 'active': tab == 'personalDetails'}" id="personalDetails" role="tabpanel">
                <form @submit.prevent="onUpdateInfo">
                  <div class="row">
                    <div class="col-lg-6">
                      <div class="mb-3">
                        <label for="firstnameInput" class="form-label">{{
                        $t("t-firstname")
                        }}<span class="text-danger">*</span></label>
                        <input v-model="v$.userInfo.firstName.$model" type="text"
                          :class="{ 'is-invalid': v$.userInfo.firstName.$dirty && v$.userInfo.firstName.$invalid && submitted }"
                          :placeholder="$t('field_required',{field: $t('t-firstname')})" class="form-control"
                          id="firstnameInput" @focus="() => onResetValidationField('firstName')" maxlength="255" />

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
                    <div class="col-lg-6">
                      <div class="mb-3">
                        <label for="lastnameInput" class="form-label">{{
                        $t("t-lastname")
                        }}<span class="text-danger">*</span></label>
                        <input type="text" v-model="v$.userInfo.lastName.$model"
                          :class="{ 'is-invalid': v$.userInfo.lastName.$dirty && v$.userInfo.lastName.$invalid && submitted }"
                          class="form-control" id="lastnameInput"
                          :placeholder="$t('field_required',{field: $t('t-lastname')})"
                          @focus="() => onResetValidationField('lastName')" maxlength="255" />

                        <div v-if="submitted && v$.userInfo.lastName.$error"
                          class="invalid-feedback d-flex flex-column">
                          <span v-if="v$.userInfo.lastName.required.$invalid">
                            {{ v$.userInfo.lastName.required.$message }}
                          </span>

                          <span v-else-if="v$.userInfo.lastName.maxLength.$invalid">
                            {{ v$.userInfo.lastName.maxLength.$message }}
                          </span>
                        </div>
                      </div>
                    </div>
                    <!--end col-->
                    <div class="col-lg-6">
                      <div class="mb-3">
                        <label for="usernameInput" class="form-label">{{
                        $t("t-username")
                        }}</label>
                        <input type="text" :disabled="true" v-model="userInfo.username" class="form-control"
                          id="usernameInput" :placeholder="$t('t-enter-email')" />
                      </div>
                    </div>
                    <div class="col-lg-6">
                      <div class="mb-3">
                        <label for="phonenumberInput" class="form-label">{{
                        $t("t-phone")
                        }}</label>
                        <input v-model="v$.userInfo.phone.$model"
                          :class="{ 'is-invalid': v$.userInfo.phone.$dirty && v$.userInfo.phone.$invalid && submitted }"
                          type="text" class="form-control" id="phonenumberInput"
                          :placeholder="$t('field_required',{field: $t('t-phone')})"
                          @focus="() => onResetValidationField('phone')" maxlength="17" @keypress="onKeyPress" />
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

                          <!-- <span
                            v-if="v$.userInfo.phone.match.$invalid && !v$.userInfo.phone.required.$invalid && !v$.userInfo.phone.minLength.$invalid && !v$.userInfo.phone.maxLength.$invalid">{{
                            v$.userInfo.phone.match.$message
                            }}</span> -->

                          <span v-if="v$.userInfo.phone.server.$invalid">{{
                          v$.userInfo.phone.server.$message
                          }}</span>
                        </div>
                      </div>
                    </div>
                    <!--end col-->
                    <div class="col-lg-12">
                      <div class="hstack gap-2 justify-content-end">
                        <button type="submit" class="btn btn-primary">
                          {{ $t("t-submit-update") }}
                        </button>
                        <button type="button" class="btn btn-soft-success" @click="clearInfoChange">
                          {{ $t("t-cancel") }}
                        </button>
                      </div>
                    </div>
                    <!--end col-->
                  </div>
                </form>
                <!--end row-->
              </div>
              <!--end tab-pane-->
              <div class="tab-pane" :class="{ 'active': tab == 'changePassword'}" id="changePassword" role="tabpanel">
                <form ref="changePassword" @submit.prevent="onUpdatePassword">
                  <div class="row g-2">
                    <div class="col-lg-6">
                      <div class="mb-3">
                        <label for="usernameInput" class="form-label">{{
                        $t("t-username")
                        }}</label>
                        <input type="text" :disabled="true" v-model="userInfo.username" class="form-control"
                          id="usernameInput" :placeholder="$t('t-enter-email')" />
                      </div>
                    </div>
                    <div class="col-lg-6">
                      <div :class="{ 'is-invalid': submitted && v$.password.oldPassword.$error }">
                        <label for="iconrightInput" class="form-label">{{ $t('t-old-password') }}<span
                            class="text-danger">*</span></label>
                        <div class="form-icon right">
                          <input
                            @change="onChangeOldPassword"
                            :type="isPassword ? 'password' : 'text'"
                            :class="{ 'is-invalid': submitted && v$.password.oldPassword.$error }" class="form-control form-control-icon"
                            id="iconrightInput" :placeholder="$t('field_required',{field: $t('t-old-password')})"
                            v-model="password.oldPassword">

                          <i :class="getIconClass(isPassword, submitted, v$.password.oldPassword.$error)" @click="toggle"></i>
                        </div>
                      </div>
                      <div v-if="submitted && v$.password.oldPassword.$error"
                        class="invalid-feedback d-flex flex-column">
                        <span v-if="v$.password.oldPassword.required.$invalid">{{
                        v$.password.oldPassword.required.$message
                        }}</span>

                        <span
                          v-if="v$.password.oldPassword.minLength.$invalid && !v$.password.oldPassword.required.$invalid">{{
                          v$.password.oldPassword.minLength.$message
                          }}</span>

                        <span
                          v-if="v$.password.oldPassword.maxLength.$invalid  && !v$.password.oldPassword.minLength.$invalid && !v$.password.oldPassword.required.$invalid">{{
                          v$.password.oldPassword.maxLength.$message
                          }}</span>

                        <span v-if="v$.password.oldPassword.server.$invalid">{{
                        v$.password.oldPassword.server.$message
                        }}</span>

                      </div>
                    </div>
                    <!--end col-->
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
                            <i :class="getIconClass(isHideNewPassword, submitted, v$.password.newPassword.$error)"
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
                            v-if="v$.password.newPassword.maxLength.$invalid  && !v$.password.newPassword.minLength.$invalid && !v$.password.newPassword.required.$invalid">{{
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
                          <i :class="getIconClass(isHideConfirmPassword, submitted, v$.password.confirmPassword.$error)"
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