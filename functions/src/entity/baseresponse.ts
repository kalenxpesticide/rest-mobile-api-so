export interface BaseResponse {
    code: number,
    message: String,
    data: any,
}

export const buildResponse = (data?: any, code?: number, message?: String) => {
    const res:BaseResponse = {
        code: code??0,
        message: message??"Success",
        data: data,
    }
    return res;
};