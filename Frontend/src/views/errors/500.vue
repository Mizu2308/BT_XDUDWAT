<script>
import { mapGetters } from "vuex";
import { ORIGIN_URL } from "@/constants";

export default {
    computed: {
        ...mapGetters('auth', ['currentUser']),
        originURL() {
            if (this.currentUser) {
                return ORIGIN_URL[this.currentUser?.role || '/'];
            }
            return '/login';
        }
    },
}
</script>

<template>


    <!-- page wrapper -->
    <div class="auth-page-wrapper auth-bg-cover py-5 d-flex justify-content-center align-items-center min-vh-100">
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
                                    <img src="@/assets/images/svg/500.svg" alt="error img" height="92" />
                                <p class="w-75 mx-auto mt-5 mb-4 white-space-pre-line">{{ $t('t-500-notify')}}</p>
                                <router-link :to="originURL" class="btn btn-success bg-sauna-green mt-2"><i class="mdi mdi-home me-1"></i>Back to home</router-link>
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
    <!-- end page-wrapper -->
</template>