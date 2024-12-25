// pages/user/user-buy/user-buy.js
Component({
data: {
    deleteTableShow:false,
    ordersArr:[
        {cursor:0,isEnd:false,list:[]},
        {cursor:0,isEnd:false,list:[]},
        {cursor:0,isEnd:false,list:[]},
        {cursor:0,isEnd:false,list:[]}
    ],//渲染数据
    dialogMsg:'',//弹窗提示消息
    item:null,//数据传递对象
    option:'',//取消订单or确认收货
    active:0//标签栏
},
lifetimes:{
    attached(){
        this.msgTip=this.selectComponent('#msgTip')
    }
},
/**
 * 组件的方法列表
 */
methods: {
    navBack(){
        wx.navigateBack()
    },
    onShow(){
       this.getOrders(-1,0)
       this.getOrders(0,1)
       this.getOrders(1,2)
       this.getOrders(2,3)
    },
    //首次请求
    getOrders(status,index){
        // const cursorPage=this.data.ordersArr[index]
        getApp().orderService.getOrderPage(true,status,0,5)
        .then(res=>{
      
            // cursorPage=res.data.data
            this.setData({[`ordersArr[${index}]`]:res.data})
        })
    },
    //上滑更新数据
    updateOrders(status,index){
        const cursorPage=this.data.ordersArr[index]
        if(cursorPage.isEnd) return
        getApp().orderService.getOrderPage(true,status,cursorPage.cursor,5)
        .then(res=>{
            cursorPage.list.push(...res.data.list)
            cursorPage.isEnd=res.data.isEnd
            cursorPage.cursor=res.data.cursor
            this.setData({[`ordersArr[${index}]`]:cursorPage})
        })
    },
    navToOrderDetail(e){
        const orderId=e.currentTarget.dataset.orderid
        wx.navigateTo({url: `../order-detail/order-detail?orderId=${orderId}`})
    },
    navToUserHome(e){
        const userId=e.currentTarget.dataset.userid
        getApp().userService.getUser(userId)
        .then(res=>{
            wx.navigateTo({url: '../../user/user-home/user-home',
            success:(res1)=>{
                res1.eventChannel.emit('userHomeEvent', {user:res.data })
            }})
        })
    },
    navToMsgView(e){
        const goodId=e.currentTarget.dataset.goodid
        const theOtherId=e.currentTarget.dataset.theotherid
        wx.navigateTo({url: `../../message/msg-view/msg-view?userId=${theOtherId}&goodId=${goodId}`})
    },
    scrollToBottom(e){
        const index=e.currentTarget.dataset.index
        this.updateOrders(index-1,index)
    },
    swiperChange(e){
        let index=0
        if(e.detail.current||e.detail.current==0) index=e.detail.current
        else if(e.detail.index||e.detail.index==0) index=e.detail.index
        // const ordersArr=this.data.ordersArr
        // if(!ordersArr[index]){
        //     this.updateOrders(index==0?null:index-1,index)
        // }
        this.setData({active:index})
    },
    openDialog(e){
        const msg=e.currentTarget.dataset.msg
        const item=e.currentTarget.dataset.item
        const option=e.currentTarget.dataset.option
        this.setData({deleteTableShow:true,dialogMsg:msg,item,option})
    },
    dialogConfirm(e){
        const item=e.currentTarget.dataset.item
        const option=e.currentTarget.dataset.option
        if(option==='确认收货'){
            this.changeOrderStatus(item,1)           
        }else if(option==='取消订单'){
            this.changeOrderStatus(item,2)
        }else if(option==='删除订单'){
            this.deleteOrder(item)
        }
        
    },
    deleteOrder(item){
        getApp().orderService.deleteOrder(item.orderId)
        .then(res=>{
            this.msgTip.showTip({msg:'订单删除成功',warnType:false})
            this.onShow()
        })
    },
    changeOrderStatus(item,status){
        getApp().orderService.changeOrderStatus(item.orderId,status)
        .then(res=>{
            this.onShow()
        })
    },
    dialogCancel(){
        this.setData({deleteTableShow:false})
    }

}
})