<template>
  <div id="homePage">
    <div style="display: flex; justify-content: center">
      <a-input-search
        class="searchBar"
        :style="{ width: '320px' }"
        placeholder="快速发现答题应用"
        button-text="搜索"
        size="large"
        search-button
        @search="onSearch"
      />
    </div>
    <a-list
      class="list-demo-action-layout"
      :grid-props="{ gutter: [20, 20], sm: 24, md: 12, lg: 8, xl: 6 }"
      :bordered="false"
      :data="dataList"
      :pagination-props="{
        pageSize: searchParams.pageSize,
        current: searchParams.current,
        total,
      }"
      @page-change="pageChange"
    >
      <template #item="{ item }">
        <AppCard :app="item" />
      </template>
    </a-list>
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect } from "vue";
import API from "@/api";
import AppCard from "@/components/AppCard.vue";
import { listAppVoByPageUsingPost } from "@/api/appController";
import message from "@arco-design/web-vue/es/message";

// 默认分页值
const initSearcherParams = {
  current: 1,
  pageSize: 12,
};
const searchParams = ref<API.AppQueryRequest>({
  ...initSearcherParams,
});
// 数据列表+数据总数
const dataList = ref<API.AppVO[]>([]);
const total = ref<number>(0);

/**
 * 分页跳转
 * */
const onSearch = async (v: string, e: MouseEvent) => {
  if (!v) {
    await loadData();
  }
  const res = await listAppVoByPageUsingPost({
    ...searchParams.value,
    searchText: v,
  });
  if (res.data.code === 0 && res.data.data) {
    dataList.value = res.data.data?.records || [];
    total.value = res.data.data?.total || 0;
  } else {
    message.error("获取数据失败，" + res.data.message);
  }
};
/**
 * 加载数据
 * */
const loadData = async () => {
  const res = await listAppVoByPageUsingPost(searchParams.value);
  console.log(res);
  if (res.data.code === 0) {
    dataList.value = res.data.data?.records || [];
    total.value = res.data.data?.total || 0;
  } else {
    message.error("获取数据失败，" + res.data.message);
  }
};
/**
 * 分页跳转
 * */
const pageChange = (page: number) => {
  searchParams.value = {
    ...searchParams.value,
    current: page,
  };
};
/**
 * 监听searcher变量，改变时触发数据重新加载
 * */
watchEffect(() => {
  loadData();
});
</script>

<style scoped>
.searchBar {
  margin-bottom: 28px;
}
</style>
