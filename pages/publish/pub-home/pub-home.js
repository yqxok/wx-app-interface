Component({
data:{
    show:false
},
pageLifetimes:{
    
    
},

methods:{
   
    onShow(){
        this.setData({show:true})
        const tabbar= this.getTabBar()
        tabbar.init()
        tabbar.setData({selected:1})
        // console.log('show')
        this.animate()
   
    },
    animate(){
        const animation = wx.createAnimation({
            duration: 1000, // 动画持续时间
            timingFunction: 'ease-in-out' // 动画效果
        });
        animation.translateY(-100).step();
        this.setData({
            animationData: animation.export() // 导出动画数据
        });
        // 重置位置后再位移
        setTimeout(() => {
            animation.translateY(0).step(); // 复位
            this.setData({
            animationData: animation.export()
            });
        }, 500); // 动画完成后复位的延迟时间
    },
    onHide(){
        // console.log('hide')
        // this.clearAnimation('#box')

        this.setData({show:false})
    },
    navToPublish(){
        if(!getApp().globalData.user)
             wx.navigateTo({url: '../../user/user-login/user-login'})
        else
            wx.navigateTo({url: '../publish'})
    }
   
}
})