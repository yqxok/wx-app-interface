const config=require('../config.js')
const http=require('../utils/promiseRequest.js')
const timeUtil=require('../utils/TimeUtil')
module.exports={
    //转码
    decode(data){
        const type = Object.prototype.toString.call(data); // Uni8Array的原型对象被更改了所以使用字符串的信息进行判断。
        let str
        if(type ==="[object Uint8Array]"){
            str=decodeURIComponent(escape(String.fromCharCode.apply(null,data)))
        }else if(data instanceof ArrayBuffer){
            // 将ArrayBuffer转换为Uint8Array
            const uint8Array = new Uint8Array(data)
            str=decodeURIComponent(escape(String.fromCharCode.apply(null,uint8Array)))
        }
        return str
    },
    /**
     * 向ai发送消息，响应流数据
     * @param {message,history:[{type,content,id}]} aigcReq 
     */
    send(aigcReq,call=(res)=>{}){
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
        }).onChunkReceived(response=>{
            //回调
            call(this.decode( response.data))
        })
    },
    /**
     * 保存与ai聊天的消息
     * @param {userContent,aiContent,roomId} aiChatReq 
     */
    saveMsg(aiChatReq){
        return http.request({url:'/ai',method:'POST',data:aiChatReq})
    },
    /**
     * 创建会话房间
     */
    createRoom(){
       return http.request({url:'/aiRoom',method:'POST'})
    },
    /**
     * 获取与ai的聊天记录
     * @param {*} roomId 
     */
    getChats(roomId){
       return http.request({url:`/ai/${roomId}`,method:'GET'})
       .then(res=> new Promise((resolve,reject)=>{
           if(res.data.length!=0)
                timeUtil.convertTime(res.data)
            resolve(res)
       }))
    },
    /**
     * 获取会话列表
     */
    getRooms(){
        return http.request({url:'/aiRoom',method:'GET'})
        .then(res=>new Promise((resolve,reject)=>{
            if(res.data.length!=0)
                 timeUtil.convertTime(res.data)
             resolve(res)
        }))
    },
    /**
     * 更新会话房间名
     * @param {*} roomId 
     * @param {*} roomName 
     */
    updateRoomName(roomId,roomName){
        return http.request({url:`/aiRoom/${roomId}?roomName=${roomName}`,method:'PUT'})
    },
    /**
     * 删除会话房间
     * @param {*} roomId 
     */
    deleteRoom(roomId){
        return http.request({url:`/aiRoom/${roomId}`,method:'DELETE'})
    },
    /**
     * 总结会话内容
     * @param {content,type} messages 
     */
    summaryAi(messages,call=(res)=>{}){
        const token= wx.getStorageSync('token')
        var header={}
        if(token) header.token=token
       return wx.request({
            url: config.host+'/aiRoom/summary', // 流式接口的URL
            method: 'POST',
            data: messages,
            header,
            responseType:'text',
            enableChunked: true, // 开启流式传输模式
            success(res) {
              // 处理响应
            }
        }).onChunkReceived(response=>{
            //回调
            call(this.decode( response.data))
        })
    }
    
}