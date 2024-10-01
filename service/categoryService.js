const http=require('../utils/promiseRequest.js')
module.exports={
    //category={pkId:'1213323'},可选参数
    getCategory(category){
        return  http.request({
            url:`/category`,
            method:'GET',
            data:category
        })
    },
    getCategoryByGoodId(goodId){
        return http.request({
            url:`/category/no/${goodId}`,
            method:'GET'
        })
    }
    
}