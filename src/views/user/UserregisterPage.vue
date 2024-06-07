<template>
  <div id="userRegister">
    <h2>用户注册</h2>
    <a-form
      :model="form"
      :style="{ width: '480px', margin: '0 auto' }"
      label-align="left"
      auto-label-width
      @submit="handleSubmit"
    >
      <a-form-item
        field="userAccount"
        tooltip="Please enter userAccount"
        label="账号"
      >
        <a-input
          v-model="form.userAccount"
          placeholder="please enter your userAccount..."
        />
      </a-form-item>
      <a-form-item field="userPassword" tooltip="密码不小于8位" label="密码">
        <a-input
          v-model="form.userPassword"
          placeholder="please enter your password..."
        />
      </a-form-item>
      <a-form-item
        field="checkPassword"
        tooltip="两次密码要一致"
        label="确认密码"
      >
        <a-input
          v-model="form.checkPassword"
          placeholder="please true your password..."
        />
        <!--        <template #extra>
                  <div>{{form.equal(form.userPassword)}}</div>
                </template>-->
      </a-form-item>
      <a-form-item>
        <div
          style="
            display: flex;
            width: 100%;
            align-items: center;
            justify-content: space-between;
          "
        >
          <a-button type="primary" html-type="submit" style="width: 120px"
            >注册
          </a-button>
          <!-- todo 想想办法让页面不要刷新-->
          <a-link href="/user/register">登录</a-link>
        </div>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import API from "@/api";
import { userRegisterUsingPost } from "@/api/userController";
import message from "@arco-design/web-vue/es/message";
import { useRouter } from "vue-router";

const router = useRouter();
const form = reactive({
  userAccount: "",
  userPassword: "",
  checkPassword: "",
} as API.UserRegisterRequest);

/**
 * 登录提交
 * */
const handleSubmit = async () => {
  console.log(form);
  const res = await userRegisterUsingPost(form);
  if (res.data.code === 0) {
    message.success("登录成功");
    router.push({
      path: "/user/login",
      replace: true, // 替换当前页。没必要点击后，又回到登录页
    });
  } else {
    message.error(res.data.message ?? "未知错误");
  }
};
</script>
