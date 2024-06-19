<template>
  <div id="userLayout">
    <a-layout style="height: 100vh">
      <a-layout-header class="header">
        <a-space>
          <img class="logo" src="../assets/logo.png" />
          <div>答案说明所有，但我不信</div>
        </a-space>
      </a-layout-header>
      <a-layout-content class="center">
        <router-view />
      </a-layout-content>
      <a-layout-footer class="footer">
        <a href="https://gitee.com/zxyyyds666" target="_blank"> 落花 </a>
      </a-layout-footer>
    </a-layout>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
#userLayout {
  text-align: center;
  //background: url("");
}

#userLayout .logo {
  width: 48px;
  height: 48px;
}

#userLayout .header {
  margin-bottom: 16px;
  font-size: 21px;
}

#userLayout .center {
  margin-bottom: 16px;
  padding: 20px;
  background: linear-gradient(to right, #fefefe, #fff);
}

#userLayout .footer {
  padding: 16px;
  text-align: center;
  background: pink;
}
</style>
