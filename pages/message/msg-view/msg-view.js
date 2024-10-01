// pages/message/msg-view/msg-view.js
const eventBus=require('./../../../utils/eventBus')
Component({
data: {
    preHight:80,
    scrollTop:0,
    keyboardH:0,//键盘高度
    chattingRecords:[],
    user:null,
    theOtherUser:null,
    goodId:null,
    msgContent:''//设置消息输入框内容
},
lifetimes:{
    attached(){
        
    }
},
methods: {
    onLoad(option){
        //scroll-view滚动最下面
        this.query = wx.createSelectorQuery().in(this)
        this.query.select('.msg-scroll-container').boundingClientRect(res=>{
            this.setData({scrollTop:res.height*100})
        })
        
        const user=getApp().globalData.user
        getApp().chatContentService.getChatContentList({theOtherId:option.theOtherId,userId:user.userId,goodId:option.goodId})
        .then(res=>{
            this.setData({chattingRecords:res.data,user,goodId:option.goodId})
            //scroll-view滚动最下面
            this.query.exec(res=>{})
            // const index=res.data.length-1
            // this.setData({bottomLeft:this.bottomLeft,toView:`item${index}`})
            //未读消息改为已读
            const ids=res.data.filter(i=>!i.isRead&&i.receiveUserId==user.userId).map(i=>i.chatId)
            if(ids.length<1) return
            getApp().chatContentService.changeChatContentIsRead(ids)
            .then(res1=>console.log(res1))
        })
        getApp().userService.getUser(option.theOtherId).
        then(res=>this.setData({theOtherUser:res.data}))
        //监听消息事件,包括
        this.chatWidget=(res)=>{
            if(res.goodId!=this.data.goodId) return
            const chattingRecords=this.data.chattingRecords
            chattingRecords.push(res)
            //将收到的新消息改为已读状态
            if(res.receiveUserId===this.data.user.userId)
                getApp().chatContentService.changeChatContentIsRead([res.chatId])
                .then(res1=>console.log(res1))
            this.setData({msgContent:'',chattingRecords})
            this.query.exec(res=>{})
        }
        eventBus.on('chatContentEvent','chatWidget',this.chatWidget)
        
    },
    onUnload(){
        // console.log('')
        eventBus.off('chatContentEvent','chatWidget')
    },
    keyboardOpen(e){
        // console.log(e)
        // const index=this.data.chattingRecords.length-1//scroll-view滚动最下面
        this.query.exec(res=>{})
        this.setData({keyboardH:e.detail.keyboardH})
    },
    keyboardClose(){
        // const index=this.data.chattingRecords.messages.length-1
        this.query.exec(res=>{})
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
        let genericDto={
            uri:'/chatting',
            data:{sendUserId:this.data.user.userId,
                receiveUserId:this.data.theOtherUser.userId,content:msg,
                goodId:this.data.goodId
            }
        }
        getApp().chatContentSocket.send({data:JSON.stringify(genericDto)})
    }
}
})