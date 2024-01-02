import request from '../axios'

export const upload = (params: any) => {
    return request.post('/upload', params)
}

export const getAllFile = (params: any) => {
    return request.get('/file-manage', params)
}
