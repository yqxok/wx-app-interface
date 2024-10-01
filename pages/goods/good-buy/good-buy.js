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
    goodOrderDto:{
        number:1,
        totalPrice:0
    },
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
        const user=getApp().globalData.user
        getApp().addressService.getDefaultAddress(user.userId)
        .then(res=>this.setData({addressVo:res.data}))
        const eventChannel = this.getOpenerEventChannel()
        eventChannel.on('goodBuyEvent',  (data)=>{
            this.setData({goodDetailVo:data.goodDetailVo,'goodOrderDto.totalPrice':data.goodDetailVo.price})
        })
    },

    stepperChange(e){
        const num=e.detail
        const totalPrice=num*this.data.goodDetailVo.price
        this.setData({'goodOrderDto.number':num,'goodOrderDto.totalPrice':totalPrice})
    },
    buyGood(){
        this.setData({buyTableShow:true})
        
    },
    cancelBuy(){
        this.setData({buyTableShow:false})
    },
    confirmBuy(){
        const goodOrderDto=this.createOrderDto()
        getApp().orderService.saveOrder(goodOrderDto)
        .then(res=>{
            const orderMsgDto=this.createOrderMsgDto(res.data)
            let genericWsDto={
                uri:'/order',
                data:orderMsgDto
            }
            getApp().chatContentSocket.send({data:JSON.stringify(genericWsDto)})
            wx.redirectTo({
                url: `../../user/order-detail/order-detail?orderId=${res.data}`,
            })
        })
    },
    navBack(){
        wx.navigateBack()
    },  
    createOrderDto(){
        const goodDetailVo=this.data.goodDetailVo
        const addressVo=this.data.addressVo
        if(addressVo==null){
            wx.showToast({
                title: '请选择地址',
                icon:'error'
            })
            throw new Error('选择地址')
        } 
        let goodOrderDto=this.data.goodOrderDto
        goodOrderDto.rAddress=addressVo.school+' '+addressVo.zone+' '+addressVo.dormiName+' '+addressVo.dormiNum
        goodOrderDto.status=0
        goodOrderDto.goodId=goodDetailVo.goodId
        goodOrderDto.delivererId=goodDetailVo.userId
        goodOrderDto.html=goodDetailVo.html.substring(0,30)
        goodOrderDto.picUrl=goodDetailVo.picUrls[0].url
        goodOrderDto.price=goodDetailVo.price
        goodOrderDto.receiver=addressVo.receiver
        goodOrderDto.phoneNumber=addressVo.phoneNumber
        goodOrderDto.receiverId=getApp().globalData.user.userId
        return goodOrderDto
    },
    createOrderMsgDto(orderId){
        const goodDetailVo=this.data.goodDetailVo
        let orderMsgDto={}
        orderMsgDto.orderId=orderId
        orderMsgDto.senderId=getApp().globalData.user.userId
        orderMsgDto.receiverId=goodDetailVo.userId
        orderMsgDto.status=0
        orderMsgDto.content='您的商品已被拍下'
        return orderMsgDto
    },
    navToAddress(){
        wx.navigateTo({url: '../../user/user-address/address-home/address-home?key=1'})//key-1获得地址信息
    }
}
})