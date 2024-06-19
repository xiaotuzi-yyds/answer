<template>
  <a-form
    :model="formSearchParams"
    :style="{ marginBottom: '20px' }"
    label-align="left"
    layout="inline"
    auto-label-width
    @submit="doSearch"
  >
    <a-form-item
      field="resultName"
      tooltip="Please enter resultName"
      label="结果名称"
    >
      <a-input
        allow-clear
        v-model="formSearchParams.resultName"
        placeholder="please enter your resultName..."
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
        placeholder="please enter your resultDesc..."
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
      <a-image width="64" :src="record.userAvatar" />
    </template>
    <template
      v-if="props.appType === APP_TYPE_ENUM.TEST"
      #resultProp="{ record }"
    >
      {{ record.resultProp }}
    </template>
    <template v-else #resultScoreRange="{ record }">
      {{ record.resultScoreRange }}
    </template>
    <template #createTime="{ record }">
      {{ dayjs(record.createTime).format("YYYY-MM-DD") }}
    </template>
    <template #updateTime="{ record }">
      {{ dayjs(record.updateTime).format("YYYY-MM-DD") }}
    </template>
    <template #optional="{ record }">
      <a-button status="success" @click="doUpdate(record)">修改</a-button>
      <a-button status="danger" @click="doDelete(record)">删除</a-button>
    </template>
  </a-table>
</template>

<script setup lang="ts">
import { defineProps, defineExpose, ref, watchEffect, withDefaults } from "vue";
import message from "@arco-design/web-vue/es/message";
import API from "@/api";
import { dayjs } from "@arco-design/web-vue/es/_utils/date";
import {
  deleteScoringResultUsingPost,
  listScoringResultVoByPageUsingPost,
} from "@/api/scoringResultController";
import { APP_TYPE_ENUM } from "@/constant/app";

// 接收要查询的appId信息
interface Props {
  appId: number;
  appType: number;
  doUpdate: (scoringResult: API.ScoringResultVO) => void;
}

const props = withDefaults(defineProps<Props>(), {
  appId: () => 0,
  appType: () => 0, // 判断是否展示得分
});
// 搜索条件
const formSearchParams = ref<API.ScoringResultQueryRequest>({});
// 默认搜索值
const initSearcherParams = {
  current: 1,
  pageSize: 10,
  sortField: "createTime",
  sortOrder: "descend",
};
const searchParams = ref<API.ScoringResultQueryRequest>({
  ...initSearcherParams,
});
// 数据列表+数据总数
const dataList = ref<API.ScoringResultVO[]>([]);
const total = ref<number>(0);
// 展示列
const columns = [
  {
    title: "ID",
    dataIndex: "id",
  },
  {
    title: "结果名称",
    dataIndex: "resultName",
  },
  {
    title: "结果描述",
    dataIndex: "resultDesc",
  },
  {
    title: "结果图片",
    dataIndex: "resultPicture",
    slotName: "resultPicture",
  },
  props.appType == APP_TYPE_ENUM.TEST
    ? {
        title: "结果属性集合（JSON）",
        dataIndex: "resultProp",
        slotName: "resultProp",
      }
    : {
        title: "结果得分范围",
        dataIndex: "resultScoreRange",
        slotName: "resultScoreRange",
      },
  {
    title: "创建时间",
    dataIndex: "createTime",
    slotName: "createTime",
  },
  {
    title: "操作",
    slotName: "optional",
  },
];

/**
 * 加载数据
 * */
const loadData = async () => {
  if (!props.appId) {
    return;
  }
  const params = {
    appId: props.appId,
    ...searchParams.value,
  };
  const res = await listScoringResultVoByPageUsingPost(params);
  if (res.data.code === 0) {
    dataList.value = res.data.data?.records || [];
    total.value = res.data.data?.total || 0;
  } else {
    message.error("获取数据失败，" + res.data.message);
  }
};
/**
 * 子组件的属性，方法暴露给父组件
 * */
defineExpose({
  loadData,
});

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
const doDelete = async (record: API.ScoringResult) => {
  const res = await deleteScoringResultUsingPost({
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
