<script setup lang="ts">
import { ref } from 'vue'
import FileSelect from './FileSelect.vue'
import FileConvert from './FileConvert.vue'
import ResultPreview from './ResultPreview.vue'

// SVG文件内容
const svgContent = ref('')
// SVG文件名
const fileName = ref('')
// 是否有选中的文件
const hasSelectedFile = ref(false)

// 转换状态
const isConverting = ref(false)
// 转换进度百分比
const progressPercent = ref(0)
// 进度条状态
const progressStatus = ref<'' | 'success' | 'exception' | 'warning'>('')
// 转换结果预览
const resultPreview = ref('')

// 处理文件选中事件
const handleFileSelected = (content: string, name: string) => {
  svgContent.value = content
  fileName.value = name
  hasSelectedFile.value = true
  // 重置转换状态
  isConverting.value = false
  progressPercent.value = 0
  resultPreview.value = ''
}

// 处理文件删除事件
const handleFileDeleted = () => {
  svgContent.value = ''
  fileName.value = ''
  hasSelectedFile.value = false
  // 重置转换状态
  isConverting.value = false
  progressPercent.value = 0
  resultPreview.value = ''
}

// 处理开始转换事件
const handleStartConvert = (format: string, sizes: string[], content: string) => {
  isConverting.value = true
  progressPercent.value = 0
  progressStatus.value = ''
  
  // 模拟转换过程
  simulateConversion()
}

// 处理取消转换事件
const handleCancelConvert = () => {
  isConverting.value = false
  progressPercent.value = 0
  progressStatus.value = 'exception'
}

// 模拟转换过程
const simulateConversion = () => {
  let progress = 0
  const interval = setInterval(() => {
    progress += 10
    progressPercent.value = progress
    
    if (progress >= 100) {
      clearInterval(interval)
      isConverting.value = false
      progressStatus.value = 'success'
      // 模拟转换结果（实际应用中应该是真实的转换结果）
      resultPreview.value = 'https://picsum.photos/200/200'
    }
  }, 300)
}
</script>

<template>
  <div class="main-board">
    <el-row :gutter="20" justify="space-evenly" style="margin-left: 0;">
      <el-col :span="8">
        <el-card>
          <template #header>
            <span>File Selector</span>
          </template>
          <FileSelect 
            @file-selected="handleFileSelected"
            @file-deleted="handleFileDeleted"
          />
        </el-card>
      </el-col>
       <el-col :span="8">
        <el-card>
          <template #header>
            <span>Converter</span>
          </template>
          <FileConvert 
            :has-selected-file="hasSelectedFile"
            :svg-content="svgContent"
            :file-name="fileName"
            @start-convert="handleStartConvert"
            @cancel-convert="handleCancelConvert"
          />
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <template #header>
            <span>Preview</span>
          </template>
          <ResultPreview 
            :is-converting="isConverting"
            :progress-percent="progressPercent"
            :progress-status="progressStatus"
            :result-preview="resultPreview"
          />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped>
.main-board {
  margin: 0 auto;
  padding: 0;
  width: 100%;
  height: 100%;
}

.el-row {
  width: 100%;
  margin-bottom: 20px;
}

.el-row:last-child {
  margin-bottom: 0;
}

.el-col {
  border-radius: 15px;
}

.el-card {
    border-radius: 15px;
    height: 500px;
    display: flex;
    flex-direction: column;
}

.el-card .el-card__body {
    flex: 1;
    overflow-y: auto;
}
</style>