<script>
import { mapGetters } from "vuex";
import { ORIGIN_URL } from "@/constants";

export default {
    data() {
        return {
        };
    },
    components: {
    },
    computed: {
        ...mapGetters('auth', ['currentUser']),
        originURL() {
            if (this.currentUser) {
                return ORIGIN_URL[this.currentUser?.role || '/admin'];
            }
            return '/login';
        }
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
                    <div class="row justify-content-center">
                        <div class="col-xl-5">
                            <div class="card overflow-hidden">
                                <div class="card-body p-4">
                                    <div class="text-center">
                                        
                                        <img src="@/assets/images/logo-error.png" alt="error img" class="img-fluid mt-4 mb-4" height="92" />
                                        <h4 class="text-uppercase mt-4">Sorry, Page not Found</h4>
                                        <p class="text-muted mb-4 white-space-pre-line">{{ $t('t-404-notify') }}</p>
                                        <router-link :to="originURL" class="btn btn-success"><i class="mdi mdi-home me-1"></i>Back to home</router-link>
                                    </div>
                                </div>
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
        </div>
        <!-- end auth-page-wrapper -->
</template>