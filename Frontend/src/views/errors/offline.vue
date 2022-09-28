<script>
    export default {
        methods: {
            refresh() {
                if(navigator.onLine) {
                    this.$router.back()
                }
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
                <div class="row justify-content-center">
                    <div class="col-xl-5">
                        <div class="card overflow-hidden">
                            <div class="card-body p-4">
                                <div class="text-center">
                                    <img src="@/assets/images/svg/error-network.svg" alt="" class="mt-4 mb-2" height="64">
                                    <p class="mb-4 mt-4 fs-14 white-space-pre-line">{{ $t('t-no-network-notify')}}</p>
                                    <button class="btn btn-success bg-sauna-green btn-border mt-4"
                                        @click="refresh"><i
                                            class="ri-refresh-line align-bottom"></i> Refresh</button>
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