// pages/user/user-sell/user-sell-detail/user-sell-detail.js
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
    goodOrderVo:{
        goodOrderId:'3249129279432312334',userId:'1242323',userName:'小司',number:2,profilePicUrl:'https://ts1.cn.mm.bing.net/th?id=OIP-C.beAa_Q4WmXiu-UAinuLB3gAAAA&w=250&h=250&c=8&rs=1&qlt=90&o=6&dpr=1.7&pid=3.1&rm=2',html:'大家好，我这里有一件几乎全新的连衣裙，现在寻找新主人。', totalPrice:78.00,status:1,goodId:'234534',picUrl:'https://cbu01.alicdn.com/img/ibank/2019/005/971/11156179500_1675166310.jpg',rAddress:'东莞理工学院 松山湖 莞博22栋 504',buyTime:'2024-08-02 12:00:00',payTime:'2024-08-02 12:01:13',dealTime:'2024-08-03 10:13:44'
    },
    isSellOrder:false
},

/**
 * 组件的方法列表
 */
methods: {
    navBack(){
        wx.navigateBack()
    },
    onLoad(option){
        const user=getApp().globalData.user
        getApp().orderService.getGoodOrderVo(option.orderId)
        .then(res=>this.setData({goodOrderVo:res.data,user}))
    }
}
})