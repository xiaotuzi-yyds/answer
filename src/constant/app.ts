/**
 * 审核状态枚举
 * */
export const REVIEW_STATUS_ENUM = {
  WAIT: 0,
  PASS: 1,
  REJECT: 2,
};
/**
 * 审核状态映射
 * */
export const REVIEW_STATUS_MAP = {
  0: "待审核",
  1: "通过",
  2: "拒绝",
};
/**
 * 应用类型枚举
 * */
export const APP_TYPE_ENUM = {
  SCORE: 0,
  TEST: 1,
};
/**
 * 应用类型映射
 * */
export const APP_TYPE_MAP = {
  0: "得分类",
  1: "测评类",
};

/**
 * 评分策略枚举
 * */
export const SCORING_RESULT_ENUM = {
  CUSTOM: 0,
  AI: 1,
};
/**
 * 评分策略映射
 * */
export const SCORING_RESULT_MAP = {
  0: "自定义",
  1: "AI",
};
