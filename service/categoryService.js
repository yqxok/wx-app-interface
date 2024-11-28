const http=require('../utils/promiseRequest.js')
module.exports={
    /**
     * 获取分类
     * @param {*} category 
     */
    getCategory(category=null){
        const params={}
        if(category) params.pkId=category
        return  http.request({url:`/category`,method:'GET',data:params})
    },
    /**
     * 
     * @param {*} goodId 
     */
    getCategoryByGoodId(goodId){
        return http.request({
            url:`/category/${goodId}`,
            method:'GET'
        })
    }
    
}