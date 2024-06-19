<template>
  <a-form
    :model="formSearchParams"
    :style="{ marginBottom: '20px' }"
    label-align="left"
    layout="inline"
    auto-label-width
    @submit="doSearch"
  >
    <a-form-item field="appId" tooltip="Please enter appId" label="应用id">
      <a-input
        allow-clear
        v-model="formSearchParams.appId"
        placeholder="请输入应用id"
      />
    </a-form-item>
    <a-form-item
      field="resultName"
      tooltip="Please enter resultName"
      label="结果名称"
    >
      <a-input
        allow-clear
        v-model="formSearchParams.resultName"
        placeholder="请输入答案标题"
      />
    </a-form-item>
    <a-form-item
      field="resultDesc"
      tooltip="Please enter resultDesc"
      label="结果描述"
    >
      <a-input
        allow-clear
        v-model="formSearchParams.resultDesc"
        placeholder="请输入答案描述"
      />
    </a-form-item>
    <a-form-item field="userId" tooltip="Please enter userId" label="用户id">
      <a-input
        allow-clear
        v-model="formSearchParams.userId"
        placeholder="请输入用户id"
      />
    </a-form-item>
    <a-form-item>
      <a-button type="primary" html-type="submit" style="width: 100px"
        >搜索
      </a-button>
    </a-form-item>
  </a-form>
  <a-table
    :columns="columns"
    :data="dataList"
    :pagination="{
      showTotal: true,
      pageSize: searchParams.pageSize,
      current: searchParams.current,
      total,
    }"
    @page-change="pageChange"
  >
    <template #resultPicture="{ record }">
      <a-image width="64" :src="record.resultPicture" />
    </template>
    <template #appType="{ record }">
      {{ APP_TYPE_MAP[record.appType] }}
    </template>
    <template #scoringStrategy="{ record }">
      {{ SCORING_RESULT_MAP[record.scoringStrategy] }}
    </template>
    <template #createTime="{ record }">
      {{ dayjs(record.createTime).format("YYYY-MM-DD") }}
    </template>
    <template #updateTime="{ record }">
      {{ dayjs(record.updateTime).format("YYYY-MM-DD") }}
    </template>
    <template #optional="{ record }">
      <a-button status="danger" @click="doDelete(record)">删除</a-button>
    </template>
  </a-table>
</template>

<script setup lang="ts">
import { ref, watchEffect } from "vue";
import message from "@arco-design/web-vue/es/message";
import API from "@/api";
import { dayjs } from "@arco-design/web-vue/es/_utils/date";
import {
  deleteUserAnswerUsingPost,
  listUserAnswerByPageUsingPost,
} from "@/api/userAnswerController";
import { APP_TYPE_MAP, SCORING_RESULT_MAP } from "@/constant/app";

const columns = [
  {
    title: "ID",
    dataIndex: "id",
    ellipsis: true,
    tooltip: { position: "left" },
    width: 50,
  },
  {
    title: "应用 ID",
    dataIndex: "appId",
    ellipsis: true,
    tooltip: { position: "left" },
    width: 80,
  },
  {
    title: "应用类型",
    dataIndex: "appType",
    slotName: "appType",
    width: 100,
  },
  {
    title: "评分策略",
    dataIndex: "scoringStrategy",
    slotName: "scoringStrategy",
  },
  {
    title: "用户答案",
    dataIndex: "choices",
    ellipsis: true,
    tooltip: { position: "left" },
    width: 100,
  },
  {
    title: "评分结果 ID",
    dataIndex: "resultId",
  },
  {
    title: "结果名称",
    dataIndex: "resultName",
    ellipsis: true,
    tooltip: { position: "left" },
  },
  {
    title: "结果描述",
    dataIndex: "resultDesc",
    ellipsis: true,
    tooltip: { position: "left" },
  },
  {
    title: "结果图标",
    dataIndex: "resultPicture",
    slotName: "resultPicture",
  },
  {
    title: "得分",
    dataIndex: "resultScore",
  },
  {
    title: "用户 ID",
    dataIndex: "userId",
  },
  {
    title: "创建时间",
    dataIndex: "createTime",
    slotName: "createTime",
    ellipsis: true,
    tooltip: { position: "left" },
  },
  {
    title: "修改时间",
    dataIndex: "updateTime",
    slotName: "updateTime",
    ellipsis: true,
    tooltip: { position: "left" },
  },
  {
    title: "操作",
    slotName: "optional",
  },
];
// 搜索条件
const formSearchParams = ref<API.UserAnswerQueryRequest>({});
// 默认搜索值
const initSearcherParams = {
  current: 1,
  pageSize: 10,
};
const searchParams = ref<API.UserAnswerQueryRequest>({
  ...initSearcherParams,
});
// 数据列表+数据总数
const dataList = ref<API.UserAnswer[]>([]);
const total = ref<number>(0);

/**
 * 加载数据
 * */
const loadData = async () => {
  const res = await listUserAnswerByPageUsingPost(searchParams.value);
  console.log(res);
  if (res.data.code === 0) {
    dataList.value = res.data.data?.records || [];
    total.value = res.data.data?.total || 0;
  } else {
    message.error("获取数据失败，" + res.data.message);
  }
};
/**
 * 搜索。重置搜索分页+搜索条件
 * */
const doSearch = async () => {
  searchParams.value = {
    ...initSearcherParams,
    ...formSearchParams.value,
  };
};
/**
 * 删除
 * */
const doDelete = async (record: API.UserAnswer) => {
  const res = await deleteUserAnswerUsingPost({
    id: record.id,
  });
  if (res.data.code === 0) {
    loadData();
    message.success("删除成功");
  } else {
    message.error("删除失败，" + res.data.message);
  }
};
/**
 * 修改
 * */
const doUpdate = (record: any) => {
  console.log(record);
};
/**
 * 分页跳转
 * */
const pageChange = (page: number) => {
  searchParams.value = {
    ...searchParams.value,
    current: page,
  };
};
/**
 * 监听searcher变量，改变时触发数据重新加载
 * */
watchEffect(() => {
  loadData();
});
</script>
