<template>
  <div id="addScoringResultPage">
    <h2>设置评分</h2>
    <a-form
      :model="form"
      :style="{ width: '480px', margin: '0 auto' }"
      label-align="left"
      auto-label-width
      @submit="handleSubmit"
    >
      <a-form-item
        field="resultName"
        tooltip="Please enter resultName"
        label="评分结果名称"
      >
        <a-input
          v-model="form.resultName"
          placeholder="请输入评分结果名"
        />
      </a-form-item>
      <a-form-item v-if="updateId" field="updateId" label="修改评分id">
        {{ updateId }}
      </a-form-item>
      <a-form-item field="resultDesc" label="评分结果描述">
        <a-input
          v-model="form.resultDesc"
          placeholder="请输入评分描述"
        />
      </a-form-item>
      <a-form-item field="resultPicture" label="评分结果图标">
        <a-input
          v-model="form.resultPicture"
          placeholder="待修改为上传"
        />
      </a-form-item>
      <a-form-item field="scoringResultType" label="结果集">
        <a-input-tag
          v-model="form.resultProp"
          :default-value="['test']"
          :style="{ width: '320px' }"
          placeholder="结果属性集"
          allow-clear
        />
      </a-form-item>
      <a-form-item field="scoringStrategy" label="评分范围">
        <a-input-number
          v-model="form.resultScoreRange"
          placeholder="请输入评分范围"
        />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit" style="width: 120px"
          >提交
        </a-button>
      </a-form-item>
    </a-form>
    <h2>评分管理</h2>
    <ScoringResultTable :app-id="appId" :doUpdate="doUpdate" :ref="tableRef" />
  </div>
</template>

<script setup lang="ts">
import { defineProps, ref, withDefaults } from "vue";
import API from "@/api";
import message from "@arco-design/web-vue/es/message";
import { useRouter } from "vue-router";
import {
  addScoringResultUsingPost,
  editScoringResultUsingPost,
} from "@/api/scoringResultController";
import ScoringResultTable from "@/views/add/componenents/ScoringResultTable.vue";

const router = useRouter();
// 表单数据
const form = ref({
  resultName: "",
  resultDesc: "",
  resultPicture: "",
  resultProp: [],
  resultScoreRange: 0,
} as API.ScoringResultAddRequest);
// 接收父组件应用id数据
interface Props {
  appId: number;
}
const props = withDefaults(defineProps<Props>(), {
  appId: () => 0,
});
const tableRef = ref();
// 待修改的评分id
const updateId = ref<any>();
/**
 * 修改评分方法
 * */
const doUpdate = (scoringResult: API.ScoringResultVO) => {
  updateId.value = scoringResult.id;
  form.value = scoringResult;
};
/**
 * 创建/修改评分，提交
 * */
const handleSubmit = async () => {
  if (!props.appId) {
    return;
  }
  let res: any;
  if (updateId) {
    res = await editScoringResultUsingPost({
      id: updateId.value,
      ...form.value,
    });
    updateId.value = 0; // 复原
  } else {
    res = await addScoringResultUsingPost({
      appId: props.appId,
      ...form.value,
    });
  }
  if (res.data.code === 0) {
    message.success("操作成功，即将跳转到应用详情页");
  } else {
    message.error("操作失败，" + res.data.message);
  }
};
</script>