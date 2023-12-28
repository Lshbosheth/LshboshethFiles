<template>
  <el-upload
      drag
      multiple
      :on-change="uploadFile"
      :auto-upload="false"
      :show-file-list="false"
  >
    <el-icon class="el-icon--upload"><upload-filled /></el-icon>
  </el-upload>
  <el-table :data="tableData" style="width: 100%">
    <el-table-column prop="fileName" label="文件名" />
    <el-table-column prop="fileType" label="文件类型" />
    <el-table-column prop="fileSize" label="文件大小" />
  </el-table>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { UploadFilled } from '@element-plus/icons-vue'
import { getAllFile, upload } from '../api'
const uploadFile = (e: any) => {
  console.log(e)
  let form = new window.FormData();
  form.append('file', e.raw)
  console.log(form);
  upload(form).then((res) => {
    console.log(res);
    getAllData()
  })
}
let tableData = ref()
const getAllData = () => {
  getAllFile({}).then(res => {
    console.log(res.data);
    tableData.value = res.data
  })
}
getAllData()
</script>

<style scoped>
.uploadFileView {
  width: 100vw;
  height: 100px;
}
</style>
