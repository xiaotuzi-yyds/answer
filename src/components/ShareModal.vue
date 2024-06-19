<template>
  <a-modal v-model:visible="visible" @cancel="closeModal" :footer="false">
    <template #title>分享</template>
    <h4 style="margin-top: 0">复制分享连接</h4>
    <a-typography-paragraph copyable>{{ link }}</a-typography-paragraph>
    <h4 style="margin-top: 0">手机扫码查看</h4>
    <img :src="codeImg" />
  </a-modal>
</template>

<script setup lang="ts">
import { defineExpose, defineProps, ref, withDefaults } from "vue";
// @ts-ignore
import QRCode from "qrcode";
import message from "@arco-design/web-vue/es/message";

interface Props {
  link: string; // 链接
  title: string; // 标题
}

const props = withDefaults(defineProps<Props>(), {
  link: () => "https://www.laoyujianli.com/", // 默认链接+标题
  title: () => "分享",
});
// 二维码图片
const codeImg = ref();
// 是否可见
const visible = ref(false);

/**
 * 打开弹窗方法
 * */
const openModal = () => {
  visible.value = true;
};
/**
 * 关闭弹窗方法
 * */
const closeModal = () => {
  visible.value = false;
};
// 暴露打开弹框方法
defineExpose({
  openModal,
});
// 生成二维码
QRCode.toDataURL(props.link)
  .then((url: string) => {
    codeImg.value = url;
  })
  .catch((err: any) => {
    message.error("生成二维码失败, " + err.message);
  });
</script>
