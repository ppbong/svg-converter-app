<script setup lang="ts">
import { ref } from 'vue'
import type { UploadFile, UploadFiles } from 'element-plus'
import { UploadFilled } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

interface Props {
  isConverting: boolean
}

// 获取组件属性
const props = defineProps<Props>()

// 定义事件
const emit = defineEmits<{
  // 选中文件
  (e: 'file-selected', fileContent: string, fileName: string): void
  // 删除文件
  (e: 'file-deleted'): void
}>()

const fileSelected = ref('')
const fileName = ref('')

const handleFileChange = (file: UploadFile, _files: UploadFiles) => {
    // 获取文件名
    fileName.value = file.name
    // 提取文件扩展名
    const fileExtension = file.name.substring(file.name.lastIndexOf('.') + 1).toLowerCase()
    // 获取文件MIME类型
    const fileType = file.raw?.type || ''
    
    // 验证文件类型
    if (fileExtension !== 'svg' || fileType !== 'image/svg+xml') {
        // 不是SVG文件，显示错误信息并清空
        ElMessage.error('请选择SVG格式的文件')
        // 清空文件
        if (fileSelected.value) {
            URL.revokeObjectURL(fileSelected.value)
            fileSelected.value = ''
        }
        return
    }
    
    // 是SVG文件，继续处理
    const reader = new FileReader()
    reader.onload = (e) => {
        const svgContent = e.target?.result as string
        // 解析SVG并修改尺寸
        const parser = new DOMParser()
        const svgDoc = parser.parseFromString(svgContent, 'image/svg+xml')
        const svgElement = svgDoc.querySelector('svg')
        if (svgElement) {
            svgElement.setAttribute('width', '128')
            svgElement.setAttribute('height', '128')
        }
        // 重新创建SVG字符串
        const serializer = new XMLSerializer()
        const modifiedSvgContent = serializer.serializeToString(svgDoc)
        // 创建新的Blob对象
        const blob = new Blob([modifiedSvgContent], { type: 'image/svg+xml' })
        fileSelected.value = URL.createObjectURL(blob)
        
        // 发送选中文件事件
        emit('file-selected', modifiedSvgContent, fileName.value)
    }

    reader.readAsText(file.raw as Blob)
}

const handleFileDelete = () => {
    if (fileSelected.value) {
        URL.revokeObjectURL(fileSelected.value)
        fileSelected.value = ''
        fileName.value = ''
        
        // 发送删除文件事件
        emit('file-deleted')
    }
}
</script>

<template>
  <div class="file-select">
    <div class="file-preview" v-show="fileSelected">
        <img :src="fileSelected" alt="file preview">
        <div class="file-info">
            <p>文件名: {{ fileName }}</p>
        </div>
        <el-button type="primary" @click="handleFileDelete" :disabled="isConverting">重新选择</el-button>
    </div>
    <div class="file-upload" v-show="!fileSelected">
      <el-upload
        class="file-uploader"
        action="#"
        accept=".svg"
        drag
        :show-file-list="false"
        :auto-upload="false"
        :on-change="handleFileChange"
        >
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">Drag SVG file here or <em>click to upload</em></div>
      </el-upload>
    </div>
  </div>
</template>

<style scoped>
.file-select {
    width: 100%;
    height: 100%;
}

.file-preview {
    width: 100%;
    height: 300px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    position: relative;
}

.file-preview img {
    width: 128px !important;
    height: 128px !important;
    max-width: 128px !important;
    max-height: 128px !important;
    object-fit: contain;
    object-position: center;
    display: block !important;
    flex-shrink: 0;
}
</style>