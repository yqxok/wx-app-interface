const img='https://ts2.cn.mm.bing.net/th?id=OIP-C.RI2FeYMH3SSjEPgPgvQxGgAAAA&w=250&h=250&c=8&rs=1&qlt=90&o=6&dpr=1.7&pid=3.1&rm=2'
Component({
data:{
    goodExit:true,
    goodDetailVo:null,//商品信息
    goodCategories:[],//商品类别
    pageH:0,
    comments:[],//商品评论
    keyboardShow:false,
    allComment:false,
    deleteTableShow:false,//显示删除框
    marginBottom:0,//输入框底部距离
    inputFocus:false,//输入框聚焦
    isCollected:false//是否被收藏
},
lifetimes:{
    attached(){
        this.msgTip=this.selectComponent('#msgTip')
        // this.bottomLeft= 
        // this.setData({bottomLeft:getApp().globalData.bottomLeft})
    }
},
methods:{
    msgShow(){
        this.msgTip.showTip('点赞')
    },
    onLoad(e){
        const goodId=e.goodId
        const user=getApp().globalData.user
        getApp().goodService.getGoodDetailVo(goodId)
        .then(res=>{
            this.setData({goodDetailVo:res.data})
            //获取评论
            // getApp().goodCommentService.getGoodComments(goodId,user&&user.userId?user.userId:null)
            // .then(res=>this.setData({comments:res.data}))
            //请求分类
            getApp().categoryService.getCategoryByGoodId(goodId)
            .then(res=>this.setData({goodCategories:res.data}))
            if(user){
                getApp().collectService.getCollectNum(user.userId,goodId)
                .then(res=>this.setData({isCollected:res.data,user}))
            }
        }).catch(err=>{
            this.setData({goodExit:false})
        })
        
            
    },
    clickImg(){
        const picUrls=this.data.goodDetailVo.picUrls
        const imgs=picUrls.map(item=>item.url)
        wx.previewImage({urls: [...imgs],current:''})
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
    getCommentList(goodId,userId){
        getApp().goodCommentService.getGoodComments(goodId,userId)
        .then(res=>this.setData({comments:res.data}))
    },
    
    //goodCommentDto,commentId
   
    navBackToGoods(){
        if(this.data._comefromPub){
            this.data_comefromPub=false
            wx.switchTab({url: '../goods'})
        }else
            wx.navigateBack()
    },
    navToMsg(e){
        const user=getApp().globalData.user
        if(!user) return 
        const goodId=e.currentTarget.dataset.goodid
        const theOtherId=e.currentTarget.dataset.theotherid
        wx.navigateTo({url: `../../message/msg-view/msg-view?theOtherId=${theOtherId}&goodId=${goodId}`})
    },
    navToBuy(){
        const user=getApp().globalData.user
        if(!user) return 
        wx.navigateTo({url: '../good-buy/good-buy',
        success:(res)=>{
            res.eventChannel.emit('goodBuyEvent',{goodDetailVo:this.data.goodDetailVo})
        }})
    },
    navToPubEdit(e){
        const item=e.currentTarget.dataset.item
        wx.navigateTo({url:'../../publish/publish?key=1',
            success:(res)=>{
                res.eventChannel.emit('editToPublishEvent', { goodVo:item })
            }
        })
    },
    selectCollect(){
        const user=getApp().globalData.user
        if(!user) return 
        const isCollected=this.data.isCollected
        if(!isCollected){
            const collectDto={goodId:this.data.goodDetailVo.goodId,
                userId:getApp().globalData.user.userId}
            getApp().collectService.saveCollect(collectDto)
            .then(res=>{
                const collectNum=this.data.goodDetailVo.collectNum+1
                this.setData({isCollected:res.data,'goodDetailVo.collectNum':collectNum})
            })
        }else{
            getApp().collectService.deleteCollect(user.userId,[this.data.goodDetailVo.goodId])
            .then(res=>{
                const collectNum=this.data.goodDetailVo.collectNum-1
                this.setData({isCollected:res.data,'goodDetailVo.collectNum':collectNum})
            })
        }
        
    },
    requestCollect(){
        const user=getApp().globalData.user
        getApp().collectService.getCollectNum(user.userId,this.data.goodDetailVo.goodId)
        .then(res=>this.setData({collect:res.data}))
    },
    showDeleteTable(){
        this.setData({deleteTableShow:true})
    },
    confirmDelete(){
        getApp().goodService.deleteGoodById(this.data.goodDetailVo.goodId).
        then(res=>console.log(res))
        this.setData({curSelectedItem:null})
        // console.log(e)
    },
    cancelDelete(){
        this.setData({deleteTableShow:false})
    },
    
    
    closeComment(e){//评论输入框关闭
        this.setData({keyboardShow:false,})
    },
    allCommentShow(){
        this.setData({allComment:!this.data.allComment})
    },
    
    gJConfirm(e){
        const user=getApp().globalData.user
        if(!user) return
        const commentId=e.detail.commentId
        getApp().goodCommentService.saveGoodJob({commentId,userId:user.userId})
        .then(res=>{
            this.getCommentList(this.data.goodDetailVo.goodId,user.userId)
        })
        // this.setData({})
    },
    gJCancel(e){
        const user=getApp().globalData.user
        if(!user) return
        const commentId=e.detail.commentId
        getApp().goodCommentService.deleteGoodJob({commentId,userId:user.userId})
        .then(res=>{
            this.getCommentList(this.data.goodDetailVo.goodId,user.userId)
        })
    }
}
})