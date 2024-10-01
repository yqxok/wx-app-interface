const http=require('../utils/promiseRequest.js')
module.exports={
  //提交表单
    postGoodComment(obj){
        return http.request({url:'/goodComment',method:'POST',data:obj})
    },
    getGoodComments(goodId,userId){
        const params={}
        if(userId!=null) params.userId=userId
        return http.request({url:`/goodComment/no/${goodId}`,data:params,method:'GET'})
    },
    getCmMsgVoList(userId){
        return http.request({url:`/cmMsg/${userId}`,method:'GET'})
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
    saveGoodJob(goodJobDto){
        return http.request({url:'/goodJob',method:'POST',data:goodJobDto})
    },
    deleteGoodJob(goodJobDto){
        return http.request({url:'/goodJob',method:'DELETE',data:goodJobDto})
    }
}