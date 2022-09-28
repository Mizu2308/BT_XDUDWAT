<template>
  <div v-if="!loading" class="row dashboard-widget" @scroll="onScroll">
    <div class="col-xl-3 col-xs-12 col-md-6" v-for="(item, index) of projectsWidgets" :key="index" :class="item.textColor">
      <div class="card card-animate">
        <div
          class="card-body"
          :class="{
            'bg-success' : item.backgroundClass === 'success',
            'bg-danger' : item.backgroundClass === 'error',
            'bg-info' : item.backgroundClass === 'info',
            'bg-warning' : item.backgroundClass === 'warning',
          }"
        >
          <div class="d-flex align-items-center">
            <div class="avatar-sm flex-shrink-0">
              <span
                class="avatar-title rounded-2 fs-2"
                :class="{
                  'badge-white text-primary': item.feaIconClass,
                  'badge-grey text-warning': !item.feaIconClass,
                }"
              >
              <template v-if="item.feaIcon">
                  <img :src="item.feaIcon" alt="">
                </template>
              </span>
            </div>
            <div class="flex-grow-1 overflow-hidden ms-3">
              <p class="text-uppercase fw-medium text-truncate mb-3">
                {{ $t(item.label) }}
              </p>
              <div class="d-flex align-items-center mb-3 w-100 justify-content-between">
                <div class="widget-content">
                  <span class="content-title mr-2">
                    {{ item.counter }}
                  </span>
                  <span>{{ `${$t('t-name2')} / ${item.subLabel}${$t('t-name2')}` }}</span>
                </div>
                <span
                  class="badge badge-widget fs-14"
                  :class="{
                    'badge-white': item.backgroundClass,
                    'badge-grey': !item.backgroundClass
                  }"
                >
                  <span>{{ item.percentage }}</span>
                </span>
              </div>
              <p class="text-truncate mb-0">{{ item.description }}</p>
            </div>
          </div>
        </div>
        <!-- end card body -->
      </div>
    </div>
  </div>
</template>

<script>
import { roomService } from "@/services/room.service";
import { ref, onMounted, watch, computed  } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';

