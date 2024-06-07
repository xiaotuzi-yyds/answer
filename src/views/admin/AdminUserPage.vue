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
      field="userName"
      tooltip="Please enter userName"
      label="用户名"
    >
      <a-input
        v-model="formSearchParams.userName"
        placeholder="please enter your userAccount..."
      />
    </a-form-item>
    <a-form-item
      field="userProfile"
      tooltip="Please enter userName"
      label="用户简介"
    >
      <a-input
        v-model="formSearchParams.userProfile"
        placeholder="please enter your userAccount..."
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
    <template #userAvatar="{ record }">
      <a-image width="64" :src="record.userAvatar" />
    </template>
    <template #optional="{ record }">
      <!--<a-button type="primary" @click="doUpdate(record)">修改</a-button>-->
      <a-button status="danger" @click="doDelete(record)">删除</a-button>
    </template>
  </a-table>
</template>

<script setup lang="ts">
import { ref, watchEffect } from "vue";
import {
  deleteUserUsingPost,
  listUserByPageUsingPost,
} from "@/api/userController";
import message from "@arco-design/web-vue/es/message";
import API from "@/api";

const columns = [
  {
    title: "ID",
    dataIndex: "id",
  },
  {
    title: "用户昵称",
    dataIndex: "userName",
  },
  {
    title: "账号",
    dataIndex: "userAccount",
  },
  {
    title: "用户头像",
    dataIndex: "userAvatar",
    slotName: "userAvatar",
  },
  {
    title: "用户简介",
    dataIndex: "userProfile",
  },
  {
    title: "用户角色",
    dataIndex: "userRole",
  },
  {
    title: "微信开放平台id",
    dataIndex: "unionId",
  },
  {
    title: "公众号openId",
    dataIndex: "mpOpenId",
  },
  {
    title: "操作",
    slotName: "optional",
  },
];
// 搜索条件
const formSearchParams = ref<API.UserQueryRequest>({});
// 默认搜索值
const initSearcherParams = {
  current: 1,
  pageSize: 10,
};
const searchParams = ref<API.UserQueryRequest>({
  ...initSearcherParams,
});
// 数据列表+数据总数
const dataList = ref<API.User[]>([]);
const total = ref<number>(0);

/**
 * 加载数据
 * */
const loadData = async () => {
  const res = await listUserByPageUsingPost(searchParams.value);
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
const doDelete = async (record: API.User) => {
  const res = await deleteUserUsingPost({
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
