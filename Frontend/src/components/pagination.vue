<template>
  <div class="pagination-wrap hstack gap-2" v-if="pagination.totalPage > 1">
    <a class="page-item pagination-prev" href="javascript:void(0)" v-if="pagination.currentPage != 1" @click="onPreviousPage()">
      <i class="bx bx-chevrons-left"></i>
    </a>
    <ul class="pagination listjs-pagination mb-0">

      <template v-for="(pageNumber, index) in pages" >
        <li
          :key="index"
          @click="onChangePage(pageNumber)"
          :class="{
            'active': pageNumber == pagination.currentPage,
          }"
          v-if="
            pageNumber == 1
            || pageNumber == pagination.totalPage
            || pageNumber < 5 && pagination.currentPage < 3
            || (pagination.currentPage >= 3 && (pageNumber === pagination.currentPage || pageNumber === pagination.currentPage - 1 || pageNumber === pagination.currentPage + 1))
            || (pagination.currentPage === pagination.totalPage - 1 && pageNumber === pagination.currentPage - 2)
            || (pagination.currentPage === pagination.totalPage && pageNumber >= pagination.currentPage - 3)
          "
        >
          <a href="javascript:void(0)" class="page">
            <span v-if="
              pageNumber == pagination.totalPage && pagination.currentPage < pagination.totalPage - 2 && pagination.totalPage > 5
            ">
              ...
            </span>
            <span>
              {{ pageNumber }}
            </span>
            <span v-if="
              pageNumber == 1 && pagination.currentPage > 3 && pagination.totalPage > 5
            ">
              ...
            </span>
          </a>
        </li>
      </template>
      
    </ul>
    <a class="page-item pagination-next" href="javascript:void(0)" @click="onNextPage" v-if="pagination.currentPage < pagination.totalPage">
      <i class="bx bx-chevrons-right"></i>
    </a>
  </div>
</template>

<script setup>
import { computed, toRefs, defineProps, defineEmits, watch, reactive, ref } from 'vue'

const emit = defineEmits(["onChangePage"])

const props = defineProps({
  pagination: { type: Object, required: true },
});

const pagination = reactive({
  currentPage: 1,
});

pagination.currentPage = toRefs(props).pagination.value.currentPage;
pagination.totalPage = toRefs(props).pagination.value.totalPage;

let pages = computed(() => Array.from({length: pagination.totalPage}, (_, i) => i + 1));

watch(() => props.pagination, (selection) => {
  pagination.currentPage = selection.currentPage;
  pagination.totalPage = selection.totalPage;
})


const onPreviousPage = () => {
  if (pagination.currentPage > 1) {
    let pageNumber = pagination.currentPage - 1;
    onChangePage(pageNumber);
  }
}

const onNextPage = () => {
  if (pagination.currentPage < pagination.totalPage) {
    let pageNumber = pagination.currentPage + 1;
    onChangePage(pageNumber);
  }
}

const onChangePage = (pageNumber) => {
  emit("onChangePage", pageNumber);
}

</script>

<style lang="scss">
  .pagination-wrap {
    a.first::after {
      content:'...'
    }

    a.last::before {
      content:'...'
    }
  }
</style>