export default {
  setup() {

    const projectsWidgets = ref([]);

    const projectsWidgetsDefault = ref([
      {
          id: 3,
          feaIcon: require("@/assets/images/dashboard/restaurant.png"),
          feaIconClass: "",
          textColor: 'text-black',
          label: "t-restaurant",
          counter: "--",
          subLabel: "--",
          description: "レストラン 1",
          suffix: "m",
          badgeClass: "danger",
          icon: "ri-arrow-down-s-line",
          percentage: "--%",
          backgroundClass: '',
          caption: "Work this month",
        },
        {
          id: 4,
          feaIcon: require("@/assets/images/dashboard/img1.png"),
          feaIconClass: "",
          textColor: 'text-black',
          label: "t-coworking-space",
          counter: "--",
          subLabel: "--",
          description: "コワーキングスペース 1",
          suffix: "m",
          badgeClass: "danger",
          icon: "ri-arrow-down-s-line",
          percentage: "--%",
          backgroundClass: '',
          caption: "Work this month",
        },
    ]);
    const store = useStore();
    const route = useRoute();
    const loading = ref(false);

    const totalPage = ref(0);
    const currentPage = ref(0);
    const intervalRefreshData = ref();

    const refreshData = computed(() => store.getters['settings/getRefreshData']);
    const secondRefresh = computed(() => store.getters['settings/getSeconds']);
    const currentUser = computed(() => store.getters['auth/currentUser']);

    const params = ref({
      page: 1,
      pageSize: 10,
      subType: 'SAUNA_DRIED',
      facilityId: currentUser?.value?.facilityId || '',
    });

    // Function get all rooms dashboard
    const getRoomsDashboard = async (type) => {

      try {
        if (!type || type !== 'refresh') {
          loading.value = true;
        }
        let res = await roomService.getRoomsDashboard(params.value);
        if (res) {
          totalPage.value = res?.pagination?.totalPage;
          currentPage.value = res?.pagination?.currentPage;
          let widgets = res.data.map(r => {
            let percentage = Math.round((r.currentPeopleCount / r.capacity) * 100);

            return {
              id: r.id,
              feaIcon: require("@/assets/images/dashboard/img345.png"),
              feaIconClass: "success",
              textColor: 'text-white',
              label: r.type === 'SAUNA_ROOM_MALE' ? 't-men-bath-room' : r.type === 'SAUNA_ROOM_FEMALE' ? 't-women-bath-room' : '',
              counter: r.currentPeopleCount,
              subLabel: r.capacity,
              description: r.name,
              suffix: "",
              badgeClass: "danger",
              icon: "ri-arrow-down-s-line",
              percentage: `${percentage}%`,
              backgroundClass: percentage < 40 ? 'info' : (40 <= percentage && percentage < 60) ? 'success' : (60 <= percentage && percentage < 80) ? 'warning' : 'error',
            }
          });

          for (let index = 0; index < widgets.length; index++) {
            const element = widgets[index];
            let findIndex = projectsWidgets.value.findIndex(w => w.id === element.id);
            if (findIndex !== -1) {
              projectsWidgets.value[findIndex] = element;
            } else {
              projectsWidgets.value = [ ...projectsWidgets.value, element ];
            }
          }

          for (let index = 0; index < projectsWidgetsDefault.value.length; index++) {
            const element = projectsWidgetsDefault.value[index];
            let findIndex = projectsWidgets.value.findIndex(w => w.id === element.id);
            if (findIndex !== -1) {
              projectsWidgets.value[findIndex] = element;
            } else {
              projectsWidgets.value = [ ...projectsWidgets.value, element ];
            }
          }

        }
        loading.value = false;
      } catch (error) {
        console.log(error);
        loading.value = false;
      }
    };

    watch(route, (to) => {
      if (to.name.value !== 'default') {
        clearInterval(intervalRefreshData.value);
      }
    }, {flush: 'pre', immediate: true, deep: true})

    watch(refreshData, (data) => {
      if (!data) {
        clearInterval(intervalRefreshData.value);
      } else {
        if (refreshData.value && secondRefresh.value && (secondRefresh.value * 1 > 29)) {
          intervalRefreshData.value = setInterval(() => {
            getRoomsDashboard('refresh');
          }, secondRefresh.value * 1000);
        } else {
          clearInterval(intervalRefreshData.value);
        }
      }
    })

    onMounted(() => {
      if (refreshData.value && secondRefresh.value && (secondRefresh.value * 1 > 29)) {
        intervalRefreshData.value = setInterval(() => {
          getRoomsDashboard('refresh');
        }, secondRefresh.value * 1000);
      } else {
        clearInterval(intervalRefreshData.value);
      }
      getRoomsDashboard();

    });

    // Function onScroll
    const onScroll = (e) => {
      const el = e.srcElement;

      if (!loading.value && (Math.abs(el.scrollLeft + 10)) > el.scrollWidth - el.clientWidth) {
        if (currentPage.value < totalPage.value) {
          params.value.page += 1;
          getRoomsDashboard();
        }
      }
    }

    return {
      loading,
      projectsWidgets,
      onScroll
    };
  },
  components: {
  },
};
</script>

<style lang="scss">

  .dashboard-widget {
    font-size: 14px;
    flex-wrap: nowrap;
    overflow: auto;

    .widget-content {
      .content-title {
        font-size: 40px;
      }
      
    }
    .badge-widget {
      padding: 10px 20px;
    }
    .badge-white {
      background: rgba(255, 255, 255, 0.4);
      color: white;
    }
    .badge-grey {
      background: rgba(222,219,219, 0.4);
      color: #495057;
    }
  }
</style>
