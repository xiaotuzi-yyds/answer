<template>
  <div id="app">
    <!--用户布局-->
    <template v-if="route.path.startsWith('/user')">
      <router-view />
    </template>
    <!--功能布局-->
    <template v-else>
      <BasicLayout />
    </template>
  </div>
</template>

<script setup lang="ts">
import BasicLayout from "@/layouts/BasicLayout.vue";
import { useRoute } from "vue-router";
import { onMounted } from "vue";

const route = useRoute();

/**
 * 初始化配置
 * */
const doInit = () => {
  console.log("Hello world");
};
onMounted(() => {
  doInit();
});
</script>

<style scoped></style>
