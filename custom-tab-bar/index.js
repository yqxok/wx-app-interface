// components/my-tabbar/my-tabbar.js
const eventBus=require('../utils/eventBus')
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
    selected: 0,
    color: "black",
    // selectedColor: "#3cc51f",
    selectedColor:"#ece922",
    list: [{
        pagePath: "/pages/goods/goods",
        icon: "iconfont icon-shouye",
        // selectedIconPath: "/image/icon_component_HL.png",
        text: "首页"
    }, {
        pagePath: "/pages/publish/pub-home/pub-home",
        icon: "iconfont icon-fabu",
        // selectedIconPath: "/image/icon_API_HL.png",
        text: "发布"
    },{
        pagePath: "/pages/ai/ai",
        icon: "iconfont icon-xiaoxi",
        // selectedIconPath: "/image/icon_API_HL.png",
        text: "AI"
    },{
        pagePath: "/pages/message/message",
        icon: "iconfont icon-xiaoxi",
        // selectedIconPath: "/image/icon_API_HL.png",
        text: "消息"
    },{
        pagePath: "/pages/user/user",
        icon: "iconfont icon-geren",
        // selectedIconPath: "/image/icon_API_HL.png",
        text: "我的"
    }],
    listners:[],//监听器
    unReadNum:0
},

/**
 * 组件的方法列表
 */
methods: {
    init(){
        // console.log('dfdsf')
        this.updateUnReadCount()
        this.updateCount=(res)=>{
            this.updateUnReadCount()
        }
        eventBus.on('loginEvent','updateCount',this.updateCount)
        eventBus.on('chatContentEvent','updateCount',this.updateCount)
        eventBus.on('orderEvent','updateCount',this.updateCount)
        eventBus.on('commentEvent','updateCount',this.updateCount)
    },

    switchTab(e){
        const data = e.currentTarget.dataset
        const url = data.path
        if(this.data.listners[data.index]){
            console.log('执行listner')
            this.data.listners[data.index]()
        }
        // this.triggerEvent('tapTabBarEvent',{index:data.index})
        wx.switchTab({url})
    },
    updateUnReadCount(){
        const user=getApp().globalData.user
        if(user==null) return
        getApp().userService.getNoReadNum()
        .then(res=>this.setData({unReadNum:res.data}))
    },
    //监听tabbar点击事件
    addListner(func,index){
        this.data.listners[index]=func
    }
}
})