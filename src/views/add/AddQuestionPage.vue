<template>
  <div id="addQuestionPage">
    <h2>创建题目</h2>
    <a-form
      :model="qc"
      :style="{ width: '480px', margin: '0 auto' }"
      label-align="left"
      auto-label-width
      @submit="handleSubmit"
    >
      <a-form-item label="应用id">
        {{ appId }}
      </a-form-item>
      <a-form-item label="题目列表" :content-flex="false" :merge-props="false">
        <a-space size="medium">
          <a-button @click="addQuestion(qc.length)"> 底部添加题目</a-button>
          <AiGenerateQuestionDrawer
            :appId="appId"
            :onSuccess="onAiGenerate"
            :onSSESuccess="onAiGenerateSSE"
          />
        </a-space>
        <!-- 遍历每到题目 -->
        <div v-for="(question, index) in qc" :key="index">
          <a-space size="large">
            <h3>题目{{ index + 1 }}</h3>
            <a-button size="small" @click="addQuestion(index + 1)">
              添加题目
            </a-button>
            <a-button
              size="small"
              status="danger"
              @click="deteleQuestion(index)"
            >
              删除题目
            </a-button>
          </a-space>
          <a-form-item field="question" :label="`题目 ${index + 1} 标题`">
            <a-input v-model="question.title" placeholder="请输入标题" />
          </a-form-item>
          <!-- 题目选项  -->
          <h4>题目 {{ index + 1 }} 选项列表</h4>
          <a-form-item
            v-for="(option, optionIndex) in question.options"
            :key="optionIndex"
            :label="`选项 ${optionIndex + 1}`"
            :content-flex="false"
            :merge-props="false"
          >
            <a-form-item label="选项key">
              <a-input v-model="option.key" placeholder="请输入选项key" />
            </a-form-item>
            <a-form-item label="选项值">
              <a-input v-model="option.value" placeholder="请输入选项value" />
            </a-form-item>
            <!-- 测评类展示选项结果，得分类展示分数 -->
            <a-form-item v-if="appType === APP_TYPE_ENUM.TEST" label="选项结果">
              <a-input v-model="option.result" placeholder="请输入选项结果" />
            </a-form-item>
            <a-form-item v-else label="选项得分">
              <a-input v-model="option.score" placeholder="请输入选项得分" />
            </a-form-item>
            <a-space size="large">
              <a-button
                size="mini"
                @click="addQuestionOption(question, optionIndex + 1)"
              >
                添加选项
              </a-button>
              <a-button
                size="mini"
                status="danger"
                @click="deteleQuestionOption(question, optionIndex as any)"
              >
                删除题目
              </a-button>
            </a-space>
          </a-form-item>
        </div>
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
  addQuestionUsingPost,
  editQuestionUsingPost,
  listQuestionVoByPageUsingPost,
} from "@/api/questionController";
import { APP_TYPE_ENUM } from "@/constant/app";
import AiGenerateQuestionDrawer from "@/views/add/componenents/AiGenerateQuestionDrawer.vue";

// 接收父组件传递的应用id
interface Props {
  appId: number;
  appType: number; // 判断是否展示分数
}

const props = withDefaults(defineProps<Props>(), {
  appId: () => 0,
  appType: () => 0,
});
const router = useRouter();
// 题目信息
const qc = ref<API.QuestionContentDTO[]>([]);
// 保留信息，避免刷新清空
const oldQuestion = ref<API.QuestionVO>({});

/**
 * 添加题目
 * */
const addQuestion = (index: number) => {
  qc.value.splice(index, 0, { title: "", options: [] });
};

/**
 * 删除题目
 * */
const deteleQuestion = (index: number) => {
  qc.value.splice(index, 1);
};

/**
 * ai生成题目方法(批量生成)
 * */
const onAiGenerate = (result: API.QuestionContentDTO[]) => {
  qc.value = [...qc.value, ...result];
};
/**
 * ai生成题目方法（流式生成）
 * */
const onAiGenerateSSE = (result: API.QuestionContentDTO) => {
  qc.value = [...qc.value, result];
};

/**
 * 添加题目选项
 * */
const addQuestionOption = (question: API.QuestionContentDTO, index: number) => {
  if (!question.options) {
    question.options = [];
  }
  question.options.splice(index, 0, {
    key: "",
    value: "",
  });
};

/**
 * 删除题目选项
 * */
const deteleQuestionOption = (
  question: API.QuestionContentDTO,
  index: number
) => {
  if (!question.options) {
    question.options = [];
  }
  question.options.splice(index, 1);
};
/**
 * 创建/修改题目信息，提交
 * */
const handleSubmit = async () => {
  if (!props.appId || !qc.value) {
    return;
  }
  let res: any;
  if (oldQuestion.value.id) {
    res = await editQuestionUsingPost({
      id: oldQuestion.value.id,
      questionContent: qc.value,
    });
  } else {
    res = await addQuestionUsingPost({
      appId: props.appId,
      questionContent: qc.value,
    });
  }
  if (res.data.code === 0) {
    message.success("操作成功，即将跳转到应用详情页");
    setTimeout(() => {
      router.push(`/app/detail/${props.appId}`);
    }, 3000);
  } else {
    message.error("操作失败，" + res.data.message);
  }
};
/**
 * 加载数据
 * */
const loadData = async () => {
  // 修改则不必重新加载数据
  if (!props.appId) {
    return;
  }
  const res = await listQuestionVoByPageUsingPost({
    appId: props.appId,
    current: 1,
    pageSize: 1,
    sortField: "createTime",
    sortOrder: "descend",
  });
  if (res.data.code === 0 && res.data.data?.records) {
    oldQuestion.value = res.data.data?.records[0];
    if (oldQuestion.value) {
      qc.value = oldQuestion.value.questionContent ?? [];
    }
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
