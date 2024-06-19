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
            <img src="@/assets/dada.png" id="logo" />
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
        <a-popover position="br">
          <a-avatar style="float: right; margin-right: 20px">
            <img
              alt="图片加载失败"
              src="https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/3ee5f13fb09879ecb5185e440cef6eb9.png~tplv-uwbnlip3yd-webp.webp"
            />
          </a-avatar>
          <template #content>
            <a-list :hoverable="true">
              <a-list-item>
                <icon-user />
                个人账户
              </a-list-item>
              <a-list-item>
                <icon-notification />
                我的消息
              </a-list-item>
              <a-list-item @click="doLoginOut" style="color: red">
                <icon-export />
                退出登录
              </a-list-item>
            </a-list>
          </template>
        </a-popover>
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
/**
 * 退出登录
 * */
const doLoginOut = async () => {
  await loginUserStore.QuitLogin();
  router.push({
    path: "/",
    replace: true, // 替换当前页。没必要点击后，又回到登录页
  });
};

// 菜单跳转
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