Component({
data: {
    host:null,
    user:null,
    img:'https://img.zcool.cn/community/01fc8555fe47136ac7251df821f27e.jpg@1280w_1l_2o_100sh.jpg'
},
pageLifetimes:{
    show(){
        const tabbar= this.getTabBar()
        tabbar.setData({selected:3})
        tabbar.init()
    },
},
methods:{
    onLoad(){
        this.setData({host:getApp().config.host})
    },
    onShow(){
        this.setData({user:getApp().globalData.user})
    },
    navToUserSetting(){
        if(!this.data.user)
            wx.navigateTo({url: '../user/user-login/user-login'})
        else
            wx.navigateTo({url: '../user/user-settting/user-settting'})
    },
    //跳转登录界面
    userLogin(e){
        if(this.data.user)
            wx.navigateTo({url:'./user-home/user-home',
            success:(res)=>{
                res.eventChannel.emit('userHomeEvent', {user:this.data.user })
            }
        })
        else    
            wx.navigateTo({ url: './user-login/user-login' })
    },
    //跳转地址界面
    navToAddress(){
        if(!this.data.user)
            wx.navigateTo({url: '../user/user-login/user-login'})
        else
            wx.navigateTo({url:'./user-address/address-home/address-home'})
    },
    navToMyPub(){
        if(!this.data.user)
            wx.navigateTo({url: '../user/user-login/user-login'})
        else
            wx.navigateTo({url: './user-pub/user-pub'})
    },
    navToMySell(){
        if(!this.data.user)
            wx.navigateTo({url: '../user/user-login/user-login'})
        else
            wx.navigateTo({url: './user-sell/user-sell'})
    },
    navToMyBuy(){
        if(!this.data.user)
            wx.navigateTo({url: '../user/user-login/user-login'})
        else
            wx.navigateTo({url: './user-buy/user-buy'})
    },
    navToMyCollect(){
        if(!this.data.user)
            wx.navigateTo({url: '../user/user-login/user-login'})
        else
            wx.navigateTo({url: './user-collect/user-collect'})
    }

},
lifetimes:{

}
})