const http=require('../utils/promiseRequest.js')
module.exports={
    saveOrder(goodOrderDto){
        return http.request({url:'/goodOrder',data:goodOrderDto,method:'POST'})
    },
    getGoodOrderVo(orderId){
        return http.request({url:`/goodOrder/${orderId}`,method:'GET'})
    },
    getSimpleOrderVos(sDto){
        return http.request({url:'/goodOrder/simpleOrders',method:'POST',data:sDto})
    },
    changeOrderStatus(goodOrderDto){
        return http.request({url:'/goodOrder/status',method:'PUT',data:goodOrderDto})
    },
    getOrderMsgs(userId){
        return http.request({url:`/orderMsg/${userId}`,method:'GET'})
    },
    getOrderMsgCount(userId){
        return http.request({url:`/orderMsg/noRead/${userId}`,method:'GET'})
    },
    updateOrderReadStatus(orderMsgIds){
        return http.request({url:'/orderMsg/noRead',method:'PUT',data:orderMsgIds})
    }

}