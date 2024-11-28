const http=require('../utils/promiseRequest.js')
module.exports={
    /**
     * 发送评论
     * @param {*} goodId 
     * @param {*} content 
     */
    sendComment(goodId,content){
        return http.request({url:'/comment',method:'POST',data:{goodId,content}})
    },
    /**
     * 发送回复评论
     * @param {*} fatherId 
     * @param {*} replyId 
     * @param {*} content 
     */
    sendSonComment(fatherId,replyId,content){
        return http.request({url:'/comment/son',method:'POST',data:{fatherId,replyId,content}})
    },
    /**
     * 请求无登陆状态的评论页
     * @param {*} goodId 
     * @param {*} cursor 
     * @param {*} pageSize 
     */
    commentsNoLogin(goodId,cursor,pageSize){
        return http.request({url:`/comment/no/records`,data:{goodId,cursor,pageSize},method:'POSt'})
    },
    /**
     * 请求登录状态的评论页面
     * @param {*} goodId 
     * @param {*} cursor 
     * @param {*} pageSize 
     */
    comments(goodId,cursor,pageSize){
        return http.request({url:`/comment/records`,data:{goodId,cursor,pageSize},method:'POSt'})
    },
    /**
     * 请求未登录状态的子评论页面
     * @param {*} commentId 
     * @param {*} cursor 
     * @param {*} pageSize 
     */
    sonCommentsNoLogin(commentId,cursor,pageSize){
        return http.request({url:'/comment/no/sonRecords',data:{commentId,cursor,pageSize},method:'POST'})
    },
    /**
     * 请求登录状态的子评论页面
     * @param {*} commentId 
     * @param {*} cursor 
     * @param {*} pageSize 
     */
    sonComments(commentId,cursor,pageSize){
        return http.request({url:'/comment/sonRecords',data:{commentId,cursor,pageSize},method:'POST'})
    },
    /**
     * 查询互动消息房间
     */
    getCommentMsgRoom(){
        return http.request({url:'/cmMsg/room',method:'GET'})
    },
    /**
     * 查询互动页
     * @param {*} cursor 
     * @param {*} pageSize 
     */
    getCmMsgVoList(cursor,pageSize){
        return http.request({url:`/cmMsg/page`,method:'POSt',data:{cursor,pageSize}})
    },
    getCmMsgCountVo(userId){
        return http.request({url:`/cmMsg/noRead/${userId}`,method:'GET'})
    },
    getCmMsgVoPage(userId,page,pageSize){
        return http.request({url:`/cmMsg/${userId}/${page}/${pageSize}`,method:'GET'})
    },
    cmMsgRead(cmMsgIds){
        return http.request({url:'/cmMsg/read',method:'PUT',data:cmMsgIds})
    },
    /**
     * 用户点赞
     * @param {*} commentId 
     */
    saveGoodJob(commentId){
        return http.request({url:'/goodJob',method:'POST',data:{commentId}})
    },
    /**
     * 取消点赞
     * @param {*} commentId 
     */
    deleteGoodJob(commentId){
        return http.request({url:'/goodJob',method:'DELETE',data:{commentId}})
    }
}