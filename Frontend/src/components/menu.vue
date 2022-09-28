<script>
import {
  layoutComputed
} from "@/state/helpers";
import { mapGetters } from "vuex";
import { ROLES } from "@/constants";

export default {
  components: {
  },
  data() {
    return {
      settings: {
        minScrollbarLength: 60,
      },
      collapse: true
    };
  },
  computed: {
    ...layoutComputed,
    layoutType: {
      get() {
        return this.$store ? this.$store.state.layout.layoutType : {} || {};
      },
    },
    roles() {
      return ROLES;
    },
    ...mapGetters('auth', ['currentUser']),
    getInfoClass() {
      const { name } = this.$route;
      if(!this.collapse && name === 'facility-info-management') {
        return 'router-link-active router-link-extract-active active'
      }
    },
    getClass() {
      const { name } = this.$route;
      if (!this.collapse && (name === 'user-management-by-admin' || name === 'admin-create-user' || name === 'admin-update-user' ||
      name === 'accounts' || name === 'create-account' || name === 'edit-account')) {
        return 'router-link-active router-link-extract-active active'
      }

      return ''
    },
    getCollapseClass() {
      return this.collapse ? '' : 'show'
    },
    getDashboardClass() {
      return this.$route.name === 'default' ? 'router-link-active router-link-extract-active active': ''
    }
  },

  watch: {
    $route: {
      handler: "onRoutechange",
      immediate: true,
      deep: true,
    },
  },

  mounted() {
    if (document.querySelectorAll(".navbar-nav .collapse")) {
      let collapses = document.querySelectorAll(".navbar-nav .collapse");
      collapses.forEach((collapse) => {
        // Hide sibling collapses on `show.bs.collapse`
        collapse.addEventListener("show.bs.collapse", (e) => {
          e.stopPropagation();
          let closestCollapse = collapse.parentElement.closest(".collapse");
          if (closestCollapse) {
            let siblingCollapses =
              closestCollapse.querySelectorAll(".collapse");
            siblingCollapses.forEach((siblingCollapse) => {
              if (siblingCollapse.classList.contains("show")) {
                let aChild = siblingCollapse.parentNode.firstChild;
                if (aChild.hasAttribute("aria-expanded")) {
                  aChild.setAttribute("aria-expanded", "false");
                }
                siblingCollapse.classList.remove("show");
              }
            });
          } else {
            let getSiblings = (elem) => {
              // Setup siblings array and get the first sibling
              let siblings = [];
              let sibling = elem.parentNode.firstChild;
              // Loop through each sibling and push to the array
              while (sibling) {
                if (sibling.nodeType === 1 && sibling !== elem) {
                  siblings.push(sibling);
                }
                sibling = sibling.nextSibling;
              }
              return siblings;
            };
            let siblings = getSiblings(collapse.parentElement);
            siblings.forEach((item) => {
              if (item.childNodes.length > 2)
                item.firstElementChild.setAttribute("aria-expanded", "false");
              let ids = item.querySelectorAll("*[id]");
              ids.forEach((item1) => {
                let aChild = item1.parentNode.firstChild;
                if (aChild.hasAttribute("aria-expanded")) {
                  aChild.setAttribute("aria-expanded", "false");
                }
                item1.classList.remove("show");
                if (item1.childNodes.length > 2) {
                  let val = item1.querySelectorAll("ul li a");

                  val.forEach((subitem) => {
                    if (subitem.hasAttribute("aria-expanded"))
                      subitem.setAttribute("aria-expanded", "false");
                  });
                }
              });
            });
          }
        });

        // Hide nested collapses on `hide.bs.collapse`
        collapse.addEventListener("hide.bs.collapse", (e) => {
          e.stopPropagation();
          let childCollapses = collapse.querySelectorAll(".collapse");
          childCollapses.forEach((childCollapse) => {
            let childCollapseInstance = childCollapse;
            childCollapseInstance.hide();
          });
        });
      });
    }
  },

  methods: {
    onRoutechange(route) {
      if (route.name === 'user-management-by-admin' || route.name === 'admin-create-user' || route.name === 'admin-update-user' ||
        route.name === 'facility-info-management' || route.name === 'accounts' || route.name === 'create-account' || route.name === 'edit-account'
      ) {
        this.collapse = false
      } else {
        this.collapse = true
      }
      //this.initActiveMenu(route.path);
    },

    initActiveMenu(ele) {
      setTimeout(() => {
        if (document.querySelector("#navbar-nav")) {
          let a = document.querySelector("#navbar-nav").querySelector('[href="' + ele + '"]');

          if (a) {
            a.classList.add("active");
            let parentCollapseDiv = a.closest(".collapse.menu-dropdown");
            if (parentCollapseDiv) {
              parentCollapseDiv.classList.add("show");
              parentCollapseDiv.parentElement.children[0].classList.add("active");
              parentCollapseDiv.parentElement.children[0].setAttribute("aria-expanded", "true");
              if (parentCollapseDiv.parentElement.closest(".collapse.menu-dropdown")) {
                parentCollapseDiv.parentElement.closest(".collapse").classList.add("show");
                if (parentCollapseDiv.parentElement.closest(".collapse").previousElementSibling)
                  parentCollapseDiv.parentElement.closest(".collapse").previousElementSibling.classList.add(
                    "active");
              }
            }
          }
        }
      }, 0);
    },
    getRouteName(currentUser) {
      // check role -> get route name
      // if(currentUser.role === ROLES.FACILITY_MANAGER) {
      //   return 'facility-manager-user-list'
      // }

      if (currentUser.role === ROLES.FACILITY_MANAGER || currentUser.role === ROLES.FACILITY_ACCOUNT) {
        return 'accounts'
      }

      return 'user-management-by-admin'
    },
  },
};
</script>

