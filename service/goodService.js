const http=require('../utils/promiseRequest.js')
module.exports={
    /**
     * 发布商品
     * @param {*} goodDto 
     */
    postGood(goodDto){
        return http.request({ url:'/good', method:'POST',data:goodDto,})
    },
    /**
     * 更新商品信息
     * @param {*} goodDto 
     */
    updateGood(goodDto){
        return http.request({url:`/good`,method:'PUT',data:goodDto})
    },
    /**
     * 无需登录，获取商品游标页
     * @param {*} cursor 
     * @param {*} pageSize 
     * @param {*} categoryName 
     */
    getGoodPage(cursor=0,pageSize,categoryName=null){
        const data={cursor,pageSize}
        if(categoryName) data.categoryName=categoryName
        return http.request({url:'/good/no/page',data,method:'POST'})
    },
    /**
     * 无需登录，获取商品详情
     * @param {*} goodId 
     */
    getGoodDetailVo(goodId){
        return http.request({url:`/good/no/${goodId}`,method:'GET'})
    },
    /**
     * 获取用户发布的商品
     * @param {*} userId 
     * @param {*} status 
     */
    getGoodListById(userId,status=null){
        const data={}
        if(status!=null) data.status=status
        return http.request({url:`/good/no/list/${userId}`,data, method:'GET'})
    },
    /**
     * 删除商品
     * @param {*} goodId 
     */
    deleteGoodById(goodId){
        return http.request({url:`/good/${goodId}`,method:'DELETE'})
    }
}