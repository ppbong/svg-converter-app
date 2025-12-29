<script setup lang="ts">
import { ref, computed } from 'vue'
import { VideoPlay, VideoPause } from '@element-plus/icons-vue'
import type { AppConfig, ConvertFormat } from '../../electron/types/global'

// 定义组件属性
interface Props {
  // 是否正在转换
  isConverting: boolean
  // 应用配置
  appConfig: AppConfig
  // 是否有选中的SVG文件
  hasSelectedFile: boolean
  // 选中的SVG文件名
  fileName?: string
}

// 获取组件属性
const props = defineProps<Props>()

// 定义事件
const emit = defineEmits<{
  // 开始转换
  (e: 'start-convert', fileName: string, format: ConvertFormat, sizes: number | number[]): void
  // 取消转换
  (e: 'cancel-convert'): void
}>()

interface FormData {
  selectedFormat: ConvertFormat
  selectedSizes: number | number[]
}

// 表单数据
const formData = ref<FormData>({
  selectedFormat: 'PNG',
  selectedSizes: 16,
})

// 转换格式支持的大小选项
const sizes = computed(() => {
  return formData.value.selectedFormat === 'ICO' ? props.appConfig.icoSizeOptions
  : formData.value.selectedFormat === 'ICNS' ? props.appConfig.icnsSizeOptions
  : props.appConfig.pngSizeOptions
})

// 处理格式改变
const handleFormatChange = () => {
  formData.value.selectedSizes = formData.value.selectedFormat === 'ICO' ? props.appConfig.icoDefaultSizes
  : formData.value.selectedFormat === 'ICNS' ? props.appConfig.icnsDefaultSizes
  : props.appConfig.pngDefaultSize
}

// 处理转换
const handleConvert = () => {
  if (!props.hasSelectedFile || !props.fileName) {
    return
  }
  
  if (!props.isConverting) {
    // 开始转换，发送转换请求
    emit('start-convert', props.fileName, formData.value.selectedFormat, formData.value.selectedSizes)
  } else {
    // 取消转换
    emit('cancel-convert')
  }
}
</script>

<template>
  <div class="file-convert">
    <el-form :model="formData" ref="formRef" label-position="top" label-width="80px">
      <el-form-item label="转换格式" prop="selectedFormat">
        <el-select v-model="formData.selectedFormat" placeholder="请选择格式" :disabled="isConverting || !hasSelectedFile" @change="handleFormatChange">
          <el-option v-for="format in appConfig.convertFormats" :key="format" :label="format" :value="format" />
        </el-select>
      </el-form-item>
      <el-form-item label="转换大小" prop="selectedSizes">
        <el-select
          v-model="formData.selectedSizes"
          placeholder="请选择大小"
          collapse-tags
          :disabled="isConverting || !hasSelectedFile"
          :multiple="formData.selectedFormat !== 'PNG'"
        >
          <el-option v-for="size in sizes" :key="size" :label="size" :value="size" />
        </el-select>
      </el-form-item>
    </el-form>

    <el-button 
        class="convert-btn"
        size="small"
        type="primary"
        :disabled="!hasSelectedFile"
        :icon="isConverting ? VideoPause : VideoPlay"
        @click="handleConvert"
    >
      {{ isConverting ? '暂停转换' : '开始转换' }}
    </el-button>
  </div>
</template>