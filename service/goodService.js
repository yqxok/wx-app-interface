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
     * cursor=0,pageSize,categoryName=null,leftHeight=0,rightHeight=0
     */
    /**
     * 
     * @param {*} req 
     */
    getGoodPage(req ){
        // const data={cursor,pageSize}
        // if(categoryName) data.categoryName=categoryName
        req.deviceWidth=345
        req.maxHeight=500
        return http.request({url:'/good/no/page',data:req,method:'POST'})
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
    getGoodListById(userId,status){
        var req={status,deviceWidth:345,maxHeight:500}
        return http.request({url:`/good/no/list/${userId}`,data:req, method:'POST'})
    },
    /**
     * 删除商品
     * @param {*} goodId 
     */
    deleteGoodById(goodId){
        return http.request({url:`/good/${goodId}`,method:'DELETE'})
    }
}