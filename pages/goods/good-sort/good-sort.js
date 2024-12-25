// pages/goods/good-sort/good-sort.js
Component({
data: {
    categoryName:'分类',
    goodPage:{cursor:0,isEnd:true,list:[]},
    skeletonLoading:true
},
methods: {
    onLoad(option){
        this.setData({categoryName:option.categoryName})
        this.getGoodPage=()=>{
            getApp().goodService.getGoodPage({cursor:0,pageSize:8,categoryName:option.categoryName}).
            then(res=>{
                this.setData({goodPage:res.data,skeletonLoading:false})
            })
        }
        setTimeout(this.getGoodPage,300)
    },
    navToGoodDetail(e){
        wx.navigateTo({url: `../good-detail/good-detail?goodId=${e.detail.goodId}`})
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
        var goodPage=this.data.goodPage
        if(goodPage.isEnd) return
        let categoryName=this.data.categoryName
        if(categoryName=='推荐') categoryName=null
        getApp().goodService.getGoodPage({cursor:goodPage.cursor,pageSize:8,categoryName,
            leftHeight:goodPage.leftHeight,rightHeight:goodPage.rightHeight}).then(res=>{
                const list=[...goodPage.list,...res.data.list]
                const anotherList=[...goodPage.anotherList,...res.data.anotherList]
                goodPage=res.data
                goodPage.list=list
                goodPage.anotherList=anotherList
                this.setData({goodPage})
        }) 
    },
    navBack(){
        wx.navigateBack()
    }
}
})