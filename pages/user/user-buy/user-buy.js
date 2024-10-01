// pages/user/user-buy/user-buy.js
Component({
data: {
    ordersArr:[],//渲染数据
    dialogMsg:'',//弹窗提示消息
    item:null,//数据传递对象
    option:'',//取消订单or确认收货
    active:0//标签栏
},

/**
 * 组件的方法列表
 */
methods: {
    navBack(){
        wx.navigateBack()
    },
    onLoad(){
       this.updateOrders(null,0)
    },
    //拉取数据
    updateOrders(status,index){
        const userId=getApp().globalData.user.userId
        const sDto={userId,page:1,pageSize:8,isDeliverer:false}
        if(status!=null) sDto.status=status
        getApp().orderService.getSimpleOrderVos(sDto)
        .then(res=>this.setData({[`ordersArr[${index}]`]:res.data}))
    },
    navToOrderDetail(e){
        const orderId=e.currentTarget.dataset.orderid
        wx.navigateTo({url: `../order-detail/order-detail?orderId=${orderId}`})
    },
    navToMsgView(e){
        const goodId=e.currentTarget.dataset.goodid
        const theOtherId=e.currentTarget.dataset.theotherid
        wx.navigateTo({url: `../../message/msg-view/msg-view?theOtherId=${theOtherId}&goodId=${goodId}`})
    },
    swiperChange(e){
        let index=0
        if(e.detail.current||e.detail.current==0) index=e.detail.current
        else if(e.detail.index||e.detail.index==0) index=e.detail.index
        const ordersArr=this.data.ordersArr
        if(!ordersArr[index]){
            this.updateOrders(index==0?null:index-1,index)
        }
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
        let orderMsgDto
        if(option=='确认收货'){
             orderMsgDto=this.createOrderMsgDto(item,1,'您的商品已被确认收货')           
        }else if(option=='取消订单'){
             orderMsgDto=this.createOrderMsgDto(item,2,'您的商品订单已被取消')
        }
        const genericWsDto={uri:'/order',data:orderMsgDto}
        getApp().orderService.changeOrderStatus({orderId:item.orderId,status:orderMsgDto.status}).then(res=>{
            getApp().chatContentSocket.send({data:JSON.stringify(genericWsDto)})
            this.data.ordersArr=[]
            this.updateOrders(this.data.active==0?null:this.data.active-1,this.data.active)
            this.setData({deleteTableShow:false,dialogMsg:'',item:null,option:''})
        })
    },
    dialogCancel(){
        this.setData({deleteTableShow:false,dialogMsg:'',item:null,option:''})
    },
    createOrderMsgDto(item,status,content){
        let orderMsgDto={
            orderId:item.orderId,
            senderId:getApp().globalData.user.userId,
            receiverId:item.userId,
            status,
            content
        }
        return orderMsgDto
    },
}
})