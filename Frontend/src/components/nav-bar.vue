<script>
import { mapActions } from "vuex";
import { imageURL } from "@/helpers/image";

import i18n from "../i18n";
import { authService } from "@/services/auth.service";
import { onMounted, computed, ref, watch } from "vue";
import { useStore } from 'vuex';
import { ROLES } from '@/constants';

/**
 * Nav-bar Component
 */
export default {
  setup() {
    const store = useStore();

    const currentUser = computed(() => store.getters[`auth/currentUser`]);

    const isAdmin = computed(() => currentUser.value.role === ROLES.ADMIN);

    const isFacilityManager = computed(() => currentUser.value.role === ROLES.FACILITY_MANAGER);

    const getUserAvatar = () => {
      const pathAvatar = imageURL(currentUser.value.pathAvatar);

      return pathAvatar ? pathAvatar : require("@/assets/images/users/avatar-1.jpg");
    };

    const getProfile = async () => {
      try {
        let res = await authService.getUserProfile();
        if(res) {
          store.commit('auth/SET_CURRENT_USER', res);
        }
      } catch (error) {
        console.log(error);
      }
    }

    const refreshData = ref(localStorage.getItem('refresh') ? JSON.parse(localStorage.getItem('refresh')): false);

    watch(() => refreshData.value, (newValue) => {
      localStorage.setItem('refresh', newValue);
      store.commit('settings/SET_REFRESH_DATA', newValue);
    });

    onMounted(() => {
      getProfile();
    })

    return {
      currentUser,
      refreshData,
      getUserAvatar,
      getProfile,
      isAdmin,
      isFacilityManager,
    };

  },
  data() {
    return {
      language: {
        flag: require("@/assets/images/flags/jp.svg"),
        language: "jp",
        title: "Japanese",
      },
      lan: i18n.locale,
      text: null,
      flag: null,
      value: null,
      myVar: 1,
    };
  },
  components: {
  },
  mounted() {
    document.addEventListener("scroll", function () {
      var pageTopbar = document.getElementById("page-topbar");
      if (pageTopbar) {
        document.body.scrollTop >= 50 || document.documentElement.scrollTop >= 50 ? pageTopbar?.classList.add(
          "topbar-shadow") : pageTopbar?.classList.remove("topbar-shadow");
      }
    });
    if (document.getElementById("topnav-hamburger-icon"))
      document
        .getElementById("topnav-hamburger-icon")
        .addEventListener("click", this.toggleHamburgerMenu);

    this.isCustomDropdown();
  },
  methods: {
    ...mapActions('layout', [
      'changeSidebarColor',
      'changeTopbar',
      'changeMode'
    ]),
    isCustomDropdown() {
      //Search bar
      var searchOptions = document.getElementById("search-close-options");
      var dropdown = document.getElementById("search-dropdown");
      var searchInput = document.getElementById("search-options");

      searchInput?.addEventListener("focus", () => {
        var inputLength = searchInput.value.length;
        if (inputLength > 0) {
          dropdown?.classList.add("show");
          searchOptions?.classList.remove("d-none");
        } else {
          dropdown?.classList.remove("show");
          searchOptions?.classList.add("d-none");
        }
      });

      searchInput?.addEventListener("keyup", () => {
        var inputLength = searchInput.value.length;
        if (inputLength > 0) {
          dropdown?.classList.add("show");
          searchOptions?.classList.remove("d-none");
        } else {
          dropdown?.classList.remove("show");
          searchOptions?.classList.add("d-none");
        }
      });

      searchOptions?.addEventListener("click", () => {
        searchInput.value = "";
        dropdown?.classList.remove("show");
        searchOptions?.classList.add("d-none");
      });

      document.body.addEventListener("click", (e) => {
        if (e.target.getAttribute("id") !== "search-options") {
          dropdown?.classList.remove("show");
          searchOptions?.classList.add("d-none");
        }
      });
    },
    toggleHamburgerMenu() {
      var windowSize = document.documentElement.clientWidth;

      if (windowSize > 767)
        document.querySelector(".hamburger-icon")?.classList.toggle("open");

      //For collapse horizontal menu
      if (
        document.documentElement.getAttribute("data-layout") === "horizontal"
      ) {
        document.body?.classList.contains("menu") ?
          document.body?.classList.remove("menu") :
          document.body?.classList.add("menu");
      }

      //For collapse vertical menu
      if (document.documentElement.getAttribute("data-layout") === "vertical") {
        if (windowSize < 1025 && windowSize > 767) {
          document.body?.classList.remove("vertical-sidebar-enable");
          document.documentElement.getAttribute("data-sidebar-size") == "sm" ?
            document.documentElement.setAttribute("data-sidebar-size", "") :
            document.documentElement.setAttribute("data-sidebar-size", "sm");
        } else if (windowSize > 1025) {
          document.body?.classList.remove("vertical-sidebar-enable");
          document.documentElement.getAttribute("data-sidebar-size") == "lg" ?
            document.documentElement.setAttribute("data-sidebar-size", "sm") :
            document.documentElement.setAttribute("data-sidebar-size", "lg");
        } else if (windowSize <= 767) {
          document.body?.classList.add("vertical-sidebar-enable");
          document.documentElement.setAttribute("data-sidebar-size", "lg");
        }
      }

      //Two column menu
      if (document.documentElement.getAttribute("data-layout") == "twocolumn") {
        document.body?.classList.contains("twocolumn-panel") ?
          document.body?.classList.remove("twocolumn-panel") :
          document.body?.classList.add("twocolumn-panel");
      }
    },
    toggleMenu() {
      this.$parent.toggleMenu();
    },
    toggleRightSidebar() {
      this.$parent.toggleRightSidebar();
    },
    initFullScreen() {
      document.body?.classList.toggle("fullscreen-enable");
      if (
        !document.fullscreenElement &&
        /* alternative standard method */
        !document.mozFullScreenElement &&
        !document.webkitFullscreenElement
      ) {
        // current working methods
        if (document.documentElement.requestFullscreen) {
          document.documentElement.requestFullscreen();
        } else if (document.documentElement.mozRequestFullScreen) {
          document.documentElement.mozRequestFullScreen();
        } else if (document.documentElement.webkitRequestFullscreen) {
          document.documentElement.webkitRequestFullscreen(
            Element.ALLOW_KEYBOARD_INPUT
          );
        }
      } else {
        if (document.cancelFullScreen) {
          document.cancelFullScreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        }
      }
    },
    setLanguage(locale, country, flag) {
      this.lan = locale;
      this.text = country;
      this.flag = flag;
      document.getElementById("header-lang-img").setAttribute("src", flag);
      i18n.global.locale = locale;
    },
    toggleDarkMode() {
      if (document.documentElement.getAttribute("data-layout-mode") == "dark") {
        document.documentElement.setAttribute("data-layout-mode", "light");
        this.changeSidebarColor({sidebarColor: "light"});
        this.changeTopbar({topbar: "light"});
        this.changeMode({topbar: "light"});
      } else {
        document.documentElement.setAttribute("data-layout-mode", "dark");
        this.changeSidebarColor({sidebarColor: "dark"});
        this.changeTopbar({topbar: "dark"});
        this.changeMode({topbar: "dark"});
        
      }
    },
    getRouteName() {
      //check role then -> navigate route
      return 'facility-info-management';
    }
  },
  computed: {},
};
</script>

