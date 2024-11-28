const http=require('../utils/promiseRequest.js')
module.exports={
    /**
     * 用户是否收藏该商品
     * @param {*} goodId 
     */
    isCollected(goodId){
        return http.request({url:`/collect/${goodId}`})
    },
    /**
     * 查询用户收藏
     * @param {} cursor 
     * @param {*} pageSize 
     */
    getCollectVoList(cursor,pageSize){
        return http.request({url:'/collect/page',method:'POST',data:{cursor,pageSize}})
    },
    getCollectNum(userId,goodId){
        return http.request({url:`/collect/${userId}/${goodId}`,method:'GET'})
    },
    saveCollect(collectDto){
        return http.request({url:'/collect',method:'POST',data:collectDto})
    },
    /**
     * 取消收藏
     * @param {*} goodIds 
     */
    deleteCollect(goodIds){
        return http.request({url:`/collect`,method:'DELETE',data:goodIds})
    }
}