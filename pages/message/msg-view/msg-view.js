// pages/message/msg-view/msg-view.js
const eventBus=require('./../../../utils/eventBus')
const timeUtil=require('./../../../utils/TimeUtil')
Component({
data: {
    preHight:80,
    scrollTop:0,
    keyboardH:0,//键盘高度
    chats:{cursor:0,isEnd:false,list:[]},
    user:null,
    theOtherUser:{userName:'未知用户...'},
    goodId:null
   
},
lifetimes:{
    attached(){
        
    }
},
methods: {

    getChats(userId,goodId){
        const chats=this.data.chats
        if(chats.isEnd) return
        getApp().chatContentService.getChatContentList(userId,goodId,chats.cursor,20)
        .then(res=>{
            chats.list.push(...res.data.list)
            chats.isEnd=res.data.isEnd
            chats.cursor=res.data.cursor
            // timeUtil.convertTime(chats.list)
            this.setData({chats})
        })
    },
    onLoad(option){
        const user=getApp().globalData.user
        getApp().userService.getUser(option.userId).
        then(res=>this.setData({theOtherUser:res.data,user,goodId:option.goodId}))
        this.getChats(option.userId,option.goodId)
      
        
        //监听消息事件,包括
        this.chatWidget=(res)=>{
            if(res.goodId!=this.data.goodId) return
            const chats=this.data.chats
            //设置sendTime属性
            timeUtil.setSendTime(chats.list[0],res)
            chats.list.unshift(res)
            //将收到的新消息改为已读状态
            getApp().chatContentService.msgRead(option.goodId,option.userId)
            .then(res=>{})
            this.setData({chats})
        }
        eventBus.on('chatContentEvent','chatWidget',this.chatWidget)
        
    },
    scrollToTop(){
        this.getChats(this.data.theOtherUser.userId,this.data.goodId,null)
    },
    onUnload(){
        // console.log('')
        eventBus.off('chatContentEvent','chatWidget')
    },
    keyboardOpen(e){
        this.setData({keyboardH:e.detail.keyboardH})
    },
    keyboardClose(){
        this.setData({keyboardH:0})
    },
    navBack(){
        wx.navigateBack()
    },
    navToUserHome(e){
        const userId=e.currentTarget.dataset.userid
        getApp().userService.getUser(userId)
        .then(res=>{
            wx.navigateTo({url: '../../user/user-home/user-home',
            success:(res1)=>{
                res1.eventChannel.emit('userHomeEvent', {user:res.data })
            }})
        })
       
    },

    msgSend(e){
        const msg=e.detail.value
        if(msg==null||msg.trim()=='') return
        const chatReq={sendUserId:this.data.user.userId,
            receiveUserId:this.data.theOtherUser.userId,content:msg,
            goodId:this.data.goodId
        }
        getApp().chatContentService.sendMsg(chatReq)
        .then(res=>{
            //设置sendTime属性
            timeUtil.setSendTime(this.data.chats.list[0],res.data)
            this.data.chats.list.unshift(res.data)
            this.setData({chats:this.data.chats})
            // this.query.exec(res=>{})
        })
    }
}
})