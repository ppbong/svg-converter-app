<script setup lang="ts">
// 定义组件属性
interface Props {
  // 是否正在转换
  isConverting?: boolean
  // 转换进度百分比
  progressPercent?: number
  // 进度条状态
  progressStatus?: 'success' | 'exception' | 'warning' | ''
  // 转换结果预览图片
  resultPreview?: string
}

defineProps<Props>()
</script>

<template>
    <div class="result-preview">
        <!-- 如果转换中，显示进度条 -->
        <div v-if="isConverting" class="progress">
            <el-progress
                :stroke-width="15"
                :percentage="progressPercent || 0"
                :status="progressStatus"
                :striped="true"
                striped-flow
            />
        </div>
        <!-- 如果转换完成，显示预览 -->
        <div v-else-if="resultPreview" class="preview">
            <img :src="resultPreview" alt="result preview">
        </div>
        <!-- 如果无转换 -->
        <div v-else class="no-preview">
            暂无转换结果
        </div>
    </div>
</template>

<style scoped>
.result-preview {
    width: 100%;
    height: 300px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    background-color: #f5f7fa;
    overflow: hidden;
}

.no-preview {
    color: #909399;
    font-size: 16px;
}

.preview {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px;
}

.preview img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
}
</style>