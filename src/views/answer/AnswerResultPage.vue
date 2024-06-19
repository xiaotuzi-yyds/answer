<template>
  <div id="answerResultPage">
    <a-card>
      <a-row style="margin-bottom: 16px">
        <a-col class="content-wrapper" flex="auto">
          <h2>{{ data.resultName }}</h2>
          <p v-if="data.appType === APP_TYPE_ENUM.SCORE">得分：{{ data.resultScore }}</p>
          <p v-else>结果描述：{{ data.resultDesc }}</p>
          <p>应用id：{{ data.appId }}</p>
          <p>应用类型: {{ APP_TYPE_MAP[data.appType] }}</p>
          <p>评分策略: {{ SCORING_RESULT_MAP[data.scoringStrategy] }}</p>
          <p>我的答案：{{ data.choices }}</p>
          <p>
            作者:
            <div
                :style="{ display: 'flex', alignItems: 'center', color: '#1D2129' }"
            >
              <a-avatar
                  :size="24"
                  :image-url="data.user?.userAvatar"
                  :style="{ marginRight: '8px' }"
              >
                A
              </a-avatar>
              <a-typography-text
              >{{ data.user?.userName || "无名" }}
              </a-typography-text>
            </div>
          </p>
          <p>创建时间: {{ dayjs(data.createTime).format("YYYY-MM-DD") }}</p>
          <a-space size="medium">
            <a-button type="primary" :href="`/answer/do/${data.appId}`">重新答题</a-button>
            <a-button>分享应用</a-button>
          </a-space>
        </a-col>
        <a-col flex="320px">
          <a-image width="100%" :src="data.resultPicture"/>
        </a-col>
      </a-row>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import {computed, defineProps, ref, watchEffect, withDefaults} from "vue";
import API from "@/api";
import message from "@arco-design/web-vue/es/message";
import {dayjs} from "@arco-design/web-vue/es/_utils/date";
import {useLoginUserStore} from "@/store/userStore";
import {APP_TYPE_ENUM, APP_TYPE_MAP, SCORING_RESULT_MAP} from "@/constant/app";
import {getUserAnswerVoByIdUsingGet} from "@/api/userAnswerController";

// 数据列表+数据总数
const data = ref<API.UserAnswerVO>({});

interface Props {
  id: number;
}

const props = withDefaults(defineProps<Props>(), {
  id: () => 0,
});
/**
 * 加载数据
 * */
const loadData = async () => {
  if (!props.id) {
    return;
  }
  const res = await getUserAnswerVoByIdUsingGet({id: props.id});
  if (res.data.code === 0) {
    data.value = res.data.data as any;
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

<style scoped>
#userAnserDetailPage .content-wruserAnserer > p {
  margin-bottom: 24px;
}
</style>
