const http=require('../utils/promiseRequest.js')
module.exports={
  //提交表单
    postGood(obj){
        return http.request({
            url:'/good',
            method:'POST',
            data:obj,
        })
    },
    updateGood(goodId,obj){
        return http.request({url:`/good/${goodId}`,method:'PUT',data:obj})
    },
    getGoodPage(page,pageSize,categoryName=null){
        let url=`/good/no/${page}/${pageSize}`
        url+=categoryName!=null?`?categoryName=${categoryName}`:''
        return http.request({
           url
        })
    },
    getGoodDetailVo(goodId){
        return http.request({url:`/good/no/${goodId}`,method:'GET'})
    },
    getGoodListById(userId,status){
        const data={}
        if(status!=null)
            data.status=status
        return http.request({url:`/good/no/list/${userId}`,data, method:'GET'})
    },
    deleteGoodById(goodId){
        return http.request({url:`/good/${goodId}/good`,method:'DELETE'})
    }
}