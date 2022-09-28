<template>
  <div>
    <div v-if="id">
      <CreateEditAccount
        v-if="!isLoading"
        :id="id"
        :formData="formData"
        :name="name"
        :errorMessages="errorMessages"
        :errorChangePasswordMessage="errorChangePasswordMessage"
        @onCreateAndUpdateAccount="onCreateAndUpdateAccount"
        @onChangePassword="onChangePassword"
        @onChangeImageAvatar="onChangeImageAvatar"
        @onChangeImageCover="onChangeImageCover"
    />
    </div>
    <div v-else>
      <CreateEditAccount
        :formData="formData"
        :errorMessages="errorMessages"
        @onCreateAndUpdateAccount="onCreateAndUpdateAccount"
        @onChangeImageAvatar="onChangeImageAvatar"
        @onChangeImageCover="onChangeImageCover"
    />
    </div>
  </div>
</template>

<script>
import CreateEditAccount from "@/components/facility-account/CreateEditAccount";
import { userService } from "@/services";
import {checkDuplicate, checkValidateInput} from "@/utils/facility-account";
import Swal from "sweetalert2";
import {ROLES, USER_ACTION, USER_STATUS} from "@/constants";
import { imageURL } from "@/helpers/image";
import { uploadService } from "@/services/upload.service";

export default {
  name: "Create Account",
  components: { CreateEditAccount },
  data() {
    return {
      id: this.$route.params.id || "",
      isLoading: false,
      errorMessages: {
        firstName: {
          message: "",
          params: {}
        },
        lastName: {
          message: "",
          params: {}
        },
        phoneNumber: {
          message: "",
          params: {}
        },
        email: {
          message: "",
          params: {}
        }
      },
      formData: {
        firstName: "",
        lastName: "",
        phone: "",
        username: "",
        status: true
      },
      formChangePassword: {
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      },
      errorChangePasswordMessage: {
        newPassword: {
          message:  "",
          params: {}
        },
        confirmPassword: {
          message:  "",
          params: {}
        },
      },
      name: "",
      fileAvatarImage: null,
      fileCoverImage: null,
    }
  },
  mounted() {
    if (this.id) {
      this.getUserDetail(this.id);
    }
  },
  methods: {
    onChangeImageAvatar(file) {
      this.fileAvatarImage = file;
    },
    onChangeImageCover(file) {
      this.fileCoverImage = file;
    },
    getImageURL (img) {
      return imageURL(img);
    },
    async getUserDetail(id){
      try {
        this.isLoading = true;
        const res = await userService.getUser(id);
        if (res){
          this.formData = {
            username: res.username,
            firstName: res.firstName,
            lastName: res.lastName,
            phone: res.phone,
            status: res.status === USER_STATUS.ACTIVE,
            pathAvatar: res?.pathAvatar,
            pathCover: res?.pathCover
          };
          this.name = res.name;
          this.isLoading = false;
        }
      } catch (err){
        console.log(err)
        this.isLoading = false;
      }
    },
    async upload (type) {
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
          if (type === 'avatar') {
            return this.formData.pathAvatar;
          }
          return this.formData.pathCover;
        }
      }
    },
    async onCreateAndUpdateAccount(value){
      this.formData = value;
      this.errorMessages = await checkValidateInput(this, this.formData, USER_ACTION.CREATE_UPDATE_ACCOUNT);
      let error = 0;
      for (const key in this.errorMessages){
        if (this.errorMessages[key].message !== "") error += 1;
      }
      if (this.fileAvatarImage) {
        this.formData.pathAvatar = await this.upload('avatar');
      }
      if (this.fileCoverImage) {
        this.formData.pathCover = await this.upload('cover');
      }
      if (error === 0){
        const username = (Math.random() + 1).toString(36).substring(7);
        const status = this.formData.status ? USER_STATUS.ACTIVE : USER_STATUS.INACTIVE;
        const params = {
          ...this.formData,
          firstName: this.formData.firstName.trim(),
          lastName: this.formData.lastName.trim(),
          username,
          status,
          role: ROLES.FACILITY_ACCOUNT,
        };
        try {
          let res;
          if (this.id) {
            res = await userService.updateUser(this.id, params);
          }
          else res = await userService.createUser(params);
          if (res && res.facilityId) {
            const message = this.id
                ? this.$t('t-update-success')
                : `<div class="d-flex flex-column flex-start">
                    <p class="fs-16 text-center">${this.$t('t-create-update-facility-account.success-message.t-create-success-first-line')}</p>
                    <div class="mt-4 d-flex flex-column flex-start">
                      <p class="fs-14 p-0 text-start">
                        <span class="box-120">${this.$t('t-create-update-facility-account.success-message.t-create-success-email')}</span> ${res.username}
                      </p>
                      <p class="fs-14 p-0 text-start">
                        <span class="box-120">${this.$t('t-create-update-facility-account.success-message.t-create-success-password')} </span>
                        ${res.password}
                      </p>
                    </div>
                  </div>`
            Swal.fire("", `${message}`, "success")
                .then(result => {
                  if (result.value && !this.id) {
                    this.$router.push('/admin/setting/facility-account');
                  }
                });
          } else if (res.statusCode === 409) {
            this.errorMessages = await checkDuplicate(this, res.message);
          }
        } catch (err) {
          Swal.fire("Error!", "There are some errors. Please try again.", "error");
        }
      }
    },

    async onChangePassword(data) {
      const defaultFormData = data.formUpdateUser;
      this.formChangePassword = {...data.formChangePass};
      this.errorChangePasswordMessage = await checkValidateInput(this, this.formChangePassword, USER_ACTION.CHANGE_PASSWORD);

      let error = 0;
      for (const key in this.errorChangePasswordMessage){
        if (this.errorChangePasswordMessage[key].message !== "") error += 1;
      }

      console.log(this.fileAvatarImage);
      if (this.fileAvatarImage) {
        defaultFormData.pathAvatar = await this.upload("avatar");
      }
      if (this.fileCoverImage) {
        defaultFormData.pathCover = await this.upload("cover");
      }

      if (error === 0){
        try {
          const paramsChangePass = {
            new: this.formChangePassword.newPassword
          };
          const resChangePassword = await userService.changeMyPasswd(paramsChangePass);

          const status = this.formData.status ? USER_STATUS.ACTIVE : USER_STATUS.INACTIVE;

          const paramsUpdateImage = {
            ...defaultFormData,
            status
          };
          const resUpdateImage = await userService.updateUser(this.id, paramsUpdateImage);
          if (resChangePassword
              && resChangePassword.updated
              && resUpdateImage
              && resUpdateImage.id
          ) {
            Swal.fire("", this.$t('t-update-success'), "success")
                .then(result => {
                  if (result.value) {
                    this.$router.push('/profile');
                  }
                });
          }

        } catch (err) {
          console.log(err);
          Swal.fire("", this.$t("t-network-error"), "error");
        }
      }
    }
  }
}
</script>