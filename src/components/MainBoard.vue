<script setup lang="ts">
import { ref } from 'vue'
import FileSelect from './FileSelect.vue'
import FileConvert from './FileConvert.vue'
import ResultPreview from './ResultPreview.vue'

// SVG文件内容
const svgContent = ref('')
// SVG文件路径
const filePath = ref('')
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
const handleFileSelected = (content: string, path: string) => {
  svgContent.value = content
  filePath.value = path
  hasSelectedFile.value = true
  // 重置转换状态
  isConverting.value = false
  progressPercent.value = 0
  resultPreview.value = ''
}

// 处理文件删除事件
const handleFileDeleted = () => {
  svgContent.value = ''
  filePath.value = ''
  hasSelectedFile.value = false
  // 重置转换状态
  isConverting.value = false
  progressPercent.value = 0
  resultPreview.value = ''
}

// 处理开始转换事件
const handleStartConvert = (filePath: string, format: string, sizes: string | string[]) => {
  isConverting.value = true
  progressPercent.value = 0
  progressStatus.value = ''
  
  if (window.electronApi) {
    window.electronApi.convertSvg(filePath, format, sizes).then((result) => {
      console.log(result)
      if (result === '转换完成') {
        progressStatus.value = 'success'
      } else {
        progressStatus.value = 'exception'
      }
    })
  }
}

// 处理取消转换事件
const handleCancelConvert = () => {
  isConverting.value = false
  progressPercent.value = 0
  progressStatus.value = 'exception'
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
            :file-path="filePath"
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