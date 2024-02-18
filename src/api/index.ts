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

export const uploadQiniu = (data: any, callBack?: (progress: any) => void) => {
    return request.request('POST', 'https://upload-z1.qiniup.com', {data}, callBack)
}

export const getQiniuData = (params: any) => {
    return request.get('/files/qiniuFiles', params)
}

export const deleteQiniuFile = (key: string) => {
    return request.delete('/files/qiniuFiles/' + key, {})
}

export const deleteSomeQiniuFile = (params: any) => {
    return request.post('/files/qiniuFiles/deleteSome', params)
}

export const editQiniuFileName = (params: any) => {
    return request.post('/files/qiniuFiles/editFileName', params)
}
