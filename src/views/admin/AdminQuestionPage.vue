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
      field="questionContent"
      tooltip="Please enter questionContent"
      label="题目内容"
    >
      <a-input
        allow-clear
        v-model="formSearchParams.questionContent"
        placeholder="请输入题目内容"
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
    <template #questionContent="{ record }">
      <div
        v-for="question in JSON.parse(record.questionContent)"
        :key="question.title"
      >
        {{ question }}
      </div>
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
  deleteQuestionUsingPost,
  listQuestionByPageUsingPost,
} from "@/api/questionController";

const columns = [
  {
    title: "ID",
    dataIndex: "id",
  },
  {
    title: "题目内容（json格式）",
    dataIndex: "questionContent",
    ellipsis: true,
    tooltip: { position: "left" },
    width: 100,
  },
  {
    title: "应用 ID",
    dataIndex: "appId",
  },
  {
    title: "创建用户 ID",
    dataIndex: "userId",
  },
  {
    title: "创建时间",
    dataIndex: "createTime",
    slotName: "createTime",
  },
  {
    title: "修改时间",
    dataIndex: "updateTime",
    slotName: "updateTime",
  },
  {
    title: "操作",
    slotName: "optional",
  },
];
// 搜索条件
const formSearchParams = ref<API.QuestionQueryRequest>({});
// 默认搜索值
const initSearcherParams = {
  current: 1,
  pageSize: 10,
};
const searchParams = ref<API.QuestionQueryRequest>({
  ...initSearcherParams,
});
// 数据列表+数据总数
const dataList = ref<API.Question[]>([]);
const total = ref<number>(0);

/**
 * 加载数据
 * */
const loadData = async () => {
  const res = await listQuestionByPageUsingPost(searchParams.value);
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
const doDelete = async (record: API.Question) => {
  const res = await deleteQuestionUsingPost({
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