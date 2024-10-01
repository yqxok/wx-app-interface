// app.js
const config=require('./config.js')
const http=require('./service/http')
const eventBus=require('./utils/eventBus')
App({
    onError(error){
        console.log('全局捕获的异常：'+error)
    },
    onLaunch(){
        this.config=config
        this.initEvent()
        //获取屏幕信息
        this.initWindowInfo()
        
        //获取用户信息
        const token= wx.getStorageSync('token')
        if(token){
            this.userService.updateToken(token)
            .then(res=> wx.setStorage({key:'token',data:res.data}))
            this.userService.getUserByToken(token)
            .then(res=>{
                this.globalData.user=res.data
                //webSocket连接
                this.chatContentSocket=this.chatContentWs.connectChatContent()
            })
        }
    },
    onShow(){
        if(!this.chatContentSocket)//
            this.chatContentSocket=this.chatContentWs.connectChatContent()
    },
    initEvent(){
        const startWebSocket=()=>{
            if(!this.chatContentSocket)
                this.chatContentSocket=this.chatContentWs.connectChatContent()
        }
        const closeWebSocket=()=>{
            this.chatContentSocket.close()
            this.chatContentSocket=null
        }
        const wsClose=()=>{
            this.chatContentSocket=null
        }
        eventBus.on('loginEvent','startWebSocket', startWebSocket)
        eventBus.on('logoutEvent','closeWebSocket',closeWebSocket)
        eventBus.on('wsCloseEvent','wsClose',wsClose)

        // eventBus.on('userChangeEvent','userChange',userChange)
    },
    initWindowInfo(){
        this.windowInfo= wx.getWindowInfo()
        this.globalData.bottomLeft=this.windowInfo.screenHeight-this.windowInfo.safeArea.bottom
        // wx.setStorage({key:'bottomLeft',data:bottomLeft})//保存底部小黑条高度
        //状态栏高度
        this.globalData.statusH = wx.getSystemInfoSync().statusBarHeight
        this.globalData.menuInfo=wx.getMenuButtonBoundingClientRect()
        //胶囊高度
        this.globalData.navH = (this.globalData.menuInfo.top - this.globalData.statusH) * 2 + this.globalData.menuInfo.height;
    },
    globalData:{
        user:null
    },
    ...http
})
