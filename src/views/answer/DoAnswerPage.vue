<template>
  <div id="doAnswerPage">
    <a-card>
      <h1>{{ app.appName }}</h1>
      <p>{{ app.appDesc }}</p>
      <h2 style="margin-bottom: 32px">
        {{ currentQuestion?.title }}
      </h2>
      <div>
        <a-radio-group
          direction="vertical"
          v-model="currentAnswer"
          :options="questionOptions"
          @change="doRadioChange"
        />
      </div>
      <div style="margin-top: 24px">
        <a-space size="large">
          <a-button
            type="primary"
            circle
            v-if="current < qc.length"
            :disabled="!currentAnswer"
            @click="current += 1"
            >下一题
          </a-button>
          <a-button
            type="primary"
            circle
            :loading="submitFag"
            v-if="current == qc.length"
            :disabled="!currentAnswer"
            @click="doSubmit"
            >{{ submitFag ? "评分中" : "查看结果" }}
          </a-button>
          <a-button circle v-if="current > 1" @click="current -= 1"
            >上一题
          </a-button>
        </a-space>
      </div>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import API from "@/api";
import { useRouter } from "vue-router";
import {
  computed,
  defineProps,
  reactive,
  ref,
  watchEffect,
  withDefaults,
} from "vue";
import message from "@arco-design/web-vue/es/message";
import { listQuestionVoByPageUsingPost } from "@/api/questionController";
import { getAppVoByIdUsingGet } from "@/api/appController";
import {
  addUserAnswerUsingPost,
  generateUserAnswerIdUsingGet,
} from "@/api/userAnswerController";

// 接收父组件传递的应用id
interface Props {
  appId: number;
  scoringStrategy: number;
}

const props = withDefaults(defineProps<Props>(), {
  appId: () => 0,
  scoringStrategy: () => 0, // 根据策略的不同，采用不同的提交策略
});
const router = useRouter();
// 提交后的加载状态
const submitFag = ref(false);

// app信息
const app = ref<API.AppVO>({});
// 唯一id
const id = ref<number>();
// 题目信息
const qc = ref<API.QuestionContentDTO[]>([]);
// 当前题目的序号，题目，题目选项
const current = ref<number>(1);
// 问题列表，选项列表
const currentQuestion = ref<API.QuestionContentDTO>({});
const questionOptions = computed(() => {
  return currentQuestion.value?.options
    ? currentQuestion.value.options.map((option) => {
        return {
          label: `${option.key}. ${option.value}`,
          value: props.scoringStrategy === 0 ? option.key : option.value, // 自定义-key，ai-匹配value
        };
      })
    : [];
});
// 当前答案，回答列表
const currentAnswer = ref<string>();
const answerList = reactive<string[]>([]);
/**
 * 生成唯一id
 * */
const generateId = async () => {
  const res = await generateUserAnswerIdUsingGet();
  if (res.data.code === 0) {
    id.value = res.data.data as any;
  } else {
    message.error("获取数据失败，" + res.data.message);
  }
};

/**
 * 选项记录。写入回答列表
 * */
const doRadioChange = (value: string) => {
  answerList[current.value - 1] = value;
};
/**
 * 创建/修改题目信息，提交
 * */
const doSubmit = async () => {
  if (!props.appId || !answerList) {
    return;
  }
  submitFag.value = true;
  const res = await addUserAnswerUsingPost({
    id: id.value,
    appId: props.appId,
    choices: answerList,
  });
  if (res.data.code === 0 && res.data.code) {
    message.success("提交成功，即将跳转到应用详情页");
    setTimeout(() => {
      router.push(`/app/detail/${props.appId}`);
    }, 3000);
  } else {
    message.error("提交失败，" + res.data.message);
  }
  submitFag.value = false;
};
/**
 * 加载数据
 * */
const loadData = async () => {
  // 修改则不必重新加载数据
  if (!props.appId) {
    return;
  }
  // 获取app
  let res: any = await getAppVoByIdUsingGet({ id: props.appId });
  if (res.data.code === 0) {
    app.value = res.data.data as any;
  } else {
    message.error("获取数据失败，" + res.data.message);
  }
  // 获取题目信息
  res = await listQuestionVoByPageUsingPost({
    appId: props.appId,
    current: 1,
    pageSize: 1,
    sortField: "createTime",
    sortOrder: "descend",
  });
  if (res.data.code === 0 && res.data.data?.records) {
    qc.value = res.data.data?.records[0].questionContent;
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
/**
 * 题目切换监听+变化
 * */
watchEffect(() => {
  currentQuestion.value = qc.value[current.value - 1];
  currentAnswer.value = answerList[current.value - 1];
});
watchEffect(() => {
  generateId();
});
</script>
