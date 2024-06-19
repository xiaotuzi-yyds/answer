<template>
  <div id="appDetailPage">
    <a-card>
      <a-row style="margin-bottom: 16px">
        <a-col class="content-wrapper" flex="auto">
          <h2>{{ data.appName }}</h2>
          <p>应用类型: {{ APP_TYPE_MAP[data.appType] }}</p>
          <p>评分策略: {{ SCORING_RESULT_MAP[data.scoringStrategy] }}</p>
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
            <a-button type="primary" :href="`/answer/do/${id}`">开始答题</a-button>
            <a-button @click="doShare">分享应用</a-button>
            <a-button v-if="isMy" :href="`/add/question/${id}/${data.appType}`">设置题目</a-button>
            <a-button v-if="isMy" :href="`/add/scoring_result/${id}/${data.appType}`">设置评分</a-button>
            <a-button v-if="isMy" :href="`/add/app/${id}/${data.scoringStrategy}`">修改应用</a-button>
          </a-space>
        </a-col>
        <a-col flex="320px">
          <a-image width="100%" :src="data.appIcon"/>
        </a-col>
      </a-row>
    </a-card>
    <ShareModal :link="shareLink" title="应用分享" ref="shareModalRef"/>
  </div>
</template>

<script setup lang="ts">
import {computed, defineProps, ref, watchEffect, withDefaults} from "vue";
import API from "@/api";
import message from "@arco-design/web-vue/es/message";
import {getAppVoByIdUsingGet} from "@/api/appController";
import {dayjs} from "@arco-design/web-vue/es/_utils/date";
import {useLoginUserStore} from "@/store/userStore";
import {APP_TYPE_MAP, SCORING_RESULT_MAP} from "../../constant/app";
import ShareModal from "@/components/ShareModal.vue";

// 数据列表+数据总数
const data = ref<API.AppVO>({});

// 接收父组件传递的应用id信息
interface Props {
  id: number;
}

const props = withDefaults(defineProps<Props>(), {
  id: () => 0,
});

// 登录用户信息+方法
const loginUserStore = useLoginUserStore();
let loginUserId = loginUserStore.loginUser?.id;

// 判断是否是当前用户所创建的应用
const isMy = computed(() => {
  return loginUserId && loginUserId === data.value.userId
})

// 接收分享子组件暴露的方法
const shareModalRef = ref();
// 分享链接
const shareLink = `${window.location.protocol}//${window.location.host}/app/detail/${props.id}`;
// 分享方法
const doShare = (e: Event) => {
  if (shareModalRef.value) {
    shareModalRef.value.openModal();
  }
  e.stopPropagation(); // 阻止冒泡，触发其他事件
};

/**
 * 加载数据
 * */
const loadData = async () => {
  if (!props.id) {
    return;
  }
  const res = await getAppVoByIdUsingGet({id: props.id});
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
#appDetailPage .content-wrapper > p {
  margin-bottom: 2px;
}
</style>
