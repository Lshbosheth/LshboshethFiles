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
    <el-table-column align="left" prop="fileName" label="文件名" />
    <el-table-column align="right" prop="fileType" label="文件类型" />
    <el-table-column align="right" prop="fileSize" label="文件大小" />
    <el-table-column align="center" fixed="right" label="Operations" width="120">
      <template #default="scope">
        <el-button link type="primary" size="small" @click="delFile(scope.row)"
        >删除
        </el-button
        >
      </template>
    </el-table-column>
  </el-table>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { UploadFilled } from '@element-plus/icons-vue'
import { getAllFile, upload, deleteFile } from '../api'
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

const delFile = (row: any) => {
  ElMessageBox.confirm(
      '是否要删除?',
      '确认',
      {
        distinguishCancelAndClose: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }
  )
      .then(() => {
        deleteFile(row.id).then(() => {
          getAllData()
          ElMessage({
            message: '删除成功!',
            type: 'success',
          })
        })
      }).catch(() => {

  })
}
</script>

<style scoped>
.uploadFileView {
  width: 100vw;
  height: 100px;
}
</style>
