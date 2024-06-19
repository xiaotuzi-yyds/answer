<template>
  <div id="appStatistic">
    <a-space>
      <a-card hoverable>
        <h2>热门应用统计</h2>
        <v-chart
          :option="appAnswerCountOptions"
          style="height: 350px; width: 500px"
        />
      </a-card>
      <a-card :style="{ width: '400px' }" hoverable>
        <h2>应用结果统计</h2>
        <div class="searchBar">
          <a-input-search
            :style="{ width: '200px' }"
            placeholder="应用id"
            button-text="搜索"
            size="medium"
            search-button
            @search="(val) => loadAppAnswerResultNAMECountData(val)"
          />
        </div>
        <v-chart
          :option="appAnswerResultNameCountOptions"
          style="height: 300px"
        />
      </a-card>
    </a-space>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watchEffect } from "vue";
import API from "@/api";
import message from "@arco-design/web-vue/es/message";
import {
  getAppAnswerCountUsingGet,
  getAppAnswerResultNameCountUsingGet,
} from "@/api/statisticController";
import "echarts";
import VChart from "vue-echarts";

// 热门应用统计，某应用结果统计
const appAnswerCountData = ref<API.UserAnswerCountDTO[]>([]);
const appAnswerResultNameCountData = ref<API.UserAnswerResultNameCountDTO[]>(
  []
);

// 数据列表+数据总数
const appAnswerCountOptions = computed(() => {
  return {
    xAxis: {
      type: "category",
      data: appAnswerCountData.value.map((item) => item.appId),
      name: "应用id",
    },
    yAxis: {
      type: "value",
      name: "用户使用量",
    },
    series: [
      {
        data: appAnswerCountData.value.map((item) => item.answerCount),
        type: "bar",
      },
    ],
  };
});
const appAnswerResultNameCountOptions = computed(() => {
  return {
    tooltip: {
      trigger: "item",
    },
    legend: {
      orient: "vertical",
      left: "left",
    },
    series: [
      {
        type: "pie",
        radius: "50%",
        data: appAnswerResultNameCountData.value.map((item) => {
          return { value: item.resultCount, name: item.resultName };
        }),
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
      },
    ],
  };
});

/**
 * 加载热门数据
 * */
const loadAppAnswerCountData = async () => {
  const res = await getAppAnswerCountUsingGet();
  console.log(res.data.data);

  if (res.data.code === 0) {
    appAnswerCountData.value = res.data.data || [];
  } else {
    message.error("获取数据失败，" + res.data.message);
  }
};
/**
 * 加载某个应用的详情
 * */
const loadAppAnswerResultNAMECountData = async (appId: any) => {
  if (!appId) {
    return;
  }
  const res = await getAppAnswerResultNameCountUsingGet({
    appId: appId,
  });
  console.log(res.data.data);
  if (res.data.code === 0) {
    appAnswerResultNameCountData.value = res.data.data || [];
  } else {
    message.error("获取数据失败，" + res.data.message);
  }
};

/**
 * 监听searcher变量，改变时触发数据重新加载
 * */
watchEffect(() => {
  loadAppAnswerCountData();
  loadAppAnswerResultNAMECountData("");
});
</script>

<style scoped>
.searchBar {
  margin-bottom: 28px;
}
</style>
