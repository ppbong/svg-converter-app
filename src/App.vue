<script setup lang="ts">
import MainBoard from './components/MainBoard.vue'
</script>

<template>
  <el-container>
    <el-header>
      <h1>SVG Converter App</h1>
      <p>Convert SVG files to other formats such as PNG, ICO, and ICNS.</p>
    </el-header>
    <el-main>
      <MainBoard />
    </el-main>
    <el-footer>
      <p>Copyright &copy; 2025 SVG Converter App. All rights reserved.</p>
    </el-footer>
  </el-container>
</template>

<style scoped>
.el-container {
  width: 100%;
  height: 100vh;
  margin: 0 auto;
  background-color: #f0f4f8;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.el-header {
  height: 160px;
  background: linear-gradient(135deg, #367cf7 0%, #4facfe 100%);
  color: white;
  padding: 15px;
  text-align: center;
  box-shadow: 0 2px 10px rgba(54, 124, 247, 0.3);
}

.el-header h1 {
    font-size: 2.5rem;
    margin-bottom: 10px;
    font-weight: 700;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.el-header p {
    font-size: 1.1rem;
    opacity: 0.95;
}

.el-main {
    padding: 15px;
}

.el-footer {
    height: 80px;
    background-color: #4b79dc;
    color: white;
    padding: 20px;
    text-align: center;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
}
</style>
