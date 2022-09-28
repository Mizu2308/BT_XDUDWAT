<style scoped>
input::-webkit-input-placeholder,
input {
    font-size: 12px !important;
    font-weight: 700 !important;
}

.right-3 {
    right: 28px !important;
    top: 12px;
    position: absolute;
}
</style>\

<template>
    <!-- auth-page wrapper -->
    <div class="auth-page-wrapper auth-bg-cover py-5 d-flex justify-content-center align-items-center min-vh-100">
        <div class="bg-overlay"></div>
        <!-- auth-page content -->
        <div class="auth-page-content overflow-hidden pt-lg-5">
            <div class="container h">
                <div class="row">
                    <div class="col-lg-12">
                        <div class="card overflow-hidden">
                            <div class="row g-0">
                                <div class="col-lg-6">
                                    <div class="p-lg-5 p-4 auth-one-bg h-100">
                                        <div class="bg-overlay"></div>
                                        <div
                                            class="position-relative h-100 d-flex align-center justify-content-center flex-column">
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
                                    <div class="p-lg-5 p-5">
                                        <div class="pt-5">
                                            <h5 class="fs-20 fw-700 text-black lang-en">{{ $t('t-welcome') }}</h5>
                                        </div>

                                        <div class="mt-4 mb-5">
                                            <form>

                                                <div class="mb-3 mt-5">
                                                    <label for="username" class="form-label fs-14 fw-700 label-color">{{
                                                    $t('t-username') }}</label>
                                                    <input :type="'text'" name="username"
                                                        :autocomplete="`username-${new Date().getTime()}`"
                                                        autofill="off" class="form-control fs-12 fw-700" id="username"
                                                        :placeholder="$t('t-enter-username')"
                                                        v-model="v$.username.$model"
                                                        @keypress="onKeyPressEmailField"
                                                        :class="{ 'is-invalid': v$.username && invalid && v$.username.$invalid }">
                                                    <div v-if="v$.username.$error && invalid" class="invalid-feedback">

                                                        <div v-if="v$.username.required.$invalid">
                                                            {{ $t('field_required', { field: $t('username') }) }}
                                                        </div>

                                                        <div v-if="v$.username.email.$invalid">
                                                            {{ $t('incorrect_email') }}
                                                        </div>

                                                        <div v-if="v$.username.maxLength.$invalid">
                                                            {{ $t('field_maxlength', { maxlength: 255, field:
                                                            $t('t-username') }) }}
                                                        </div>

                                                    </div>
                                                </div>

                                                <div class="mb-3">
                                                    <div class="float-end fs-12 fw-700">
                                                        <router-link :to="{name: 'forgot-password'}" class="fs-12 color-9699a6">
                                                            {{ $t('t-forgot-password')}}</router-link>
                                                    </div>
                                                    <label class="form-label fs-14 fw-700 label-color" for="password-input">{{
                                                    $t('t-password')}}</label>
                                                    <div class="position-relative auth-pass-inputgroup mb-3">
                                                        <input name="password" v-on:keyup.enter="onLogin"
                                                            :type="showPassword ? 'text' : 'password'"
                                                            class="form-control pe-5 fs-12 fw-700"
                                                            :placeholder="$t('t-enter-password')" id="password-input"
                                                            v-model="v$.password.$model"
                                                            :class="{ 'is-invalid': v$.password && invalid && v$.password.$invalid }">
                                                        <button
                                                            class="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted"
                                                            type="button" id="password-addon">
                                                            <i @click="togglePassword"
                                                                :class="getIconClass(showPassword, v$.password.$error)"
                                                                ></i>
                                                        </button>
                                                        <div v-if="v$.password.$error && invalid"
                                                            class="invalid-feedback">

                                                            <div
                                                                v-if="v$ && v$.password && v$.password.required.$invalid">
                                                                {{ $t('field_required', { field: $t('password') }) }}
                                                            </div>

                                                            <div v-if="v$.password.maxLength.$invalid">
                                                                {{ $t('field_maxlength', { maxlength: 255, field:
                                                                $t('password') }) }}
                                                            </div>

                                                        </div>
                                                    </div>
                                                </div>

                                                <div class="form-check">
                                                    <input @change="onChangeRememberMe" class="form-check-input"
                                                        type="checkbox" v-model="rememberMe" id="auth-remember-check">
                                                    <label class="form-check-labe fs-12 fw-700 label-color"
                                                        for="auth-remember-check">{{ $t('t-remember')}}</label>
                                                </div>

                                                <div class="mt-4">
                                                    <button @click="onLogin" class="btn btn-success w-100 fs-14 fw-700"
                                                        type="button">{{ $t('t-signin')}}</button>
                                                </div>


                                            </form>
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

