// pages/message/msg-center/msg-center.js
Component({
data: {
    orderMsgs:{
        profilePicUrl:'http://10.61.117.240:7001/api/download/user/dab82aa8-ff6a-4513-9dd9-d0b7351d6240.jpg',
        html:'大家好，我是练习时长两年半的个人练习生蔡徐坤',
        userName:'蔡徐坤',
        createTime:'2024-08-20 20:26:50',
        picUrl:'http://10.61.117.240:7001/api/download/good/97dab8ef-9a6d-4f51-829e-8e186a0244f5.jpg'
    }
},

/**
 * 组件的方法列表
 */
methods: {
    navBack(){
        wx.navigateBack()
    },
    onLoad(){
        const userId=getApp().globalData.user.userId
        getApp().orderService.getOrderMsgs(userId)
        .then(res=>{
            this.setData({orderMsgs:res.data})
            const orderMsgIds=res.data.filter(item=>item.isRead==false).map(i=>i.orderMsgId)
            if(orderMsgIds==null||orderMsgIds.length<1) return
            getApp().orderService.updateOrderReadStatus(orderMsgIds)
            .then(res=>console.log(res))
        })
    },
    navToOrderDetail(e){
        const orderId=e.currentTarget.dataset.orderid
        wx.navigateTo({url: `../../user/order-detail/order-detail?orderId=${orderId}`})
    },
    navToMsgView(e){
        const goodId=e.currentTarget.dataset.goodid
        const theOtherId=e.currentTarget.dataset.theotherid
        wx.navigateTo({url: `../msg-view/msg-view?theOtherId=${theOtherId}&goodId=${goodId}`})
    }
}
})