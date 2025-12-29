<script setup lang="ts">
import { ref, onMounted } from 'vue'
import FileSelect from './FileSelect.vue'
import FileConvert from './FileConvert.vue'
import ResultPreview from './ResultPreview.vue'
import type { AppConfig, ConvertFormat } from '../../electron/types/global'

// 应用配置
const appConfig = ref<AppConfig>({
  convertFormats: [],
  pngSizeOptions: [],
  pngDefaultSize: 0,
  icoSizeOptions: [],
  icoDefaultSizes: [],
  icnsSizeOptions: [],
  icnsDefaultSizes: [],
})

// 初始化应用配置
onMounted(() => {
  if (window.electronApi) {
    window.electronApi.getAppConfig().then((response) => {
      appConfig.value = response.appConfig || appConfig.value
    })
  }
})

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
// 转换结果文件路径
const resultFilePath = ref('')

// 处理文件选中事件
const handleFileSelected = (content: string, name: string) => {
  svgContent.value = content
  fileName.value = name
  hasSelectedFile.value = true
  // 重置转换状态
  isConverting.value = false
  progressPercent.value = 0
  resultPreview.value = ''
  resultFilePath.value = ''

  if (window.electronApi) {
    window.electronApi.selectSvgFile(name, content).then((response) => {
      console.log(response)
    })
  }
}

// 处理文件删除事件
const handleFileDeleted = () => {
  if (window.electronApi) {
    window.electronApi.resetSvgFile(fileName.value).then((response) => {
      console.log(response)
    })
  }

  svgContent.value = ''
  fileName.value = ''
  hasSelectedFile.value = false
  // 重置转换状态
  isConverting.value = false
  progressPercent.value = 0
  resultPreview.value = ''
  resultFilePath.value = ''
}

// 处理开始转换事件
const handleStartConvert = (fileName: string, format: ConvertFormat, sizes: number | number[]) => {
  isConverting.value = true
  progressPercent.value = 0
  progressStatus.value = ''
  
  if (window.electronApi) {
    window.electronApi.convertSvg(fileName, format, sizes).then((response) => {
      console.log(response)

      if (response.success) {
        progressStatus.value = 'success'
        progressPercent.value = 100
        resultPreview.value = response.resultPreview || ''
        resultFilePath.value = response.resultFilePath || ''
      } else {
        progressStatus.value = 'exception'
        progressPercent.value = 50
        resultPreview.value = ''
        resultFilePath.value = ''
      }

      isConverting.value = false
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
            :is-converting="isConverting"
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
            :is-converting="isConverting"
            :app-config="appConfig"
            :has-selected-file="hasSelectedFile"
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
            :result-file-path="resultFilePath"
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
    height: calc(100vh - 280px);
    display: flex;
    flex-direction: column;
}

.el-card .el-card__body {
    flex: 1;
    overflow-y: auto;
}
</style>