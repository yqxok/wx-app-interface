const http=require('../utils/promiseRequest.js')
module.exports={
    /**
     * 购买商品
     * @param {*} goodId 
     * @param {*} addressId 
     * @param {*} buyNum 
     */
    saveOrder(goodId,addressId,buyNum){
        return http.request({url:'/order',data:{goodId,addressId,buyNum},method:'POST'})
    },
    /**
     * 查询订单详情
     * @param {*} orderId 
     */
    getGoodOrderVo(orderId){
        return http.request({url:`/order/${orderId}`,method:'GET'})
    },
    /**
     * 获取订单页面
     * @param {*} isBuyer 
     * @param {*} status 
     * @param {*} cursor 
     * @param {*} pageSize 
     */
    getOrderPage(isBuyer,status=-1,cursor,pageSize){
        return http.request({url:'/order/page',method:'POST',data:{isBuyer,status,cursor,pageSize}})
    },
     /**
     * 更改订单状态
     * @param {*} orderId 
     * @param {*} status 
     */
    changeOrderStatus(orderId,status){
        return http.request({url:'/order/status',method:'PUT',data:{orderId,status}})
    },
    /**
     * 删除订单
     * @param {*} orderId 
     */
    deleteOrder(orderId){
        return http.request({url:`/order/${orderId}`,method:'DELETE'})
    },
    /**
     * 查询订单消息页
     * @param {*} cursor 
     * @param {*} pageSize 
     */
    getOrderMsgs(cursor,pageSize){
        return http.request({url:`/orderMsg/page`,method:'POST',data:{cursor,pageSize}})
    },
    /**
     * 查询订单消息房间
     */
    getOrderMsgRoom(){
        return http.request({url:`/orderMsg/room`,method:'GET'})
    },
   
    // updateOrderReadStatus(orderId,status){
    //     return http.request({url:'/orderMsg/noRead',method:'PUT',data:{orderId,status}})
    // }
    
}