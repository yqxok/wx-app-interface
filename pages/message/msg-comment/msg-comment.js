// pages/message/msg-comment/msg-comment.js
Component({
data: {
    cmMsgVoPage:{
        userName:'蔡徐坤',
        profilePicUrl:'http://10.61.117.240:7001/api/download/user/dab82aa8-ff6a-4513-9dd9-d0b7351d6240.jpg',
        content:'你好',
        createTime:'2024-9-1 12:00:00',
        picUrl:'http://10.61.117.240:7001/api/download/good/47fdbf62-42d9-426b-8520-ba3e11702d14.jpg'
    }
},
methods: {
    onLoad(){
        const user= getApp().globalData.user
        getApp().goodCommentService.getCmMsgVoPage(user.userId,1,8)
        .then(res=>{
            this.setData({cmMsgVoPage:res.data})
            const cmMsgIds=res.data.records.filter(i=>!i.isRead).map(i=>i.cmMsgId)
            if(cmMsgIds.length<1) return
            getApp().goodCommentService.cmMsgRead(cmMsgIds)
            .then(res=>console.log(res))
        })
    },
    navToGoodDetail(e){
        // console.log(e)
        const goodId=e.currentTarget.dataset.goodid
        wx.navigateTo({url: `../../goods/good-detail/good-detail?goodId=${goodId}`})
        // console.log(e)
    },
    navBack(){
        wx.navigateBack()
    }
}
})