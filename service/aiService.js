const config=require('../config.js')
const http=require('../utils/promiseRequest.js')
module.exports={
    /**
     * 向ai发送消息，响应流数据
     * @param {message,history:[{type,content,id}]} aigcReq 
     */
    send(aigcReq){
        const token= wx.getStorageSync('token')
        var header={}
        if(token) header.token=token
       return wx.request({
            url: config.host+'/ai/generateStream', // 流式接口的URL
            method: 'POST',
            data: aigcReq,
            header,
            responseType:'text',
            enableChunked: true, // 开启流式传输模式
            success(res) {
              // 处理响应
            }
        });
    },
    /**
     * 保存与ai聊天的消息
     * @param {userContent,aiContent,roomId} aiChatReq 
     */
    saveMsg(aiChatReq){
        return http.request({url:'/ai',method:'POST',data:aiChatReq})
    },
    createRoom(){
       return http.request({url:'/aiRoom',method:'POST'})
    },
    getChats(roomId){
       return http.request({url:`/ai/${roomId}`,method:'GET'})
    },
    /**
     * 获取会话列表
     */
    getRooms(){
        return http.request({url:'/aiRoom',method:'GET'})
    }
    
}