<template>
  <header id="page-topbar">
    <div class="layout-width">
      <div class="navbar-header">
        <div class="d-flex">
          <!-- LOGO -->
          <div class="navbar-brand-box horizontal-logo">
            <router-link to="/" class="logo logo-dark">
              <span class="logo-sm">
                <img src="@/assets/images/svg/brand/dark/tokyo-sauna-collapse.png" alt="" height="22" />
              </span>
              <span class="logo-lg">
                <img src="@/assets/images/svg/brand/dark/tokyo-sauna.svg" alt="" height="17" />
              </span>
            </router-link>

            <router-link to="/" class="logo logo-light">
              <span class="logo-sm">
                <img src="@/assets/images/svg/brand/light/tokyo-sauna-collapse.png" alt="" height="22" />
              </span>
              <span class="logo-lg">
                <img src="@/assets/images/svg/brand/light/tokyo-sauna.svg" alt="" height="17" />
              </span>
            </router-link>
          </div>

          <!-- Change small/large sidebar -->
          <button type="button" class="
              btn btn-sm
              px-3
              fs-16
              header-item
              vertical-menu-btn
              topnav-hamburger
            " id="topnav-hamburger-icon">
            <span class="hamburger-icon">
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>
          
        </div>

        <div v-if="currentUser && currentUser.facility && !isAdmin" class="d-flex align-items-center justify-content-center">
          <div class="navbar-facility-name">
            {{ currentUser.facility.name }}
          </div>
        </div>

        <div class="d-flex align-items-center">

          <!-- Change refresh data -->
          <div v-if="$route.name == 'default'" class="ms-1 header-item d-none d-sm-flex mr-1">
            <div class="form-check form-switch form-switch-md" dir="ltr">
                <input v-model="refreshData" type="checkbox" class="form-check-input" id="customSwitchsizemd">
                <label class="form-check-label" for="customSwitchsizemd"></label>
            </div>
          </div>

          <!-- Change language -->
          <div class="dropdown ms-1 topbar-head-dropdown header-item">
            <button type="button" class="btn btn-icon btn-topbar btn-ghost-secondary rounded-circle"
              data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              <img id="header-lang-img" src="@/assets/images/flags/jp.svg" alt="Header Language" height="20"
                class="rounded" />
            </button>
          </div>

          <!-- Click full screen -->
          <div class="ms-1 header-item d-none d-sm-flex">
            <button type="button" class="btn btn-icon btn-topbar btn-ghost-secondary rounded-circle"
              data-toggle="fullscreen" @click="initFullScreen">
              <i class="bx bx-fullscreen fs-22"></i>
            </button>
          </div>

          <!-- Change dark/light mode -->
          <div class="ms-1 header-item d-none d-sm-flex">
            <button type="button" class=" btn btn-icon btn-topbar btn-ghost-secondary rounded-circle light-dark-mode"
              @click="toggleDarkMode">
              <i class="bx bx-moon fs-22"></i>
            </button>
          </div>
          
          <!-- Notifications -->
          <div class="dropdown topbar-head-dropdown ms-1 header-item">
            <button type="button" class="btn btn-icon btn-topbar btn-ghost-secondary rounded-circle"
              id="page-header-notifications-dropdown" data-bs-toggle="dropdown" aria-haspopup="true"
              aria-expanded="false">
              <i class="bx bx-bell fs-22"></i>
            </button>
          </div>

          <div class="dropdown ms-sm-3 header-item topbar-user">
            <button type="button" class="btn" id="page-header-user-dropdown" data-bs-toggle="dropdown"
              aria-haspopup="true" aria-expanded="false">
              <span v-if="currentUser" class="d-flex align-items-center">
                <img class="rounded-circle header-profile-user" :src="getUserAvatar()"
                  alt="Header Avatar" />
                <span class="text-start ms-xl-2">
                  <span class=" d-none d-xl-inline-block ms-1 fw-medium user-name-text">
                    {{ currentUser.name }}
                  </span>
                  <!-- <span class="d-none d-xl-block ms-1 fs-12 text-muted user-name-sub-text">Founder</span> -->
                </span>
              </span>
            </button>
            <div class="dropdown-menu dropdown-menu-end">
              <!-- item-->
              <router-link class="dropdown-item" :to="{ name: 'profile' }"><i
                  class="mdi mdi-account-circle text-muted fs-16 align-middle me-1"></i>
                <span class="align-middle">Profile</span>
              </router-link>
              <div class="dropdown-divider"></div>
              <router-link v-if="!isAdmin" class="dropdown-item" :to="{ name: getRouteName() }">
                <i class="mdi mdi-cog-outline text-muted fs-16 align-middle me-1"></i>
                <span class="align-middle">Setting</span>
              </router-link>
              <router-link class="dropdown-item" :to="{ name: 'logout' }"><i
                  class="mdi mdi-logout text-muted fs-16 align-middle me-1"></i>
                <span class="align-middle" data-key="t-logout">Logout</span></router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<style lang="scss" scope>
  .navbar-facility-name {
    background-color: #f3f3f9;
    font-size: 20px;
    color: #495057;
    font-weight: bold;
    width: 550px;
    text-align: center;
  }
</style>
