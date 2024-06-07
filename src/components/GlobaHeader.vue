<template>
  <a-row id="globaHeader" align="center" :wrap="false">
    <a-col flex="auto">
      <a-menu
        mode="horizontal"
        :default-selected-keys="selectKey"
        @menu-item-click="doMenuClick"
      >
        <a-menu-item
          key="0"
          :style="{ padding: 0, marginRight: '38px' }"
          disabled
        >
          <div class="titleBar">
            <img src="../assets/logo.png" id="logo" />
            <div class="title">答案说明所有</div>
          </div>
        </a-menu-item>
        <a-menu-item v-for="item in visibleRoutes" :key="item.path">
          {{ item.name }}
        </a-menu-item>
      </a-menu>
    </a-col>
    <a-col flex="100px">
      <div v-if="loginUserStore.loginUser.id">
        {{ loginUserStore.loginUser.userName ?? "无名" }}
      </div>
      <div v-else>
        <a-button type="primary" href="/user/login">登录</a-button>
      </div>
    </a-col>
  </a-row>
</template>

<script setup lang="ts">
import routes from "@/router/routes";
import { useRouter } from "vue-router";
import { computed, ref } from "vue";
import { useLoginUserStore } from "@/store/userStore";
import checkAccess from "@/access/checkAccess";

const router = useRouter();
const loginUserStore = useLoginUserStore();
// 当前选中的菜单项
const selectKey = ref(["/"]);
// 路由跳转时，自动更新选项中的菜单项（路由守卫）
router.afterEach((to, from, failure) => {
  selectKey.value = [to.path];
});

// 普通变量不会触发菜单栏的刷新，计算属性可以。虚拟dom
const visibleRoutes = computed(() => {
  return routes.filter((item) => {
    if (item.meta?.hideInMenu) {
      return false;
    }
    if (!checkAccess(loginUserStore.loginUser, item.meta?.access as string)) {
      return false;
    }
    return true;
  });
});

// 点击跳转
const doMenuClick = (key: string) => {
  router.push({
    path: key,
  });
};
</script>

<style scoped>
#globaHeader {
}

#globaHeader .titleBar {
  display: flex;
  align-items: center;
}

#globaHeader .titleBar #logo {
  width: 28px;
  height: 28px;
}

#globaHeader .title {
  margin-left: 16px;
  color: black;
}
</style>
