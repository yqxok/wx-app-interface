// pages/message/msg-comment/msg-comment.js
Component({
data: {
    cmMsgVoPage:{cursor:0,isEnd:false,list:[]}
},
methods: {
    onLoad(){
        this.requestData()
    },
    requestData(){
        const cmMsgVoPage=this.data.cmMsgVoPage
        if(cmMsgVoPage.isEnd) return
        getApp().goodCommentService.getCmMsgVoList(cmMsgVoPage.cursor,15)
        .then(res=>{
            cmMsgVoPage.list.push(...res.data.list)
            cmMsgVoPage.isEnd=res.data.isEnd
            cmMsgVoPage.cursor=res.data.cursor
            this.setData({cmMsgVoPage})
        })
    },
    scrollToBottom(){
        this.requestData()
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