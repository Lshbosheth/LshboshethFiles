import request from '../axios'

export const upload = (params: any) => {
    return request.post('/upload', params)
}

export const getAllFile = (params: any) => {
    return request.get('/fileManage', params)
}

export const deleteFile = (id: string) => {
    return request.delete('/fileManage/' + id, {})
}

export const getUploadQiniuToken = () => {
    return request.get('/qiniu/uploadToken', {})}

export const uploadQiniu = (data: any) => {
    return request.request('POST', 'https://upload-z1.qiniup.com', {data})
}

export const getQiniuData = () => {
    return request.get('/qiniu', {})
}

export const deleteQiniuFile = (key: string) => {
    return request.delete('/qiniu/' + key, {})
}
