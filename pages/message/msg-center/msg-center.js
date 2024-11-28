// pages/message/msg-center/msg-center.js
Component({
data: {
    orderMsgs:{cursor:0,isEnd:false,list:[]}
},

/**
 * 组件的方法列表
 */
methods: {
    navBack(){
        wx.navigateBack()
    },
    onLoad(){
        this.requestData()
    },
    requestData(){
        const orderMsgs=this.data.orderMsgs
        if(orderMsgs.isEnd) return
        getApp().orderService.getOrderMsgs(orderMsgs.cursor,5)
        .then(res=>{
            orderMsgs.list.push(...res.data.list)
            orderMsgs.isEnd=res.data.isEnd
            orderMsgs.cursor=res.data.cursor
            this.setData({orderMsgs})
        })
    },
    navToOrderDetail(e){
        const orderId=e.currentTarget.dataset.orderid
        wx.navigateTo({url: `../../user/order-detail/order-detail?orderId=${orderId}`})
    },
    scrollToBottom(){
        this.requestData()
    },
    navToMsgView(e){
        const goodId=e.currentTarget.dataset.goodid
        const theOtherId=e.currentTarget.dataset.theotherid
        wx.navigateTo({url: `../msg-view/msg-view?userId=${theOtherId}&goodId=${goodId}`})
    }
}
})