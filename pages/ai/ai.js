// pages/ai/ai-chat.js
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
    history:[{content:"我想要价格不高于50的英语书",createTime:''}],
    refresherTriggered:false
},
pageLifetimes:{
    show(){
        const tabbar= this.getTabBar()
        tabbar.setData({selected:2})
        tabbar.init()
        tabbar.addListner(()=>{
            this.setData({refresherTriggered:true})
            setTimeout(()=>{
                this.setData({refresherTriggered:false})
            },500)
        },2)
    },
},
/**
 * 组件的方法列表
 */
methods: {
    navToMsgAi(e){
        const roomId=e.currentTarget.dataset.roomid
        console.log(e)
        // e.currentTarget.data
        if(roomId)
            wx.navigateTo({url: `./ai-chat/ai-chat?roomId=${roomId}`})
        else
            wx.navigateTo({url: './ai-chat/ai-chat'})
    },
    onShow(){
        if(getApp().globalData.user)
            getApp().aiService.getRooms()
            .then(res=>this.setData({history:res.data}))
    },
    refresherTriggered(){
        setTimeout(() => {
            this.setData({refresherTriggered:false})
        }, 500);
    }
}
})