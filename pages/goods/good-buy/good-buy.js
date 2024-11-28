const eventBus=require('../../../utils/eventBus')
Component({
observers:{
    leftEnabled:function(newVal) {
        console.log('fdfdf')
        this.setData({enableLeft:newVal})
    },
    rightEnabled:function (newVal) {
        console.log('fdfkkkk')
        this.setData({enableRight:newVal})
    },
    openLeft:function (newVal) {
        if(newVal){
            this.setData({enableRight:false})
        }else{
            this.setData({rightEnabled:true})
        }
    }
},
data:{
    goodDetailVo:null,
    // goodOrderDto:{
    //     number:1,
    //     totalPrice:0
    // },
    buyNum:1,
    totalPrice:0,
    buyTableShow:false,
    addressVo:null
},
lifetimes:{
    attached(){
        // this.bottomLeft= wx.getStorageSync('bottomLeft')
        // this.setData({bottomLeft:this.bottomLeft})
    }
},
methods:{
    onLoad(){
        getApp().addressService.getDefaultAddress()
        .then(res=>this.setData({addressVo:res.data}))
        const eventChannel = this.getOpenerEventChannel()
        eventChannel.on('goodBuyEvent',  (data)=>{
            this.setData({goodDetailVo:data.goodDetailVo,totalPrice:data.goodDetailVo.price})
        })
    },

    stepperChange(e){
        const num=e.detail
        const totalPrice=num*this.data.price
        this.setData({'buyNum':num,'totalPrice.':totalPrice})
    },
    buyGood(){
        this.setData({buyTableShow:true})
        
    },
    cancelBuy(){
        this.setData({buyTableShow:false})
    },
    confirmBuy(){
        // const goodOrderDto=this.createOrderDto()
        getApp().orderService.saveOrder(this.data.goodDetailVo.goodId,this.data.addressVo.addressId,this.data.buyNum)
        .then(res=>{
            
            wx.redirectTo({
                url: `../../user/order-detail/order-detail?orderId=${res.data}`,
            })
        })
    },
    navBack(){
        wx.navigateBack()
    },  
    // createOrderMsgDto(orderId){
    //     const goodDetailVo=this.data.goodDetailVo
    //     let orderMsgDto={}
    //     orderMsgDto.orderId=orderId
    //     orderMsgDto.senderId=getApp().globalData.user.userId
    //     orderMsgDto.receiverId=goodDetailVo.userId
    //     orderMsgDto.status=0
    //     orderMsgDto.content='您的商品已被拍下'
    //     return orderMsgDto
    // },
    navToAddress(){
        wx.navigateTo({url: '../../user/user-address/address-home/address-home?key=1'})//key-1获得地址信息
    }
}
})