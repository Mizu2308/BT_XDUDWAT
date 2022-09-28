<script>
import animationData from "@/components/widgets/rhvddzym.json";
import useVuelidate from "@vuelidate/core";
import { required, sameAs, helpers, maxLength, minLength } from "@vuelidate/validators";
import { userService } from '@/services';
import { cloneDeep } from 'lodash';
import Swal from "sweetalert2";

export default {
    components: {
    },
    setup() {
        return { v$: useVuelidate() };
    },
    data() {
        return {
            defaultOptions: { animationData: animationData },
            reset: {
                email: '',
                newPassword: '',
                confirmPassword: '',
            },
            submitted: false,
            hideNewPassword: true,
            hideConfirmPassword: true,
            isValid: null
        }
    },
    mounted() {
        if (this.$route.fullPath.includes('+')) {
            const params = this.getQueryParams(this.$route.fullPath)
            this.reset.email = params.email
        } else {
            this.reset.email = this.$route.query.email;
        }

        this.validateExpiresResetLink();
    },
    validations() {
        const that = this;
        return {
            reset: {
                newPassword: {
                    required: helpers.withMessage(that.$t('field_required', { field: that.$t('t-new-password') }), required),
                    maxLength: helpers.withMessage(that.$t('field_maxlength', { maxlength: 255, field: that.$t('t-new-password') }), maxLength(255)),
                    minLength: helpers.withMessage(that.$t('field_minlength', { minlength: 6, field: that.$t('t-new-password') }), minLength(6)),
                },
                confirmPassword: {
                    required: helpers.withMessage(that.$t('field_required', { field: that.$t('t-new-password-confirm') }), required),
                    sameAs: helpers.withMessage(that.$t('t-confirm-password-not-match'), sameAs(that.reset.newPassword)),
                }
            }
        }
    },
    methods: {
        getQueryParams(url) {
            const paramArr = url.slice(url.indexOf('?') + 1).split('&');
            const params = {};
            paramArr.map(param => {
                const [key, val] = param.split('=');
                params[key] = decodeURIComponent(val);
            })
            return params;
        },
        async validateExpiresResetLink() {
            try {
                if (this.$route.query.token) {
                    const body = {
                        token: this.$route.query.token
                    }
                    const response = await userService.validateExpiresResetLink(body);
                    this.isValid = response.valid ? true : false;
                } else {
                    this.isValid = false;
                }
            } catch (e) {
                this.isValid = false;
            }
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
        async onReset() {
            this.submitted = true;
            this.v$.reset.$touch();

            if (this.v$.reset.$invalid) {
                return;
            } else {
                try {
                    // api call
                    const body = cloneDeep(this.reset);
                    body.token = this.$route.query.token;
                    delete body.confirmPassword;
                    const response = await userService.resetPassword(body);

                    if (response.updated) {
                        await Swal.fire({
                            title: "",
                            text: this.$t('t-password-reset-success'),
                            icon: "success",
                            showConfirmButton: true,
                        });

                        this.$router.push({ name: 'signin' })
                    }

                } catch (e) {
                    console.log(e, 'reset password');
                }
            }
            this.submitted = false;
        },
        toggleShow(isConfirm) {
            if (isConfirm) {
                this.hideConfirmPassword = !this.hideConfirmPassword;
            } else {
                this.hideNewPassword = !this.hideNewPassword;
            }
        },
        onResetValidationField(field) {
            this.submitted = false;
            this.$nextTick(() => {
                this.v$.reset[field].$reset();
            });
        },
    }
}
</script>

<template>
    <div>
        <div v-if="isValid === false"
            class="auth-page-wrapper auth-bg-cover py-5 d-flex justify-content-center align-items-center min-vh-100">
            <div class="bg-overlay"></div>
            <!-- page content -->
            <div class="auth-page-content overflow-hidden p-0">
                <div class="container">
                    <div class="row justify-content-center">
                        <div class="col-xl-5">
                            <div class="card overflow-hidden">
                                <div class="card-body p-4">
                                    <div class="text-center">
                                        <div class="mt-4">
                                            <p class="w-75 mx-auto mt-5 mb-4 fs-20 text-danger"
                                                style="white-space: pre-line">{{ $t('t-link-expires')}}</p>
                                            <router-link :to="{name: 'signin'}"
                                                class="btn btn-success bg-sauna-green mt-2">
                                                <i class="mdi mdi-home me-1"></i>Back to home
                                            </router-link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <!-- end card -->
                        </div><!-- end col -->
                    </div>
                    <!-- end row -->
                </div>
                <!-- end container -->
            </div>
            <!-- end page content -->
        </div>
        <div v-if="isValid"
            class="auth-page-wrapper auth-bg-cover py-5 d-flex justify-content-center align-items-center min-vh-100">
            <div class="bg-overlay"></div>
            <!-- auth-page content -->
            <div class="auth-page-content overflow-hidden pt-lg-5">
                <div class="container">
                    <div class="row">
                        <div class="col-lg-12">
                            <div class="card overflow-hidden">
                                <div class="row justify-content-center g-0">
                                    <div class="col-lg-6">
                                        <div class="p-lg-5 p-4 auth-one-bg h-100">
                                            <div class="bg-overlay"></div>
                                            <div
                                                class="position-relative h-100 d-flex flex-column justify-content-center align-items-center">
                                                <div>
                                                    <router-link to="/" class="d-block">
                                                        <img src="@/assets/images/svg/tokyo-sauna.svg" alt=""
                                                            width="200" height="190">
                                                    </router-link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <!-- end col -->

                                    <div class="col-lg-6">
                                        <div class="p-lg-5 p-4">
                                            <h5 class="fs-20 text-black">{{ $t('t-password-reset-title') }}</h5>

                                            <div class="p-2">
                                                <form @submit.prevent="onReset">
                                                    <div class="mb-4">
                                                        <label class="form-label">{{ $t('t-username') }}</label>
                                                        <input type="email" class="form-control" :disabled="true"
                                                            v-model="reset.email" id="email"
                                                            :placeholder="$t('field_required',{field: $t('t-email')})">

                                                    </div>

                                                    <div class="mb-4">
                                                        <label for="newPassword" class="form-label">{{
                                                        $t('t-new-password')
                                                        }}<span class="text-danger">*</span></label>

                                                        <div class="form-icon right">
                                                            <input :type="hideNewPassword ? 'password' : 'text'"
                                                                class="form-control form-control-icon" id="newPassword"
                                                                :placeholder="$t('field_required',{field: $t('t-new-password')})"
                                                                @focus="() => onResetValidationField('newPassword')"
                                                                v-model="reset.newPassword"
                                                                :class="{ 'is-invalid': submitted && v$.reset.newPassword.$error }">
                                                            <i :class="getIconClass(hideNewPassword, submitted, v$.reset.newPassword.$error )"
                                                                @click="() => toggleShow(false)"></i>
                                                        </div>

                                                        <div v-if="submitted && v$.reset.newPassword.$error"
                                                            class="invalid-feedback d-flex flex-column">
                                                            <span v-if="v$.reset.newPassword.required.$invalid">{{
                                                            v$.reset.newPassword.required.$message
                                                            }}</span>

                                                            <span
                                                                v-if="v$.reset.newPassword.minLength.$invalid && !v$.reset.newPassword.required.$invalid">{{
                                                                v$.reset.newPassword.minLength.$message
                                                                }}</span>

                                                            <span
                                                                v-if="v$.reset.newPassword.maxLength.$invalid && !v$.reset.newPassword.minLength.$invalid && !v$.reset.newPassword.required.$invalid">{{
                                                                v$.reset.newPassword.maxLength.$message
                                                                }}</span>

                                                        </div>
                                                    </div>

                                                    <div class="mb-4">
                                                        <label for="passwordConfirm" class="form-label">{{
                                                        $t('t-new-password-confirm')
                                                        }}<span class="text-danger">*</span></label>

                                                        <div class="form-icon right">
                                                            <input :type="hideConfirmPassword ? 'password' : 'text'"
                                                                class="form-control form-control-icon"
                                                                id="passwordConfirm"
                                                                :placeholder="$t('field_required',{field: $t('t-new-password-confirm')})"
                                                                @focus="() => onResetValidationField('confirmPassword')"
                                                                v-model="reset.confirmPassword"
                                                                :class="{ 'is-invalid': submitted && v$.reset.confirmPassword.$error }">
                                                            <i :class="getIconClass(hideConfirmPassword, submitted, v$.reset.confirmPassword.$error )"
                                                                @click="() => toggleShow(true)"></i>
                                                        </div>

                                                        <div v-if="submitted && v$.reset.confirmPassword.$error"
                                                            class="invalid-feedback d-flex flex-column">
                                                            <span v-if="v$.reset.confirmPassword.required.$invalid">{{
                                                            v$.reset.confirmPassword.required.$message
                                                            }}</span>

                                                            <span
                                                                v-if="v$.reset.confirmPassword.sameAs.$invalid && !v$.reset.confirmPassword.required.$invalid">{{
                                                                v$.reset.confirmPassword.sameAs.$message
                                                                }}</span>

                                                        </div>
                                                    </div>

                                                    <div class="text-center mt-4">
                                                        <button class="btn btn-success bg-sauna-green w-100"
                                                            type="submit">{{ $t('t-confirmation') }}</button>
                                                    </div>
                                                </form><!-- end form -->
                                            </div>

                                        </div>
                                    </div>
                                    <!-- end col -->
                                </div>
                                <!-- end row -->
                            </div>
                            <!-- end card -->
                        </div>
                        <!-- end col -->

                    </div>
                    <!-- end row -->
                </div>
                <!-- end container -->
            </div>
            <!-- end auth page content -->

            <!-- footer -->
            <footer class="footer">
                <div class="container">
                    <div class="row">
                        <div class="col-lg-12">
                            <div class="text-center">
                                <p class="mb-0">&copy; {{ $t('t-liscense') }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
            <!-- end Footer -->
        </div>
    </div>
    <!-- end auth-page-wrapper -->
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