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
    ordersArr:[],//渲染数据
    simpleOrderVoPage:null,
    active:0
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
    deleteOrder(){
        this.setData({deleteTableShow:true})
    },
    onLoad(){

        this.updateOrders(null,0)
    },
    //拉取数据
    updateOrders(status,index){
        const userId=getApp().globalData.user.userId
        const sDto={userId,page:1,pageSize:8,isDeliverer:true}
        if(status!=null) sDto.status=status
        getApp().orderService.getSimpleOrderVos(sDto)
        .then(res=>this.setData({[`ordersArr[${index}]`]:res.data}))
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
    navToMsgView(e){
        const goodId=e.currentTarget.dataset.goodid
        const theOtherId=e.currentTarget.dataset.theotherid
        wx.navigateTo({url: `../../message/msg-view/msg-view?theOtherId=${theOtherId}&goodId=${goodId}`})
    }
  
}
})