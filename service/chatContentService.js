const http=require('../utils/promiseRequest.js')
module.exports={
    //未读消息列表
    getNoReadCount(userId){
        return http.request({url:`/chatContent/unRead/${userId}`,method:'GET'})
    },
    getChatContentList(data){
        return http.request({url:`/chatContent`,method:'POST',data})
    },
    changeChatContentIsRead(ids){
        return http.request({url:'/chatContent',method:'PUT',data:ids})
    },
    deleteMsg(userId,goodId){
        return http.request({url:`/chatContent/${userId}/${goodId}`,method:'DELETE'})
    },
    // 未读消息数
    getUnReadNum(userId){
        return http.request({url:`/chatContent/${userId}/unReadNum`,method:'GET'})
    }
}   