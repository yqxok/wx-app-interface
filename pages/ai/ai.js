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
    refresherTriggered:false,
    deleteTableShow:false,//显示删除框
    _deleteRoomId:null//要删除的room
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
        const roomName=e.currentTarget.dataset.roomname
        console.log(e)
        // e.currentTarget.data
        if(roomId)
            wx.navigateTo({url: `./ai-chat/ai-chat?roomId=${roomId}&roomName=${roomName}`})
        else
            wx.navigateTo({url: './ai-chat/ai-chat'})
    },
    onShow(){
        if(getApp().globalData.user)
            getApp().aiService.getRooms()
            .then(res=>this.setData({history:res.data}))
    },
    deleteRoom(e){
        const roomId= e.currentTarget.dataset.roomid
        this.data._deleteRoomId=roomId
        this.setData({deleteTableShow:true})
    },
    confirmDelete(){
        if(!this.data._deleteRoomId){
            this.setData({deleteTableShow:true}) 
            return
        }
        getApp().aiService.deleteRoom(this.data._deleteRoomId)
        .then(res=>{
            this.onShow()
        })  
    },
    cancelDelete(){
        this.data._deleteRoomId=null
        this.setData({deleteTableShow:false})
    }
   
}
})