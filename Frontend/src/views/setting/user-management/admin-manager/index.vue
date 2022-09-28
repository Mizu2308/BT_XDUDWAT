<script>
import Layout from "../../../../layouts/main.vue";
import PageHeader from "@/components/page-header";
import TabletList from './tablet-list.vue';
import FacilityManagerList from './facility-manager-list.vue';

export default {
    setup() {

    },
    components: {
        Layout,
        PageHeader,
        TabletList,
        FacilityManagerList,
    },
    data() {
        return {
            title: this.$i18n.t(''),
            items: [
                {
                    text: 'SETTING',
                    href: "/",
                },
                {
                    text: this.$i18n.t('t-user-management'),
                    active: true,
                },
            ],
            tabIdActive: '',
        }
    },
    beforeMount() {
        this.tabIdActive = this.$route.query.activeTab || 'facilityManager'
    },
    mounted() {
    },
    methods: {
        onChangeTab(tabId) {
            this.$router.replace({name: 'user-management-by-admin', query: {
                activeTab: tabId
            }})
            this.tabIdActive = tabId;
        },
        toCreate() {
            this.$router.push({ name: `admin-create-user`, query: { role: 'FACILITY_MANAGER' } })
        }
    },
}
</script>

<template>
    <Layout>
        <PageHeader :title="title" :items="items" />
        <div class="card rounded-3">
            <div class="card-header d-flex justify-content-between align-items-center ps-4 pe-4 pt-2 pb-2">
                <h6 class="fs-16 mb-0">{{ $t("t-user-info") }}</h6>
                <b-button @click="toCreate" variant="dark" class="waves-effect waves-light w-sm pt-2 pb-2"
                    data-text="追加">
                    <span class="fs-12">{{ $t('t-create') }}</span>
                </b-button>
            </div>
            <div class="card-body shadow-lg">
                <div>
                    <!-- Nav tabs -->
                    <ul class="nav nav-tabs  mb-3 d-flex justify-content-center" role="tablist">
                        <li class="nav-item">
                            <a
                                :class="{ 'active': tabIdActive == 'facilityManager'}"
                                class="nav-link d-flex flex-column align-items-center justify-content-center fs-12"
                                style="height: 100%;color: #878a99;" data-bs-toggle="tab" href="javascript:void(0);" role="tab"
                                aria-selected="false" @click="() => onChangeTab('facilityManager')">
                                {{ $t("t-admin-facility") }}
                            </a>
                        </li>
                        <li class="nav-item">
                            <a
                            :class="{ 'active': tabIdActive == 'tablet'}"
                                class="nav-link text-center fs-12" data-bs-toggle="tab" href="javascript:void(0);" role="tab"
                                aria-selected="true" @click="() => onChangeTab('tablet')"
                                style="white-space: pre-line;color: #878a99;">
                                {{ $t("t-admin-tablet") }}
                            </a>
                        </li>
                    </ul>
                    <!-- Tab panes -->
                    <div class="tab-content  text-muted">
                        <div class="tab-pane" :class="{ 'active': tabIdActive == 'facilityManager'}" id="facilityManager" role="tabpanel">
                            <FacilityManagerList v-if="tabIdActive === 'facilityManager'" />
                        </div>
                        <div class="tab-pane" id="tablet" :class="{ 'active': tabIdActive == 'tablet'}" role="tabpanel">
                            <TabletList v-if="tabIdActive === 'tablet'" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Layout>

</template>