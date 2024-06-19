import router from "@/router";
import { useLoginUserStore } from "@/store/userStore";
import checkAccess from "@/access/checkAccess";
import ACCESS_ENUM from "@/access/accessEnum";

/**
 * 登录+权限检查守卫
 * */
router.beforeEach(async (to, from, next) => {
  // 放开主页，大家都可以访问，除主页以外都需要权限
  if (to.path === "/") {
    return true;
  }
  const loginUserStore = useLoginUserStore();
  let loginUser = loginUserStore.loginUser;

  // 重新上线时，发送cookie，先获取登录信息
  if (!loginUser || !loginUser.userRole) {
    await loginUserStore.fetchLoginUser();
    loginUser = loginUserStore.loginUser;
  }
  // 检查用户是否已登录,避免无限重定向
  if (!loginUserStore.loginUser.id && !to.path.startsWith("/user")) {
    // 将用户重定向到登录页面
    return { path: "/user/login" };
  }

  const needAccess = (to.meta?.access as string) ?? ACCESS_ENUM.NOT_LOGIN;
  if (needAccess !== ACCESS_ENUM.NOT_LOGIN) {
    if (
      !loginUser ||
      !loginUser.userRole ||
      loginUser.userRole === ACCESS_ENUM.NOT_LOGIN
    ) {
      next(`/user/login?redirect=${to.fullPath}`);
    }
    // 此时应该不存在 NOT_LOGIN 的用户，可以优化
    if (!checkAccess(loginUser, needAccess)) {
      next("/noAuth");
      return;
    }
  }
  // 不需要权限也可以访问
  next();
});
