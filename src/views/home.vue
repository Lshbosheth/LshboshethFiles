<template>
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
      <el-upload
          drag
          multiple
          :on-change="uploadQiniuFile"
          :auto-upload="false"
          :show-file-list="false"
      >
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
      </el-upload>
      <el-button @click="createCatalogDialog = true">新建文件夹</el-button>


      <el-table :data="qiniuTableData" style="width: 100%">
        <el-table-column align="left" prop="key" label="文件名" >
          <template #default="scope">
            <div @click="folderDetail(scope.row)">
              {{scope.row.key}}
            </div>
          </template>
        </el-table-column>
        <el-table-column align="right" prop="mimeType" label="文件类型" />
        <el-table-column align="right" prop="fsize" label="文件大小" >
          <template #default="scope">
            {{scope.row.type == 'file' ? convertFileSize(scope.row.fsize) : ''}}
          </template>
        </el-table-column>
        <el-table-column align="center" fixed="right" label="Operations">
          <template #default="scope">
            <el-button v-if="scope.row.type == 'file'" link type="primary" size="small" @click="copy(scope.row)"
            >复制
            </el-button
            >

            <el-button v-if="scope.row.type == 'file'" link type="primary" size="small" @click="mdUrl(scope.row)"
            >md
            </el-button
            >

            <el-button link type="primary" size="small" @click="delQiniuFile(scope.row)"
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

      <el-dialog v-model="createCatalogDialog" title="新建目录">
        <el-form>
          <el-form-item label="目录名">
            <el-input v-model="catalogName" autocomplete="off" />
          </el-form-item>
        </el-form>
        <template #footer>
      <span class="dialog-footer">
        <el-button @click="createCatalogDialog = false">取消</el-button>
        <el-button type="primary" @click="createCatalogDialog = false;createCatalog()">
          创建
        </el-button>
      </span>
        </template>
      </el-dialog>
    </el-tab-pane>
  </el-tabs>

</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { UploadFilled } from '@element-plus/icons-vue'
import {getAllFile, upload, deleteFile, getQiniuData, uploadQiniu, deleteQiniuFile, getUploadQiniuToken} from '../api'
import type { TabsPaneContext } from 'element-plus'

let token = ref('')
let activeName = ref('vercel')
const handleClick = (tab: TabsPaneContext) => {
  activeName.value = <string>tab.paneName
  if(tab.paneName == 'qiqiu') {
    getQiniuFile()
  }else {
    getAllData()
  }
}

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
  let fileName = activeName.value === 'vercel' ? row.fileName : row.key;
  const response = await fetch(fileUrl);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  Object.assign(link.style, { display: 'none' });
  document.body.appendChild(link);
  link.click();

  // 清理
  setTimeout(() => {
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 0);
}

let qiniuTableData = ref()
const getQiniuFile = (requestBody: any = {}) => {
  getQiniuData(requestBody).then(res => {
    let data: any[] = []
    res.data.commonPrefixes && res.data.commonPrefixes.forEach((e:any) => {
      data.push({
        key: e,
        type: 'folder'
      })
    })
    res.data.items.forEach((e: any) => {
      if(e.fsize !== 0) {
        e.type = 'file'
        data.push(e)
      }
    })
    qiniuTableData.value = data
  })
}

const uploadQiniuFile = (file: any) => {
  let form = new window.FormData();
  form.append('file', file.raw)
  form.append('token', token.value)
  form.append('fname', file.name)
  form.append('key', file.name)
  uploadQiniu(form).then(() => {
    getQiniuFile()
  })
}

const delQiniuFile = (row: any) => {
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
        deleteQiniuFile(row.key).then(() => {
          getQiniuFile()
          ElMessage({
            message: '删除成功!',
            type: 'success',
          })
        })
      }).catch(() => {

  })

}

const copy = async (row: any) => {
  let url = 'https://oss.lshbosheth.cn/' + row.key
  try {
    await navigator.clipboard.writeText(url);
    ElMessage({
      message: '复制成功!',
      type: 'success',
    })
  } catch (err) {
    console.error('无法复制到剪贴板：', err);
  }
}

const mdUrl = async (row: any) => {
  let url = '![](' + 'https://oss.lshbosheth.cn/' + row.key + ')'
  try {
    await navigator.clipboard.writeText(url);
    ElMessage({
      message: '复制成功!',
      type: 'success',
    })
  } catch (err) {
    console.error('无法复制到剪贴板：', err);
  }
}

const createCatalogDialog = ref(false)
const catalogName = ref('')
const createCatalog = () => {
  console.log(catalogName.value)
  const file = {
    raw: '',
    name: catalogName.value + '/'
  }
  uploadQiniuFile(file)
}

const folderDetail = (row: any) => {
  if(row.type === 'folder') {
    getQiniuFile({prefix: row.key})
  }
}

const convertFileSize = (bytes: number = 0, decimals = 2)=>  {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

onMounted(() => {
  getAllData()
  getUploadQiniuToken().then(res => {
    token.value = res.data
  })
});
</script>

<style scoped>
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
