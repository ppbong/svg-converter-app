<template>
  <div class="main-board">
    <el-row :gutter="20" justify="space-evenly" style="margin-left: 0;">
      <el-col :span="8">
        <el-card>
          <template #header>
            <span>File Selector</span>
          </template>
        </el-card>
      </el-col>
       <el-col :span="8">
        <el-card>
          <template #header>
            <span>Converter</span>
          </template>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <template #header>
            <span>Preview</span>
          </template>
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
}
</style>