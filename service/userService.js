const http=require('../utils/promiseRequest.js')
module.exports={
    login(data){
        return http.request({url:'/user/no/lgByP',method:'POST',data})
    },
    signIn(data){
        return http.request({url:'/user/no/signIn',method:'POST',data})
    },
    updateUser(user){
        return http.request({url:`/user/${user.userId}`,method:'PUT',data:user})
    },
    getUser(userId){
        return http.request({url:`/user/no/${userId}`,method:'GET'})
    },
    getUserByToken(token){
        return http.request({url:'/user/no/token',method:'GET',data:{token}})
    },
    updateToken(token){
        return http.request({url:'/user/no/udToken',method:'GET',data:{token}})
    },
    getNoReadNum(userId){
        return http.request({url:`/user/noRead/${userId}`,method:'GET'})
    }

}