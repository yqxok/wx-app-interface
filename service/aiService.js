const config=require('../config.js')
const http=require('../utils/promiseRequest.js')
module.exports={
    /**
     * 向ai发送消息，响应流数据
     * @param {*} message 
     */
    send(message){
        const token= wx.getStorageSync('token')
        var header={}
        if(token) header.token=token
       return wx.request({
            url: config.host+'/ai/generateStream', // 流式接口的URL
            method: 'GET',
            data: {
              message
            },
            header,
            responseType:'text',
            enableChunked: true, // 开启流式传输模式
            success(res) {
              // 处理响应
            }
        });
    },
    sendMsg(message){
        return http.request({url:'/ai/generate',data:{message},method:'GET'})
    }
}