<template>
  <Layout>
    <PageHeader :title="title" :items="items" />
    <!--    Cover Image-->
    <div class="position-relative mx-n4 mt-n4">
      <div class="profile-wid-bg profile-setting-img">
        <img :src="getImageURL('cover', imageCover || null)" class="profile-wid-img" alt="" />
        <div class="overlay-content">
          <div class="text-end p-3">
            <div class="p-0 ms-auto rounded-circle profile-photo-edit">
              <input id="profile-foreground-img-file-input" @change="onChangeImageCover" type="file" accept="image/*"
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

    <div class="row mt-n5">
      <!--      Avatar-->
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
                <img :src="getImageURL('avatar', imageAvatar || null)" class="
                    rounded-circle
                    avatar-xl
                    img-thumbnail
                    user-profile-image
                  " alt="user-profile-image" />
                <div class="avatar-xs p-0 rounded-circle profile-photo-edit">
                  <input id="profile-img-file-input" @change="onChangeImageAvatar" type="file" accept="image/*"
                    class="profile-img-file-input" />
                  <label for="profile-img-file-input" class="profile-photo-edit avatar-xs">
                    <span class="avatar-title rounded-circle bg-light text-body">
                      <i class="bx bx-camera"></i>
                    </span>
                  </label>
                </div>
              </div>
              <h5 class="fs-16 mb-1">{{ id ? name : '' }}</h5>
              <!--              <p class="text-muted mb-0">Lead Designer / Developer</p>-->
            </div>
          </div>
        </div>
        <!--end card-->

        <div :class="[id ? '' : 'mt-n5', 'card']">
          <div class="card-body">
            <div class="d-flex align-items-center mb-3">
              <div class="flex-grow-1">
                <p class="card-title mb-0" style="font-size: 12px;">{{ $t('t-enable-disable') }}</p>
              </div>
              <div class="flex-shrink-0">
                <div class="form-check form-switch">
                  <input class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckChecked"
                    :checked="formInput.status" @change="toggleStatusMode">
                </div>
              </div>
            </div>

            <div class="d-flex justify-content-center align-items-center">
              <div class="fs-5">
                <div v-if="formInput.status">
                  <span class="d-flex align-items-center">
                    <i class=" bx bx-check-circle fs-18 text-success mr-1"></i>
                    {{ $t("t-enable") }}
                  </span>
                </div>
                <div v-else>
                  <span class="d-flex align-items-center">
                    <i class=" bx bx-x-circle fs-18 text-danger"></i>
                    {{ $t("t-disable") }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!--end card-->
      </div>
      <!--end col-->
      <div class="col-xxl-9">
        <div class="card mt-xxl-n5">
          <!--          Form header-->
          <div class="card-header">
            <ul class="
                nav nav-tabs-custom
                rounded
                card-header-tabs
                border-bottom-0
              " role="tablist">
              <li class="nav-item">
                <a class="nav-link text-body" :class="{ 'active': type == 'personalDetails' }"
                  @click="type = 'personalDetails'" data-bs-toggle="tab" href="javascript:void(0);" role="tab">
                  <i class="fas fa-home"></i>
                  {{ $t('t-personal-detail') }}
                </a>
              </li>
              <li class="nav-item" v-if="id">
                <a class="nav-link text-body" data-bs-toggle="tab" :class="{ 'active': type == 'changePassword' }"
                  @click="type = 'changePassword'" href="javascript:void(0);" role="tab">
                  <i class="far fa-user"></i>
                  {{ $t('t-change-password') }}
                </a>
              </li>

            </ul>
          </div>
          <div class="card-body p-4">
            <div class="tab-content">
              <!--     Personal Details -->
              <div class="tab-pane" :class="{ 'active': type == 'personalDetails' }" id="personalDetails"
                role="tabpanel">
                <!-- Inputs-->
                <form action="javascript:void(0);">
                  <div class="row">

                    <!-- First Name-->
                    <div class="col-lg-6">
                      <div class="mb-3">
                        <label for="firstnameInput" class="form-label">
                          {{ $t('t-firstname') }}<span class="text-danger">*</span>
                        </label>
                        <input type="text" class="form-control" id="firstnameInput" v-model="formInput.firstName"
                          :class="{'is-invalid': errorMessages.firstName.message }"
                          :placeholder="$t('t-create-update-facility-account.placeholder.first_name')"
                        />
                        <p class="fs-6 text-danger mt-3">
                          {{ generateErrorMessage(errorMessages.firstName.message, errorMessages.firstName.params) }}
                        </p>
                      </div>
                    </div>
                    <!--end col-->


                    <!-- Last Name-->
                    <div class="col-lg-6">
                      <div class="mb-3">
                        <label for="lastnameInput" class="form-label">
                          {{ $t('t-lastname') }}<span class="text-danger">*</span>
                        </label>
                        <input type="text" class="form-control" id="lastnameInput" v-model="formInput.lastName"
                          :class="{'is-invalid': errorMessages.lastName.message }"
                          :placeholder="$t('t-create-update-facility-account.placeholder.last_name')"
                        />
                        <p class="fs-6 text-danger mt-3">
                          {{ generateErrorMessage(errorMessages.lastName.message, errorMessages.lastName.params) }}
                        </p>
                      </div>
                    </div>
                    <!--end col-->

                    <!-- Email-->
                    <div class="col-lg-6">
                      <div class="mb-3">
                        <label for="usernameInput" class="form-label">
                          {{ $t('t-username') }}<span class="text-danger">*</span>
                        </label>
                        <input type="text" class="form-control" id="usernameInput" @keydown.space.prevent
                          v-model="formInput.username" :disabled="disabled"
                          :class="{'is-invalid': errorMessages.email.message }"
                          :placeholder="$t('t-create-update-facility-account.placeholder.username')"
                        />
                        <p class="fs-6 text-danger mt-3">
                          {{ generateErrorMessage(errorMessages.email.message, errorMessages.email.params) }}
                        </p>
                      </div>
                    </div>
                    <!--end col-->

                    <!-- Phone number -->
                    <div class="col-lg-6">
                      <div class="mb-3">
                        <label for="phoneNumberInput" class="form-label">
                          {{ $t('t-phone-number') }}
                        </label>
                        <input type="tel" class="form-control" id="phoneNumberInput" @keydown.space.prevent
                          v-model="formInput.phone" :class="{'is-invalid': errorMessages.phoneNumber.message }"
                          @input="onChangePhoneNumber($event)"
                          :placeholder="$t('t-create-update-facility-account.placeholder.phone_number')"
                        />
                        <p class="fs-6 text-danger mt-3">
                          {{ generateErrorMessage(errorMessages.phoneNumber.message, errorMessages.phoneNumber.params)
                          }}
                        </p>
                      </div>
                    </div>

                    <!--Buttons-->
                    <div class="col-lg-12">
                      <div class="hstack gap-2 justify-content-end">
                        <button type="submit" class="btn btn-primary" @click="handleUpdate">
                          {{ id ? $t('t-update') : $t('t-register-btn') }}
                        </button>
                        <button type="button" class="btn btn-soft-success" @click="handleCancel">
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

              <!-- Change Password -->
              <div class="tab-pane" id="changePassword" :class="{ 'active': type == 'changePassword' }" role="tabpanel"
                v-if="id">
                <form action="javascript:void(0);">
                  <div class="row">
                    <!-- Email-->
                    <div class="w-100 row mb-3">
                      <div class="col-lg-6">
                        <div>
                          <label for="oldpasswordInput" class="form-label">
                            {{ $t('t-email-address') }}
                          </label>
                          <div class="form-icon right">
                            <input type="text" class="form-control" id="usernameInput" @keydown.space.prevent
                              v-model="formInput.username" :disabled="disabled"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <!--end col-->

                    <div class="row w-100">
                      <!-- New Password-->
                      <div class="col-lg-6">
                        <div>
                          <label for="newpasswordInput" class="form-label">
                            {{ $t('t-new-password') }}
                          </label>
                          <div class="form-icon right">
                            <input type="password" class="form-control" id="newpasswordInput"
                              :placeholder="$t('t-new-password')" v-model="formChangePass.newPassword"
                              @keydown.space.prevent
                              :class="{'is-invalid': errorChangePasswordMessage.newPassword.message }" />
                            <i class="bx bx-show" :class="{'me-3': errorChangePasswordMessage.newPassword.message}"
                              style="cursor:pointer" id="new-password-btn"
                              @click="toggleShowPassword('newpasswordInput', 'new-password-btn')"></i>
                          </div>
                          <p class="fs-6 text-danger mt-3">
                            {{ generateErrorMessage(errorChangePasswordMessage.newPassword.message,
                            errorChangePasswordMessage.newPassword.params) }}
                          </p>
                        </div>
                      </div>
                      <!--end col-->

                      <!-- Confirm Password-->
                      <div class="col-lg-6">
                        <div>
                          <label for="confirmpasswordInput" class="form-label">
                            {{ $t('t-confirm-new-password') }}
                          </label>
                          <div class="form-icon right">
                            <input type="password" class="form-control" id="confirmpasswordInput"
                              :placeholder="$t('t-confirm-password')" v-model="formChangePass.confirmPassword"
                              @keydown.space.prevent
                              :class="{'is-invalid': errorChangePasswordMessage.confirmPassword.message }" />
                            <i class="bx bx-show" :class="{'me-3': errorChangePasswordMessage.confirmPassword.message}"
                              style="cursor:pointer" id="confirm-password-btn"
                              @click="toggleShowPassword('confirmpasswordInput', 'confirm-password-btn')"></i>
                          </div>
                          <p class="fs-6 text-danger mt-3">
                            {{ generateErrorMessage(errorChangePasswordMessage.confirmPassword.message,
                            errorChangePasswordMessage.confirmPassword.params) }}
                          </p>
                        </div>
                      </div>
                      <!--end col-->
                    </div>

                    <!--Buttons-->
                    <div class="col-lg-12">
                      <div class="hstack gap-2 justify-content-end">
                        <button type="submit" class="btn btn-primary" @click="handleChangePass">
                          {{ $t('t-update') }}
                        </button>
                        <button type="button" class="btn btn-soft-success" @click="handleCancelChangePass">
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

<script>
import Layout from "@/layouts/main";
import PageHeader from "@/components/page-header";
import { imageURL } from "@/helpers/image";
import Swal from "sweetalert2";

export default {
  name: "CreateEditAccount",
  components: {
    Layout,
    PageHeader,
  },
  props: {
    id: { type: String, default: "" },
    formData: { type: Object },
    name: { type: String },
    errorMessages: { type: Object },
    errorChangePasswordMessage: { type: Object }
  },
  data() {
    return {
      title: "User Management",
      allowedExtensions: ["image/jpeg", "image/png", "image/jpg", "image/gif"],
      items: [
        {
          text: "SETTING",
          href: "/"
        },
        {
          text: "User Management",
          active: true,
        }
      ],
      disabled: !!this.id,
      defaultFormInput: {
        firstName: this.formData.firstName,
        lastName: this.formData.lastName,
        phone: this.formData.phone,
        username: this.formData.username,
        status: this.formData.status,
        pathAvatar: this.formData.pathAvatar,
        pathCover: this.formData.pathCover,
      },
      formInput: {
        firstName: this.formData.firstName || "",
        lastName: this.formData.lastName || "",
        phone: this.formData.phone || "",
        username: this.formData.username || "",
        status: this.formData.status || true,
      },
      formChangePass: {
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      },
      type: 'personalDetails',
      imageAvatar: null,
      imageCover: null,
      imgError: null,
    }
  },
  mounted() {
    this.formInput = this.formData;
    this.imageAvatar = this.formData?.pathAvatar || '';
    this.imageCover = this.formData?.pathCover || '';
  },
  methods: {
    getImageURL(type, img) {
      if (type === 'avatar') {
        return img ? imageURL(img) : require("@/assets/images/users/avatar-1.jpg");
      } else {
        return img ? imageURL(img) : require("@/assets/images/profile-bg.jpg");
      }
    },
    onChangeImageAvatar(e) {
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
      this.imageAvatar = URL.createObjectURL(file);
      this.$emit("onChangeImageAvatar", file);
    },
    onChangeImageCover(e) {
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
      this.imageCover = URL.createObjectURL(file);
      this.$emit("onChangeImageCover", file);
    },
    onChangePhoneNumber(e) {
      this.formInput.phone = e.target.value.replace(/\D/g, '');
    },
    toggleShowPassword(idInput, idBtn) {
      if (idInput) {
        const input = document.getElementById(idInput);
        const btn = document.getElementById(idBtn);
        if (input.type === "password") {
          input.type = "text";
        } else input.type = "password";

        if (btn.classList.contains('bx-show')) {
          btn.classList.replace('bx-show', 'bx-hide');
        } else btn.classList.replace('bx-hide', 'bx-show');
      }
    },
    toggleStatusMode() {
      this.formInput.status = !this.formInput.status;
    },
    handleCancel() {
      if (!this.id) {
        this.formInput = {
          firstName: "",
          lastName: "",
          phone: "",
          email: "",
          status: true
        }
        this.imageAvatar = null;
        this.onChangeImageAvatar(true);
        this.imageCover = null;
      } else {
        this.formInput = { ...this.defaultFormInput };
        this.imageAvatar = this.defaultFormInput?.pathAvatar;
        this.imageCover = this.defaultFormInput?.pathCover;
      }
      this.$emit("onChangeImageAvatar", null);
      this.$emit("onChangeImageCover", null);
    },

    handleCancelChangePass(){
      this.formChangePass = {
        newPassword: "",
        confirmPassword: "",
      };
      this.imageAvatar = this.defaultFormInput?.pathAvatar;
      this.formInput.status = this.defaultFormInput.status;
      this.$emit("onChangeImageAvatar", null);
      this.imageCover = this.defaultFormInput?.pathCover;
      this.$emit("onChangeImageCover", null);
    },
    async handleUpdate() {
      this.$emit('onCreateAndUpdateAccount', this.formInput);
    },
    handleChangePass() {
      const params = {
        formChangePass: this.formChangePass,
        formUpdateUser: this.defaultFormInput
      };
      this.$emit('onChangePassword', params);
    },
    generateErrorMessage(msg, field) {
      return this.$t(msg, field);
    }
  }
}
</script>

<style lang="scss" scoped>
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
</style>