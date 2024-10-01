const http=require('../utils/promiseRequest.js')
module.exports={
    getAddressList(userId){
       return http.request({url:`/address/${userId}`,method:'GET'})
    },
    saveAddress(userId,addressDto){
        return http.request({url:`/address/${userId}`,data:addressDto,method:'POST'})
    },
    updateAddress(addressId, addressDto){
        return http.request({url:`/address/${addressId}`,data:addressDto,method:'PUT'})
    },
    getDefaultAddress(userId){
        return http.request({url:`/address/${userId}/default`,method:'GET'})
    },
    setDefaultAddress(userId,addressId){
        return http.request({url:`/address/${userId}/${addressId}`,method:'PUT'})
    },
    deleteAddress(addressId){
        return http.request({url:`/address/${addressId}`,method:'DELETE'})
    }
}