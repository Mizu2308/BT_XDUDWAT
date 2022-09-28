<script>
import Layout from "@/layouts/main.vue";
import PageHeader from "@/components/page-header";
import FacilityAccountList from './facility-account-list.vue';

export default {
    setup() {

    },
    components: {
        Layout,
        PageHeader,
        FacilityAccountList,
    },
    data() {
        return {
            title: this.$i18n.t('t-header-user-management'),
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
        }
    },
    mounted() {
    },
    methods: {
        toCreate() {
            this.$router.push({ name: `facility-manager-create-user`, query: { role: 'FACILITY_ACCOUNT' } })
        }
    },
}
</script>

<template>
    <Layout>
        <PageHeader :title="title" :items="items" />
        <div class="card rounded-3 h-75">
            <div class="card-header d-flex justify-content-between align-items-center ps-4 pe-4 pt-2 pb-2">
                <h6 class="fs-16 mb-0">{{ $t("t-user-info") }}</h6>
                <b-button @click="toCreate" variant="dark" class="waves-effect waves-light w-sm pt-2 pb-2" size="sm"
                    data-text="追加">
                    <span>{{ $t('t-create') }}</span>
                </b-button>
            </div>
            <div class="card-body shadow-lg">
                <div>
                    <FacilityAccountList />
                </div>
            </div>
        </div>
    </Layout>

</template>