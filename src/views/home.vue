<template>
  <div class="title" data-tauri-drag-region>
    标题
    <span class="el-icon--close" style="color: white" @click="appWindow.minimize()">最小化</span>
    <span class="el-icon--close" style="color: white" @click="appWindow.toggleMaximize()">最大化</span>
    <span class="el-icon--close" style="color: white" @click="appWindow.close()">关闭</span>
  </div>
  <el-tabs v-model="activeName" class="tabs" @tab-click="handleClick">
    <el-tab-pane label="Vercel存储" name="vercel">
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

            <el-button v-if="scope.row.type == 'file'" link type="primary" size="small" @click="downFile(scope.row)"
            >下载
            </el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-tab-pane>
    <el-tab-pane label="七牛云存储" name="qiqiu">
      <qiniu-file-manage ref="qiniuFile" :token="token" :active-name="activeName"/>
    </el-tab-pane>
  </el-tabs>

</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { UploadFilled } from '@element-plus/icons-vue'
import {
  getAllFile,
  upload,
  deleteFile,
  getUploadQiniuToken,
} from '@/api'
import { ElMessageBox, ElMessage } from 'element-plus'
import type { TabsPaneContext } from 'element-plus'
import { saveAs } from 'file-saver'
import QiniuFileManage from "@/views/components/qiniuFileManage.vue";

let tableData = ref()
let token = ref('')
let activeName = ref('vercel')
const qiniuFile = ref()

const handleClick = (tab: TabsPaneContext) => {
  activeName.value = <string>tab.paneName
  if(tab.paneName == 'qiqiu') {
    if (qiniuFile.value && typeof qiniuFile.value.getQiniuFile === 'function') {
      qiniuFile.value.getQiniuFile();
    }
  }else {
    getAllData()
  }
}

const uploadFile = (e: any) => {
  let form = new window.FormData();
  form.append('file', e.raw)
  upload(form).then(() => {
    getAllData()
  })
}

const getAllData = () => {
  getAllFile({}).then(res => {
    tableData.value = res.data
  })
}

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

const downFile = async (row: any) => {
  let fileUrl = activeName.value === 'vercel' ? row.fileUrl : 'https://oss.lshbosheth.cn/' + row.key;
  let fileName = activeName.value === 'vercel' ? row.fileName : row.key.split('/')[row.key.split('/').length - 1];
  saveAs(fileUrl, fileName)
}

onMounted(() => {
  getAllData()
  getUploadQiniuToken().then(res => {
    token.value = res.data
  })
});

import { appWindow } from '@tauri-apps/api/window';

// const titleClick = () => {
//   appWindow.toggleMaximize()
// }
</script>

<style scoped>
.title {
  background-color: #19182C;
  height: 30px;
  width: 100%;
  color: white;
}
tabs > .el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}
.uploadFileView {
  width: 100vw;
  height: 100px;
}
</style>
