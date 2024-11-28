const http=require('../utils/promiseRequest.js')
module.exports={
    /**
     * 请求用户地址页面
     * @param {*} cursor 
     * @param {*} pageSize 
     */
    getAddressList(cursor,pageSize){
       return http.request({url:`/address/${cursor}/${pageSize}`,method:'GET'})
    },
    /**
     * 保存地址
     * @param {addressId,dormitoryId,dormiNum,phoneNumber,receiver} addressDto 
     */
    saveAddress(addressDto){
        return http.request({url:`/address`,data:addressDto,method:'POST'})
    },
    /**
     * 更新地址
     * @param {*} addressDto 
     */
    updateAddress(addressDto){
        return http.request({url:`/address`,data:addressDto,method:'PUT'})
    },
    /**
     * 查询默认地址
     */
    getDefaultAddress(){
        return http.request({url:`/address/default`,method:'GET'})
    },
    setDefaultAddress(addressDto){
        return http.request({url:`/address/default`,method:'PUT',data:addressDto})
    },
    deleteAddress(addressId){
        return http.request({url:`/address/${addressId}`,method:'DELETE'})
    }
}