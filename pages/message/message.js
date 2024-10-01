const eventBus = require("../../utils/eventBus")
Component({
data:{
    isLogin:false,//是否已经登录
    chatContentList:null,
    deleteTableShow:false,
    deletedGoodId:null,//被选中要删除的消息框
    noReadOrderVo:{noReadNum:0,content:'暂无订单消息',createTime:null},
    commentMsgVo:{noReadCount:0,userName:'暂无互动消息',createTime:null}
},
pageLifetimes:{
    show(){
        const tabbar= this.getTabBar()
        tabbar.setData({selected:2})
        tabbar.init()
    },
},
methods:{
    navToMsgView(e){
        const goodId=e.currentTarget.dataset.goodid
        const theOtherId=e.currentTarget.dataset.theotherid
        wx.navigateTo({url: `./msg-view/msg-view?theOtherId=${theOtherId}&goodId=${goodId}`})
    },
    updateChatMsgs(){
        const user=getApp().globalData.user
        getApp().chatContentService.getNoReadCount(user.userId)
        .then(res=>this.setData({chatContentList:res.data}))
    },
    updateOrderMsg(){
        const user=getApp().globalData.user
        getApp().orderService.getOrderMsgCount(user.userId)
        .then(res=>{
            this.setData({noReadOrderVo:res.data})})
    },
    updateCmMsg(){
        const user=getApp().globalData.user
        getApp().goodCommentService.getCmMsgCountVo(user.userId)
        .then(res=>{
            this.setData({commentMsgVo:res.data})})
    },
    onLoad(){
        //监听消息事件
        let chatMsgManage=(res)=>{this.updateChatMsgs()}
        let orderManage=(res)=>{this.updateOrderMsg()}
        let cmMsgManage=(res)=>{this.updateCmMsg()}
        eventBus.on('chatContentEvent','chatMsgManage',chatMsgManage)
        eventBus.on('orderEvent','orderManage',orderManage)
        eventBus.on('commentEvent','cmMsgManage',cmMsgManage)
    },
    onShow(){
        const user=getApp().globalData.user
        if(!user){
            this.setData({isLogin:false})
            return
        }
        if(!this.data.isLogin)
            this.setData({isLogin:true})
        this.updateChatMsgs()
        this.updateOrderMsg()
        this.updateCmMsg()
    },
    onUnLoad(){
        eventBus.off('chatContentEvent','chatMsgManage')
    },
    navToGoodDetail(e){
        const goodId=e.currentTarget.dataset.goodid
        wx.navigateTo({url: `../goods/good-detail/good-detail?goodId=${goodId}`})
       
    },
    navToMsgCenter(){
        wx.navigateTo({url: './msg-center/msg-center'})
    },
    navToCommentMsg(){
        wx.navigateTo({url:'../message/msg-comment/msg-comment'})
    },
    showDeleteTable(e){
        const goodId=e.currentTarget.dataset.goodid
        this.setData({deleteTableShow:true,deletedGoodId:goodId})
    },
    confirmDelete(){
        const userId=getApp().globalData.user.userId
        getApp().chatContentService.deleteMsg(userId,this.data.deletedGoodId).
        then(res=>this.updateChatMsgs())
        this.setData({deletedGoodId:null})

        // console.log(e)
    },
    cancelDelete(){
        this.setData({deleteTableShow:false,deletedGoodId:false})
    },
    navToLogin(){
        wx.navigateTo({url:'../user/user-login/user-login'})
    }
}
})