const http=require('../utils/promiseRequest.js')
module.exports={
    login(data){
        return http.request({url:'/user/no/lgByP',method:'POST',data})
    },
    
    signIn(data){
        return http.request({url:'/user/no/signIn',method:'POST',data})
    },
    /**
     * 更新用户信息
     * @param {*} user 
     */
    updateUser(user){
        return http.request({url:`/user`,method:'PUT',data:user})
    },
    /**
     * 无需登录，查询用户信息
     * @param {*} userId 
     */
    getUser(userId){
        return http.request({url:`/user/no/${userId}`,method:'GET'})
    },
    /**
     * 使用token查询用户信息
     * @param {*} token 
     */
    getUserByToken(token){
        return http.request({url:'/user/no/token',method:'GET',data:{token}})
    },
    /**
     * 更新token
     * @param {*} token 
     */
    updateToken(token){
        return http.request({url:'/user/no/udToken',method:'GET',data:{token}})
    },
    /**
     * 查看用户的未读消息数
     */
    getNoReadNum(){
        return http.request({url:'/msgRoom',method:'GET'})
    },
    /**
     * 消息已读，0评论消息，1订单消息
     * @param {*} type 
     */
    msgRead(type){
        return http.request({url:'/msgRoom',method:'PUT',data:{type}})
    }

}