<template>
  <div id="addAppPage">
    <h2>创建应用</h2>
    <a-form
      :model="form"
      :style="{ width: '480px', margin: '0 auto' }"
      label-align="left"
      auto-label-width
      @submit="handleSubmit"
    >
      <a-form-item
        field="appName"
        tooltip="Please enter appName"
        label="应用名称"
      >
        <a-input
          v-model="form.appName"
          placeholder="请输入应用名"
        />
      </a-form-item>
      <a-form-item field="appDesc" label="应用描述">
        <a-input
          v-model="form.appDesc"
          placeholder="请输入应用描述."
        />
      </a-form-item>
      <a-form-item field="appIcon" label="应用图标">
        <a-input
          v-model="form.appIcon"
          placeholder="待修改为上传图片"
        />
      </a-form-item>
      <!-- 有对象存储时使用
        <a-form-item field="appIcon" label="应用图标">
          <PictureUploader
            :value="form.appIcon"
            :onchange="(value) => (form.appIcon = value)"
          />
        </a-form-item>-->
      <a-form-item field="appType" label="应用类型">
        <a-select
          v-model="form.appType"
          :style="{ width: '320px' }"
          placeholder="请选择应用类型"
        >
          <a-option
            v-for="(value, key) of APP_TYPE_MAP"
            :value="Number(key)"
            :label="value"
          />
        </a-select>
      </a-form-item>
      <a-form-item field="scoringStrategy" label="评分策略">
        <a-select
          v-model="form.scoringStrategy"
          :style="{ width: '320px' }"
          placeholder="请选择评分策略"
        >
          <a-option
            v-for="(value, key) of SCORING_RESULT_MAP"
            :value="Number(key)"
            :label="value"
          />
        </a-select>
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit" style="width: 120px"
          >提交
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { defineProps, ref, watchEffect, withDefaults } from "vue";
import API from "@/api";
import message from "@arco-design/web-vue/es/message";
import { useRouter } from "vue-router";
import {
  addAppUsingPost,
  editAppUsingPost,
  getAppVoByIdUsingGet,
} from "@/api/appController";
import { APP_TYPE_MAP, SCORING_RESULT_MAP } from "@/constant/app";

const router = useRouter();
const form = ref({
  appDesc: "",
  appIcon: "",
  appName: "",
  appType: 0,
  scoringStrategy: 0,
} as API.AppAddRequest);
// 接收父组件要修改应用的id
interface Props {
  id: number;
}
const props = withDefaults(defineProps<Props>(), {
  id: () => 0,
});
// 避免刷新时都是数据
const oldApp = ref<API.AppVO>({});

/**
 * 创建/修改应用提交
 * */
const handleSubmit = async () => {
  let res: any;
  // 判断修改，新建
  if (props.id) {
    res = await editAppUsingPost({
      id: props.id,
      ...form.value,
    });
  } else {
    res = await addAppUsingPost(form.value);
  }
  if (res.data.code === 0) {
    message.success("应用创建成功，即将跳转到应用详情页");
    setTimeout(() => {
      router.push({
        // ?? 识别空串为true，||识别空串为false
        path: `/app/detail/${props.id || res.data.data}`,
      });
    }, 3000);
  } else {
    message.error("操作失败，" + res.data.message);
  }
};
/**
 * 加载数据
 * */
const loadData = async () => {
  // 修改则不用再重复查找数据
  if (!props.id) {
    return;
  }
  const res = await getAppVoByIdUsingGet({ id: props.id });
  if (res.data.code === 0 && res.data.data) {
    oldApp.value = res.data.data;
    form.value = res.data.data;
  } else {
    message.error("获取数据失败，" + res.data.message);
  }
};
/**
 * 监听searcher变量，改变时触发数据重新加载
 * */
watchEffect(() => {
  loadData();
});
</script>
