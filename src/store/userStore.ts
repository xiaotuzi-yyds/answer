import { defineStore } from "pinia";
import { ref } from "vue";
import {
  getLoginUserUsingGet,
  userLogoutUsingPost,
} from "@/api/userController";
import ACCESS_ENUM from "@/access/accessEnum";
import message from "@arco-design/web-vue/es/message";

/**
 * 登录用户信息全局状态
 * */
export const useLoginUserStore = defineStore("counter", () => {
  const initUserInfo = {
    userName: "未登录",
  };
  const loginUser = ref<API.LoginUserVO>({
    ...initUserInfo,
  });

  function setLoginUser(newLoginUser: API.LoginUserVO) {
    loginUser.value = newLoginUser;
  }

  async function fetchLoginUser() {
    const res = await getLoginUserUsingGet();
    if (res.data.code === 0 && res.data.data) {
      loginUser.value = res.data.data;
    } else {
      message.error("获取登录信息失败, " + res.data.message);
    }
  }

  async function QuitLogin() {
    const res = await userLogoutUsingPost();
    if (res.data.code === 0) {
      loginUser.value = initUserInfo;
      message.success("退出登录成功!");
    } else {
      message.error("退出登录失败, " + res.data.message);
    }
  }

  return { loginUser, setLoginUser, fetchLoginUser, QuitLogin };
});
