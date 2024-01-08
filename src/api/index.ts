import request from '../axios'

export const upload = (params: any) => {
    return request.post('/files/uploadVercel', params)
}

export const getAllFile = (params: any) => {
    return request.get('/files/vercelFiles', params)
}

export const deleteFile = (id: string) => {
    return request.delete('/files/vercelFiles/' + id, {})
}

export const getUploadQiniuToken = () => {
    return request.get('/files/qiniuFiles/uploadToken', {})}

export const uploadQiniu = (data: any) => {
    return request.request('POST', 'https://upload-z1.qiniup.com', {data})
}

export const getQiniuData = () => {
    return request.get('/files/qiniuFiles', {})
}

export const deleteQiniuFile = (key: string) => {
    return request.delete('/files/qiniuFiles/' + key, {})
}
