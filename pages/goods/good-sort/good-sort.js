// pages/goods/good-sort/good-sort.js
Component({
data: {
    categoryName:'分类',
    goodList:null,
    skeletonLoading:true
},
methods: {
    onLoad(option){
        this.setData({categoryName:option.categoryName})
        this.getGoodList=()=>{
            getApp().goodService.getGoodPage(1,8,option.categoryName).
            then(res=>{
                res.data.isEnd=false//添加额外字段，表示商品是否已全部查询完毕
                this.setData({goodList:res.data,skeletonLoading:false})
            })
        }
        setTimeout(this.getGoodList,500)
    },
    navToGoodDetail(e){
        wx.navigateTo({url: `../good-detail/good-detail?goodId=${e.detail.goodDetail.goodId}`})
    },
    navToUserHome(e){
        const userId=e.detail.goodVo.userId
        getApp().userService.getUser(userId)
        .then(res=>{
            wx.navigateTo({url: '../../user/user-home/user-home',
            success:(res1)=>{
                res1.eventChannel.emit('userHomeEvent', {user:res.data })
            }})
        })
    },
    scrollToBottom(){
        const goodList=this.data.goodList
        if(goodList.isEnd) return
        let categoryName=this.data.categoryName
        if(categoryName=='推荐') categoryName=null
        getApp().goodService.getGoodPage(goodList.current+1,8,categoryName).then(res=>{
            goodList.records.push(...res.data.records)
            goodList.total=goodList.records.length
            goodList.current++;
            if(res.data.total<8) goodList.isEnd=true
            this.setData({goodList})
        }) 
    },
    navBack(){
        wx.navigateBack()
    }
}
})