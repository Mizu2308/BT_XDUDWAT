<script>
import { STORAGE_KEY } from "@/constants";

export default {
    data() {
        return {
        }
    },
    components: {
    },
    mounted() {
        this.$store.commit('auth/SET_CURRENT_USER', null);
        let rememberMe = localStorage.getItem(STORAGE_KEY.REMEMBER_USER) ? JSON.parse(localStorage.getItem(STORAGE_KEY.REMEMBER_USER)) : false;
        let remember_username = localStorage.getItem(STORAGE_KEY.REMEMBER_USERNAME);
        localStorage.clear();
        localStorage.setItem(STORAGE_KEY.REMEMBER_USER, rememberMe);
        if (rememberMe) {
            localStorage.setItem(STORAGE_KEY.REMEMBER_USERNAME, remember_username);
        }
    }
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
                                        <div class="position-relative h-100 d-flex flex-column justify-content-center align-items-center">
                                            <div>
                                                <router-link to="/" class="d-block">
                                                    <img src="@/assets/images/svg/tokyo-sauna.svg" alt="" width="200" height="190">
                                                </router-link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <!-- end col -->

                                <div class="col-lg-6">
                                    <div class="p-lg-5 p-4 text-center">
                                         <img src="@/assets/images/svg/logout.svg" alt="" class="mb-5" />

                                        <div class="mt-4 pt-2">
                                            <h5>{{ $t('t-logged-out') }}</h5>
                                            <p class="text-muted">
                                                <span class="fw-semibold">{{ $t("t-brand-name") }}</span>{{ $t('t-thankyou-loggout') }}
                                            </p>
                                            <div class="mt-4">
                                                <router-link to="/login" class="btn btn-success bg-sauna-green w-100">{{$t('t-signin')}}</router-link>
                                            </div>
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