<script setup lang="ts">
import { ref, computed } from 'vue'
import { VideoPlay, VideoPause } from '@element-plus/icons-vue'

// 转换格式
type ConvertFormat = 'PNG' | 'ICO' | 'ICNS'
// 转换格式选项
const formats: ConvertFormat[] = ['PNG', 'ICO', 'ICNS']

// 转换格式支持的大小
const supportSizes = {
  PNG: ['16', '24', '32', '48', '64', '92', '128', '256', '512', '1024'],
  ICO: ['16', '24', '32', '48', '64', '128', '256'],
  ICNS: ['16', '32', '64', '128', '256', '512'],
}

// 默认选择转换大小
const defaultSizes = {
  PNG: '16',
  ICO: ['16'],
  ICNS: ['16', '32', '64', '128', '256', '512'],
}

// 定义组件属性
interface Props {
  // 是否有选中的SVG文件
  hasSelectedFile: boolean
  // 选中的SVG文件内容
  svgContent?: string
  // 选中的SVG文件名
  fileName?: string
}

// 定义事件
const emit = defineEmits<{
  // 开始转换
  (e: 'start-convert', format: ConvertFormat, sizes: string[], svgContent: string): void
  // 取消转换
  (e: 'cancel-convert'): void
}>()

// 获取组件属性
const props = defineProps<Props>()

interface FormData {
  selectedFormat: ConvertFormat
  selectedSizes: (string | string[])
}

// 表单数据
const formData = ref<FormData>({
  selectedFormat: 'PNG',
  selectedSizes: '16',
})

// 转换格式支持的大小选项
const sizes = computed(() =>  supportSizes[formData.value.selectedFormat])

// 处理格式改变
const handleFormatChange = () => {
  formData.value.selectedSizes = defaultSizes[formData.value.selectedFormat]
}

// 转换状态
const isConverting = ref(false)

// 处理转换
const handleConvert = () => {
  if (!props.hasSelectedFile || !props.svgContent) {
    return
  }
  
  isConverting.value = !isConverting.value

  if (isConverting.value) {
    // 开始转换，发送转换请求
    // 确保selectedSizes始终是数组格式
    const sizesToConvert = Array.isArray(formData.value.selectedSizes) 
      ? formData.value.selectedSizes 
      : [formData.value.selectedSizes]
    emit('start-convert', formData.value.selectedFormat, sizesToConvert, props.svgContent)
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
        <el-select v-model="formData.selectedFormat" placeholder="请选择格式" :disabled="isConverting" @change="handleFormatChange">
          <el-option v-for="format in formats" :key="format" :label="format" :value="format" />
        </el-select>
      </el-form-item>
      <el-form-item label="转换大小" prop="selectedSizes">
        <el-select
          v-model="formData.selectedSizes"
          placeholder="请选择大小"
          collapse-tags
          :disabled="isConverting"
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
        :icon="isConverting ? VideoPause : VideoPlay"
        @click="handleConvert"
    >
      {{ isConverting ? '暂停转换' : '开始转换' }}
    </el-button>
  </div>
</template>