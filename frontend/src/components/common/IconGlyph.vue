<script setup lang="ts">
/**
 * 通用线性图标集（24×24，stroke 风格）。name 与业务 code 的映射见 config/icons.ts；
 * 未知名称回退到 'grid'。所有图标为纯几何线条，不引入第三方图标库。
 */
import { computed } from 'vue'

const props = withDefaults(defineProps<{ name: string; size?: number }>(), { size: 20 })

const paths: Record<string, string> = {
  // 数据库 / 数据智能
  database:
    'M12 3c4.97 0 9 1.34 9 3s-4.03 3-9 3-9-1.34-9-3 4.03-3 9-3ZM3 6v12c0 1.66 4.03 3 9 3s9-1.34 9-3V6M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3',
  // 芯片 / 大模型 / 计算
  cpu: 'M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3M6 4h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2ZM9 9h6v6H9z',
  // 星火 / 品牌
  spark: 'M12 2v4M12 18v4M2 12h4M18 12h4M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1M12 8.5 13.6 12l3.4 1.6-3.4 1.6L12 18.5l-1.6-3.3L7 13.6l3.4-1.6z',
  // 文档 / 内容
  doc: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M9 13h6M9 17h6M9 9h1',
  // 图表 / 研究洞察
  chart: 'M3 3v16a2 2 0 0 0 2 2h16M8 17v-6M13 17V7M18 17v-3',
  // 网络 / 知识图谱
  network:
    'M12 5a2.5 2.5 0 1 0 0 .01ZM5 19a2.5 2.5 0 1 0 0 .01ZM19 19a2.5 2.5 0 1 0 0 .01ZM12 7.5 6.2 16.8M12 7.5l5.8 9.3M7.5 19h9',
  // 智能体 / 自动化
  agent:
    'M12 2a4 4 0 0 1 4 4v1h1a3 3 0 0 1 3 3v7a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3v-7a3 3 0 0 1 3-3h1V6a4 4 0 0 1 4-4ZM9 13h.01M15 13h.01M9.5 16.5c1.5 1 3.5 1 5 0',
  // 多模态 / 图层
  layers: 'M12 2 2 7.5 12 13l10-5.5zM2 12.5 12 18l10-5.5M2 17.5 12 23l10-5.5',
  // 集成 / 连接
  link: 'M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71',
  // 工厂 / 制造
  factory: 'M2 21h20M4 21V8l5 3.5V8l5 3.5V4h6v17M8 17h2M14 17h2',
  // 科技 / 互联网
  globe:
    'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20ZM2 12h20M12 2c2.5 2.6 3.9 6 3.9 10s-1.4 7.4-3.9 10c-2.5-2.6-3.9-6-3.9-10S9.5 4.6 12 2Z',
  // 零售 / 消费
  cart: 'M2 3h2l2.6 12.4A2 2 0 0 0 8.56 17H19a2 2 0 0 0 1.95-1.55L22.5 7H6M9 21a1 1 0 1 0 0-.01M18 21a1 1 0 1 0 0-.01',
  // 专业服务 / 公文包
  briefcase: 'M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 7h18a1 1 0 0 1 1 1v11a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a1 1 0 0 1 1-1ZM2 12h20',
  // 企业集团 / 楼宇
  building: 'M4 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16M16 9h3a1 1 0 0 1 1 1v11M2 21h20M8 7h2M8 11h2M8 15h2M12 7h0M12 11h0M12 15h0',
  // 默认网格
  grid: 'M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z',
}

const d = computed(() => paths[props.name] ?? paths.grid)
</script>

<template>
  <svg
    :width="props.size"
    :height="props.size"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.6"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    <path :d="d" />
  </svg>
</template>
