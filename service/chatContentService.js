const http=require('../utils/promiseRequest.js')
const timeUtil=require('../utils/TimeUtil')
module.exports={
    /**
     * 查询会话列表
     * @param {*} cursor 
     * @param {*} pageSize 
     */
    getContacts(cursor,pageSize){
        return http.request({url:`/contact/${cursor}/${pageSize}`,method:'GET'})
    },
    //未读消息列表
    getNoReadCount(userId){
        return http.request({url:`/chatContent/unRead/${userId}`,method:'GET'})
    },
   /**
    * 查询聊天记录
    * @param {*} userId 
    * @param {*} goodId 
    * @param {*} cursor 
    * @param {*} pageSize 
    */
    getChatContentList(userId,goodId,cursor,pageSize){
        return http.request({url:`/chatContent/records`,method:'POST',data:{userId,goodId,cursor,pageSize}}).then(res=>{
            if(res.data.list.length!=0)
                timeUtil.convertTime(res.data.list)
            return new Promise((resolve,reject)=>{
                resolve(res)
            })
        })
    },
    /**
     * 发送聊天消息
     * @param {sendUserId,receiveUserId,content,goodId} chatReq 
     */
    sendMsg(chatReq){
        return http.request({url:'/chatContent',method:'POST',data:chatReq})
    },
   /**
    * 消息已读
    * @param {*} goodId 
    * @param {*} otherId 
    */
    msgRead(goodId,otherId){
        return http.request({url:`/chatContent/${goodId}/${otherId}`,method:'PUT'})
    },
    /**
     * 删除会话
     * @param {*} contactId 
     */
    contactDelete(contactId){
        return http.request({url:`/contact/${contactId}`,method:'DELETE'})
    },
    changeChatContentIsRead(ids){
        return http.request({url:'/chatContent',method:'PUT',data:ids})
    },
    deleteMsg(userId,goodId){
        return http.request({url:`/contact/${userId}/${goodId}`,method:'DELETE'})
    },
    // 未读消息数
    getUnReadNum(userId){
        return http.request({url:`/chatContent/${userId}/unReadNum`,method:'GET'})
    }
}   