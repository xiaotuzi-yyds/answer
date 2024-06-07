<template>
  <div id="basicLayout">
    <a-layout style="height: 100vh">
      <a-layout-header class="header">
        <GlobaHeader />
      </a-layout-header>
      <a-layout-content class="center">
        <router-view />
      </a-layout-content>
      <a-layout-footer class="footer">
        <a href="https://gitee.com/zxy520666" target="_blank"> 落花 </a>
      </a-layout-footer>
    </a-layout>
  </div>
</template>

<script setup lang="ts">
import GlobaHeader from "@/components/GlobaHeader.vue";
</script>

<style scoped>
#basicLayout .header {
  margin-bottom: 16px;
  box-shadow: #eee 1px 1px 5px;
}

#basicLayout .center {
  margin-bottom: 28px;
  padding: 24px;
  background: linear-gradient(to right, #fefefe, #fff);
}

#basicLayout .footer {
  padding: 16px;
  text-align: center;
  background: pink;
}
</style>
