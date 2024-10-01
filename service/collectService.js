const http=require('../utils/promiseRequest.js')
module.exports={
    getCollectVoList(userId,page,pageSize){
        return http.request({url:`/collect/${userId}/${page}/${pageSize}`,method:'GET'})
    },
    getCollectNum(userId,goodId){
        return http.request({url:`/collect/${userId}/${goodId}`,method:'GET'})
    },
    saveCollect(collectDto){
        return http.request({url:'/collect',method:'POST',data:collectDto})
    },
    deleteCollect(userId, goodIds){
        return http.request({url:`/collect/${userId}`,method:'DELETE',data:goodIds})
    }
}