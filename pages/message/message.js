const eventBus = require("../../utils/eventBus")
Component({
data:{
    isLogin:false,//是否已经登录
    chatContentList:null,
    contacts:{cursor:0,isEnd:false,list:[]},
    deleteTableShow:false,
    refresherTriggered:false,//控制下拉刷新
    deletedGoodId:null,//被选中要删除的消息框
    orderMsgRoom:{noReadNum:0,content:'暂无订单消息',createTime:''},
    commentMsgRoom:{noReadNum:0,msg:'暂无互动消息',createTime:''}
},
pageLifetimes:{
    show(){
        const tabbar= this.getTabBar()
        tabbar.setData({selected:3})
        tabbar.init()
    },
},
methods:{
    navToMsgView(e){
        const item=e.currentTarget.dataset.item
        wx.navigateTo({url: `./msg-view/msg-view?goodId=${item.goodInfo.goodId}&userId=${item.userInfo.userId}`,
        success:(res)=>{
            if(item.noReadNum>0)
                getApp().chatContentService.msgRead(item.goodInfo.goodId,item.userInfo.userId)
                .then(res1=>{})
        }})
    },
   
    updateChatMsgs(){
        getApp().chatContentService.getContacts(0,20)
        .then(res=>{
            this.data.contacts=res.data
            this.setData({contacts:this.data.contacts})
        })
      
    },
    updateOrderMsg(){
        getApp().orderService.getOrderMsgRoom()
        .then(res=>{ this.setData({orderMsgRoom:res.data})})
    },
    updateCmMsg(){
        
        getApp().goodCommentService.getCommentMsgRoom()
        .then(res=>{
            this.setData({commentMsgRoom:res.data})})
    },
    //下拉刷新
    pullRefresh(){
        setTimeout(()=>{
            this.onShow()
            this.setData({refresherTriggered:false})
        } ,300)
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
        wx.navigateTo({url: './msg-center/msg-center',
        success:(res)=>{
            if(this.data.orderMsgRoom.noReadNum>0)
                getApp().userService.msgRead(1).then(res=>{})
        }})
    },
    navToCommentMsg(){
        wx.navigateTo({url:'../message/msg-comment/msg-comment',
        success:(res)=>{
            if(this.data.commentMsgRoom.noReadNum>0)
                getApp().userService.msgRead(0).then(res=>{})
        }})
    },
    showDeleteTable(e){
        const contactId=e.currentTarget.dataset.item.contactId
        this.setData({deleteTableShow:true,deleteContactId:contactId})
    },
    confirmDelete(){
        getApp().chatContentService.contactDelete(this.data.deleteContactId).
        then(res=>this.updateChatMsgs())
        this.setData({deleteContactId:null})
        
        // console.log(e)
    },
    cancelDelete(){
        this.setData({deleteTableShow:false,deletedGoodId:false})
    },
    navToLogin(){
        wx.navigateTo({url:'../user/user-login/user-login'})
    },
    scrollToBottom(){
        const contacts=this.data.contacts
        if(contacts.isEnd) return
        getApp().chatContentService.getContacts(contacts.cursor,20)
        .then(res=>{
            contacts.isEnd=res.data.isEnd
            contacts.list.push(...res.data.list)
            contacts.cursor=res.data.cursor
            this.setData({contacts})
        })
    }
}
})