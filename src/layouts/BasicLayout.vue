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
        <a href="https://gitee.com/zxyyyds666" target="_blank">@落花</a>
      </a-layout-footer>
    </a-layout>
  </div>
</template>

<script setup lang="ts">
import GlobaHeader from "@/components/GlobaHeader.vue";
</script>

<style scoped>
#basicLayout {
}

#basicLayout .header {
  margin-bottom: 16px;
  box-shadow: #eee 1px 1px 5px;
}

#basicLayout .center {
  box-sizing: border-box;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto 28px;
  padding: 24px;
  background: linear-gradient(to right, #fefefe, #fff);
}

#basicLayout .footer {
  padding: 16px;
  text-align: center;
  background: #f2f2f2;
}
</style>
