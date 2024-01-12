<template>
  <el-breadcrumb :separator-icon="ArrowRight" class="breadcrumb">
    <el-breadcrumb-item v-for="path in pathList" @click="folderClick(path)">
      <template #default>
        <div :class="activeBreadcrumb === path.name ? 'activeBreadcrumbStyle' : ''">
          {{ path.name }}
        </div>
      </template>
    </el-breadcrumb-item>
  </el-breadcrumb>
  <div style="display: flex;gap: 30px">
    <el-button @click="createCatalogDialog = true">新建文件夹</el-button>
    <el-upload
        multiple
        :on-change="uploadQiniuFile"
        :auto-upload="false"
        :show-file-list="false"
    >
      <el-button type="primary">上传文件</el-button>
    </el-upload>
    <el-button :icon="Refresh" circle @click="getQiniuFile" />
  </div>

  <el-table :data="qiniuTableData" style="width: 100%">
    <el-table-column align="left" prop="key" label="文件名" >
      <template #default="scope">
        <div @click="folderDetail(scope.row)" style="display: flex" class="123">
          <SvgIcon :icon="setIcon(scope.row)" style="width: 20px;height: 20px" />
          <div style="display: flex;align-items: center;margin-left: 10px;">
            {{scope['row'].type == 'file' ? scope['row'].key.split('/')[scope['row'].key.split('/').length - 1] : scope['row'].key.split('/')[scope['row'].key.split('/').length - 2]}}
          </div>
        </div>
      </template>
    </el-table-column>
    <el-table-column align="right" prop="mimeType" label="文件类型" />
    <el-table-column align="right" prop="fsize" label="文件大小" >
      <template #default="scope">
        {{scope['row'].type == 'file' ? convertFileSize(scope['row'].fsize) : ''}}
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

        <el-button v-if="scope.row.key.indexOf('软件') < 0 || scope.row.type == 'file'" link type="primary" size="small" @click="delQiniuFile(scope.row)"
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
</template>
<script setup lang="ts">
import { ref, defineExpose } from "vue";
import { deleteQiniuFile, deleteSomeQiniuFile, getQiniuData, uploadQiniu } from "@/api";
import { ArrowRight, Refresh } from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { saveAs } from "file-saver";

let qiniuTableData = ref()
let pathList = ref([{name: '根目录', id: ''}])
const createCatalogDialog = ref(false)
const catalogName = ref('')
let activeBreadcrumb = ref('根目录')
let isLoad = ref(true)
const props = defineProps({
  activeName: {
    type: String,
    required: true
  },
  token: {
    type: String,
    default: ''
  }
});

const downFile = async (row: any) => {
  let fileUrl = props.activeName === 'vercel' ? row['fileUrl'] : 'https://oss.lshbosheth.cn/' + row.key;
  let fileName = props.activeName === 'vercel' ? row.fileName : row.key.split('/')[row.key.split('/').length - 1];
  saveAs(fileUrl, fileName)
}

const getQiniuFile = () => {
  const requestBody = {prefix: pathList.value[pathList.value.length - 1].id}
  getQiniuData(requestBody).then(res => {
    let data: any[] = []
    res.data['commonPrefixes'] && res.data['commonPrefixes'].forEach((e:any) => {
      data.push({
        key: e,
        type: 'folder'
      })
    })
    res.data.items.forEach((e: any) => {
      if(e['fsize'] !== 0) {
        e.type = 'file'
        data.push(e)
      }
    })
    qiniuTableData.value = data
    isLoad.value = true
  })
}

const uploadQiniuFile = (file: any) => {
  const path = pathList.value.slice(1).map((item: any) => item.id).join('');
  let form = new window.FormData();
  form.append('file', file.raw)
  form.append('token', props.token)
  form.append('fname', path + file.name)
  form.append('key', path + file.name)
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
      .then(async () => {
        if(row.type === 'file') {
          deleteQiniuFile(base64Encode(row.key)).then(() => {
            getQiniuFile()
            ElMessage({
              message: '删除成功!',
              type: 'success',
            })
          })
        }else {
          const { data } = await getQiniuData({prefix: row.key})
          deleteSomeQiniuFile({names: data.items.map((e: any) => e.key)}).then(() => {
            getQiniuFile()
            ElMessage({
              message: '删除成功!',
              type: 'success',
            })
          })
        }

      }).catch(() => {

  })

}

const base64Encode = (str: string)=> {
  const utf8Bytes = new TextEncoder().encode(str);
  const numbers = Array.from(utf8Bytes);
  return btoa(String.fromCharCode(...numbers));
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

const createCatalog = () => {
  const file = {
    raw: '',
    name: catalogName.value + '/'
  }
  uploadQiniuFile(file)
}

const folderClick = (path: any) => {
  activeBreadcrumb.value = path.name
  const index = pathList.value.findIndex(e => e.id === path.id)
  pathList.value = pathList.value.slice(0, index + 1)
  getQiniuFile()
}

const folderDetail = async (row: any) => {
  if(row.type === 'folder' && isLoad.value) {
    isLoad.value = false
    console.log(row);
    activeBreadcrumb.value = row.key.split('/')[row.key.split('/').length - 2]
    pathList.value.push({name: row.key.split('/')[row.key.split('/').length - 2], id: row.key})
    getQiniuFile()
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

const setIcon = (row: any) => {
  if(row.type == 'folder') {
    return 'icon-folder'
  }else if(row.key.indexOf('exe') > 0) {
    return 'icon-exe'
  }else if(row.key.indexOf('ttf') > 0) {
    return 'icon-ttf'
  }
}

defineExpose({
  getQiniuFile,
});
</script>
<style lang="scss" scoped>
.breadcrumb {
  height: 40px;
  line-height: 40px;
  margin-left: 10px;
}
.activeBreadcrumbStyle {
  color: #79bbff;
  font-weight: bold;
}
</style>
