// pages/user/user-sell/user-sell.js
Component({

/**
 * 组件的属性列表
 */
properties: {

},

/**
 * 组件的初始数据
 */
data: {
    deleteTableShow:false,
    ordersArr:[
        {cursor:0,isEnd:false,list:[]},
        {cursor:0,isEnd:false,list:[]},
        {cursor:0,isEnd:false,list:[]},
        {cursor:0,isEnd:false,list:[]}
    ],//渲染数据
    active:0,
    orderId:null,//选中要删除的订单id
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
    navToOrderDetail(e){
        const orderId=e.currentTarget.dataset.orderid
        wx.navigateTo({url: `../order-detail/order-detail?orderId=${orderId}`})
    },
    dialogConfirm(e){
        const orderId=this.data.orderId
        if(!orderId) return
        getApp().orderService.deleteOrder(orderId)
        .then(res=>{
            this.msgTip.showTip({msg:'删除成功',warnType:false})
            this.onLoad()
        })
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
    dialogCancel(){
        this.setData({deleteTableShow:false,orderId:null})
    },
    openDialog(e){
        const orderId=e.currentTarget.dataset.orderid
        this.setData({deleteTableShow:true,orderId})
    },
    onLoad(){
        this.loadOrders(-1,0)
        this.loadOrders(0,1)
        this.loadOrders(1,2)
        this.loadOrders(2,3)
    },
    //初次加载订单数据
    loadOrders(status,index){
        const cursorPage=this.data.ordersArr[index]
        getApp().orderService.getOrderPage(false,status,cursorPage.cursor,5)
        .then(res=>{
            cursorPage.list=res.data.list
            cursorPage.isEnd=res.data.isEnd
            cursorPage.cursor=res.data.cursor
            this.setData({[`ordersArr[${index}]`]:cursorPage})
        })
    },
    //拉取数据
    updateOrders(status,index){
        const cursorPage=this.data.ordersArr[index]
        if(cursorPage.isEnd) return
        getApp().orderService.getOrderPage(false,status,cursorPage.cursor,5)
        .then(res=>{
            cursorPage.list.push(...res.data.list)
            cursorPage.isEnd=res.data.isEnd
            cursorPage.cursor=res.data.cursor
            this.setData({[`ordersArr[${index}]`]:cursorPage})
        })
      
    },
    scrollToBottom(e){
        const index=e.currentTarget.dataset.index
        this.updateOrders(index-1,index)
    },
    swiperChange(e){
        let index=0
        if(e.detail.current||e.detail.current==0) index=e.detail.current
        else if(e.detail.index||e.detail.index==0) index=e.detail.index
       
        this.setData({active:index})
    },
    navToMsgView(e){
        const goodId=e.currentTarget.dataset.goodid
        const theOtherId=e.currentTarget.dataset.theotherid
        wx.navigateTo({url: `../../message/msg-view/msg-view?userId=${theOtherId}&goodId=${goodId}`})
    }
  
}
})