<script>
let tagArr = document.getElementsByTagName("input");
for (let i = 0; i < tagArr.length; i++) {
    tagArr[i].autocomplete = 'off';
}
import { authService } from "@/services/auth.service";
import { STORAGE_KEY, ORIGIN_URL } from "../../../constants";

import { reactive, ref, onMounted } from "vue";
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import Swal from "sweetalert2";
import i18n from '@/i18n'
import { required, maxLength } from '@vuelidate/validators';
import useVuelidate from '@vuelidate/core';

export default {
    setup() {

        const store = useStore();
        const router = useRouter();
        // const route = useRoute();
        const user = reactive({
            username: '',
            password: ''
        });

        const showPassword = ref(false);

        const rememberMe = ref(false);

        const invalid = ref(false);

        const fieldTypes = reactive({
            password: 'text',
        });

        const rules = {
            username: { required, maxLength: maxLength(255) },
            password: { required, maxLength: maxLength(255) }
        }

        const v$ = useVuelidate(rules, user);

        onMounted(() => {
            rememberMe.value = localStorage.getItem(STORAGE_KEY.REMEMBER_USER) ? JSON.parse(localStorage.getItem(STORAGE_KEY.REMEMBER_USER)) : false;
            if (localStorage.getItem(STORAGE_KEY.REMEMBER_USERNAME)) {
                user.username = localStorage.getItem(STORAGE_KEY.REMEMBER_USERNAME);
            }
        });

        const togglePassword = () => {
            showPassword.value = !showPassword.value;
        }

        const onKeyPressEmailField = (e) => {
            if (e.which !== 32) {
                return true;
            }

            e.preventDefault();
            return false;
        }

        const onChangeRememberMe = () => {
            localStorage.setItem(STORAGE_KEY.REMEMBER_USER, rememberMe.value);
        }

        const onLogin = async () => {
            v$.value.$touch();
            invalid.value = v$.value.$invalid;
            console.log(v$)
            if (!v$.value.$invalid) {
                try {
                    let userForm = { ...user };
                    userForm.username = userForm.username.replace(/ /g, "");
                    userForm.password = userForm.password.replace(/ /g, "");
                    let res = await authService.login(userForm);
                    console.log(res)
                    if (res) {
                        let userLogin = res?.user || null;
                        let token = res?.accessToken || null;
                        store.commit('auth/SET_CURRENT_USER', userLogin);
                        await localStorage.setItem(STORAGE_KEY.ACCESS_TOKEN, token);
                        if (rememberMe.value) {
                            await localStorage.setItem(STORAGE_KEY.REMEMBER_USERNAME, userLogin.username);
                        }
                        let originURL = ORIGIN_URL[userLogin.role];
                        router.push(originURL);
                    } else {
                        Swal.fire("", i18n.global.t('INVALID_MAIL_PASS'), "error");
                    }
                } catch (err) {
                    let message = err?.response?.data?.message || '';
                    if (message) {
                        Swal.fire("", i18n.global.t(message), "error");
                    } else {
                        Swal.fire("", i18n.global.t('INVALID_MAIL_PASS'), "error");
                    }
                    console.log(err)
                }
            }

        }

        const getIconClass = (hide, isError) => {

            if (hide && isError) {
                return 'bx bx-show right-3'
            }

            if (!hide && isError) {
                return 'bx bx-hide right-3'
            }

            return hide ? 'bx bx-show' : 'bx bx-hide';
        }

        const handleType = (event) => {
            const { srcElement, type } = event;
            const { name, value } = srcElement;

            if (type === 'blur' && !value) {
                fieldTypes[name] = 'text'
            } else {
                fieldTypes[name] = 'password'
            }
            console.log('fieldTypes', fieldTypes);

        }

        return {
            v$,
            user,
            invalid,
            showPassword,
            rememberMe,
            fieldTypes,
            onLogin,
            togglePassword,
            onChangeRememberMe,
            handleType,
            getIconClass,
            onKeyPressEmailField
        };
    }
}
</script>