<template>
  <div class="container-fluid">
    <div id="two-column-menu"></div>

    <ul v-if="currentUser.role == roles.ADMIN" class="navbar-nav h-100" id="navbar-nav">
      <li class="menu-title">
        <span data-key="t-menu"> {{ $t("t-menu") }}</span>
      </li>

      <!-- setting menu-->
      <li class="nav-item">
        <a @click="collapse = !collapse" class="nav-link menu-link" href="#sidebarSetting" data-bs-toggle="collapse"
          role="button" aria-controls="sidebarSetting" :aria-expanded="!collapse">
          <i class="bx bx-cog"></i>
          <span data-key="t-setting"> {{ $t("t-setting") }}</span>
        </a>
        <div :class="getCollapseClass" class="collapse menu-dropdown" id="sidebarSetting">
          <ul class="nav nav-sm flex-column">
            <li class="nav-item">
              <router-link :class="getClass" :to="{ name: getRouteName(currentUser) }" class="nav-link"
                data-key="t-user-management">
                {{ $t("User Management") }}
              </router-link>
            </li>
          </ul>
        </div>
      </li>

    </ul>

    <ul v-else class="navbar-nav h-100" id="navbar-nav">
      <li class="menu-title">
        <span data-key="t-menu"> {{ $t("t-menu") }}</span>
      </li>
      <li class="nav-item">
        <router-link :class="getDashboardClass" class="nav-link menu-link" :to="{ name: 'default' }">
          <i class="bx bxs-dashboard"></i>
          <span data-key="t-dashboards"> {{ $t("t-dashboards") }}</span>
        </router-link>
      </li>
      <!-- end Dashboard Menu -->

      <!-- setting menu-->
      <li class="nav-item">
        <a @click="collapse = !collapse" class="nav-link menu-link" href="#sidebarSetting" data-bs-toggle="collapse"
          role="button" aria-controls="sidebarSetting" :aria-expanded="!collapse">
          <i class="bx bx-cog"></i>
          <span data-key="t-setting"> {{ $t("t-setting") }}</span>
        </a>
        <div :class="getCollapseClass" class="collapse menu-dropdown" id="sidebarSetting">
          <ul class="nav nav-sm flex-column">
            <li class="nav-item">
              <router-link :class="getInfoClass" to="/admin/setting/facility-info-management" class="nav-link custom-abc"
                data-key="t-facility-info-management">
                {{ $t("t-facility-info-management") }}
              </router-link>
            </li>
            <li class="nav-item">
              <router-link :class="getClass" :to="{ name: getRouteName(currentUser) }" class="nav-link"
                data-key="t-user-management">
                {{ $t("t-user-management") }}
              </router-link>
            </li>
          </ul>
        </div>
      </li>

    </ul>
  </div>
  <!-- Sidebar -->
</template>
