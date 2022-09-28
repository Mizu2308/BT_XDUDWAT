<script>
import Lottie from "@/components/widgets/lottie.vue";
import animationData from "@/components/widgets/rhvddzym.json";
import useVuelidate from "@vuelidate/core";
import { required, email, helpers, maxLength } from "@vuelidate/validators";
import { userService } from '@/services';
import Swal from "sweetalert2";

export default {
    components: { lottie: Lottie },
    setup() {
        return { v$: useVuelidate() };
    },
    data() {
        return {
            defaultOptions: { animationData: animationData },
            email: '',
            submitted: false,
            error: {},
            isSendedEmail: false,
        }
    },
    validations() {
        const that = this;
        return {
            email: {
                required: helpers.withMessage(that.$t('field_required', {field: that.$t('t-email') }), required),
                email: helpers.withMessage(this.$t('t-invalid', {field: that.$t('t-email')}), email),
                maxLength: helpers.withMessage(that.$t('field_maxlength', { maxlength: 255, field: that.$t('t-email') }), maxLength(255)),
                server: {
                    $message() {
                        return that.error.email
                    },
                    $validator() {
                        return !that.error.email
                    }
                },
                $autoDirty: true
            }
        }
    },
    methods: {
        async onReset() {
            this.submitted = true;
            this.v$.$touch();

            if (this.isSendedEmail) {
                return;
            }

            if (this.v$.$invalid) {
                return;
            } else {
                try {
                    // api call
                    const body = {
                        email: this.email,
                    }
                    const response = await userService.forgotPassword(body);
                    console.log(response, 'response');
                    if (response.success) {
                        this.submitted = false;
                        this.isSendedEmail = true;
                        await Swal.fire({
                            title: "",
                            text: this.$t('t-notify-email-sender'),
                            icon: "success",
                            showConfirmButton: true,
                        });
                    }
                } catch (e) {
                    if (e.statusCode === 404) {
                        this.error.email = this.$t('t-email-not-registered');
                        this.v$.$reset();
                        this.v$.$touch();
                    }

                    if (e.statusCode === 400) {
                        this.error.email = this.$t('t-invalid', { field: this.$t('t-email')});
                        this.v$.$reset();
                        this.v$.$touch();
                    }
                    console.log(e);
                }
            }
        },
        onResetValidationField(field) {
            this.submitted = false;
            this.$nextTick(() => {
                this.v$[field].$reset();
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
}
</script>

<template>
    <!-- auth-page wrapper -->
    <div class="auth-page-wrapper auth-bg-cover py-5 d-flex justify-content-center align-items-center min-vh-100">
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
                                                    <img src="@/assets/images/svg/tokyo-sauna.svg" alt="" width="200"
                                                        height="190">
                                                </router-link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <!-- end col -->

                                <div class="col-lg-6">
                                    <div class="p-lg-5 p-4">
                                        <h5 class="fs-20 fw-700 text-black">{{ $t('t-forgot-password') }}</h5>
                                        <p class="color-9699a6 fs-12">{{ $t('t-reset-password') }}</p>

                                        <div class="mt-2 text-center">
                                            <lottie class="avatar-xl" colors="primary:#0ab39c,secondary:#405189"
                                                :options="defaultOptions" :height="120" :width="120" />
                                        </div>

                                        <div class="alert alert-borderless alert-warning text-center mb-2 mx-2 fs-10"
                                            role="alert">
                                            {{ $t('t-reset-verify') }}
                                        </div>
                                        <div class="p-2">
                                            <form @submit.prevent="onReset">
                                                <div class="mb-4">
                                                    <label class="form-label label-color">{{ $t('t-email') }}<span
                                                            class="text-danger">*</span></label>
                                                    <input type="text" class="form-control" id="email" v-model="email"
                                                        @keydown.space.prevent :placeholder="$t('field_required',{field: $t('t-email')})"
                                                        :class="{ 'is-invalid': submitted && v$.email.$error }"
                                                        @focus="() => onResetValidationField('email')"
                                                        @input="error.email = ''"
                                                        @keypress="onKeyPressEmailField" maxlength="255">

                                                    <div v-if="submitted && v$.email.$error" class="invalid-feedback">
                                                        <span v-if="v$.email.required.$invalid">{{
                                                        v$.email.required.$message
                                                        }}</span>

                                                        <span
                                                            v-if="v$.email.email.$invalid && !v$.email.required.$invalid">{{
                                                            v$.email.email.$message
                                                            }}</span>

                                                        <span
                                                            v-if="v$.email.maxLength.$invalid && !v$.email.email.$invalid && !v$.email.required.$invalid">{{
                                                            v$.email.maxLength.$message
                                                            }}</span>

                                                        <span
                                                            v-if="v$.email.server.$invalid">{{
                                                            v$.email.server.$message
                                                            }}</span>
                                                    </div>
                                                </div>

                                                <div class="text-center mt-4">
                                                    <button :disabled="isSendedEmail" class="btn btn-success bg-sauna-green w-100"
                                                        type="submit">{{ $t('t-send-link') }}</button>
                                                </div>
                                            </form><!-- end form -->
                                        </div>

                                        <div class="mt-5 d-flex justify-content-center px-5 fs-12">
                                            <p class="mb-0 pe-0">
                                                {{ $t('t-text-remember-password') }}
                                            </p>
                                            <router-link to="/login"
                                                class="fw-semibold text-primary text-decoration-underline">
                                                {{ $t('t-click-here') }}
                                            </router-link>
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
    <!-- end auth-page-wrapper -->
</template>