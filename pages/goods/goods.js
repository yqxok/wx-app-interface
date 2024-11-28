var behavior=require('./behavior')
const commonApi=require('../../utils/common')
Component({
behaviors:[behavior],
pageLifetimes:{
    show(){
        const tabbar= this.getTabBar()
        tabbar.setData({selected:0})
        tabbar.init()
    },
},
data:{
    pageH:commonApi.getWindowH(),
    config:getApp().config,
    categoryBar:{
        changeCateogry:false,
        selected:0
    },
    swiperHeight:400,
    categoryHeight:160,
    categoryBarHeight:80,//是分类栏的一半
    scrollTop:0,//外层scroll滚动
    scrollTop1:0,//内层scroll
    goodShowHeight:0,//swiper高度
    statusH:0,//状态栏高度
    isRefreshing:true,//是否刷新
    skeletonLoading:true,
    startScroll:false,//内层scroll是否能够滚动
    goodCategories:[{name:'推荐'}, {name:'数码',class:'iconfont icon-shuma'},
    {name:'书籍',class:'iconfont icon-shuji'},{name:'户外',class:'iconfont icon-zihangche'},
    {name:'日用',class:'iconfont icon-riyongpin'},{name:'服饰',class:'iconfont icon-fushilei'}]
},
lifetimes:{
    attached(){
        const statusH = wx.getSystemInfoSync().statusBarHeight
        this.windowInfo=getApp().windowInfo
        
        const targetH=(this.data.swiperHeight+this.data.categoryBarHeight+30)/750*this.windowInfo.windowWidth
        this.setData({statusH,targetH})
        // app.goodService.getGoodPage(1,8)
        // .then(res=>this.setData({goodList:res.data}))
    }
},
methods:{
    
    onLoad(){
        const getGoods=()=>{
            getApp().goodService.getGoodPage(0,8).
            then(res=>{
                res.data.isEnd=false//添加额外字段，表示商品是否已全部查询完毕
                this.setData({skeletonLoading:false,goodPage:res.data})
            })
        }
        const tabbar=this.getTabBar()
        tabbar.init()
        tabbar.addListner(()=>{
           this.setData({skeletonLoading:true,scrollTop:0,scrollTop1:0,'categoryBar.selected':0})
           setTimeout(getGoods,500)
        },0)
       
        getGoods()
        const observer=wx.createIntersectionObserver(this)
        observer.relativeTo('.titleBar')
        .observe('.hiddenBar',(res)=>{
            if(res.intersectionRatio>0&&!this.data.categoryBar.changeCateogry)
                this.setData({'categoryBar.changeCateogry':true,startScroll:true})
            else if(res.intersectionRatio==0&&this.data.categoryBar.changeCateogry)
                this.setData({'categoryBar.changeCateogry':false,startScroll:false})
        })
    },
    
    //进入商品详情页
    navToGoodDetail(e){
        wx.navigateTo({url: `./good-detail/good-detail?goodId=${e.detail.goodId}`})
    },
    navToUserHome(e){
        const userId=e.detail.userId
        getApp().userService.getUser(userId)
        .then(res=>{
            wx.navigateTo({url: '../user/user-home/user-home',
            success:(res1)=>{
                res1.eventChannel.emit('userHomeEvent', {user:res.data })
            }})
        })
        
    },
    navToCategory(e){
        const categoryName=e.currentTarget.dataset.item.name
        wx.navigateTo({
          url: `./good-sort/good-sort?categoryName=${categoryName}`,
        })
    },
    goodShowHeightEvent(e){
        this.setData({goodShowHeight:e.detail.height+50})
    },
    pageChangeEvent(e){
        const cur=e.detail.current
        this.setData({'categoryBar.selected':cur})
    },

    scrollToBottom(){

        const goodPage=this.data.goodPage
        if(goodPage.isEnd) return
        let categoryName=this.data.goodCategories[this.data.categoryBar.selected].name
        if(categoryName=='推荐') categoryName=null
        getApp().goodService.getGoodPage(goodPage.cursor,8,categoryName).then(res=>{
            goodPage.list.push(...res.data.list)
            goodPage.isEnd=res.data.isEnd
            goodPage.cursor=res.data.cursor
            this.setData({goodPage})
        }) 
    },
    tapCateogry(e){
        const index=e.currentTarget.dataset.index
        if(index==this.data.categoryBar.selected) return
        this.setData({'categoryBar.selected':index,skeletonLoading:true})
        let categoryName=this.data.goodCategories[index].name
        if(categoryName=='推荐')
            categoryName=null
        const getGoodList=()=>{
            getApp().goodService.getGoodPage(0,8,categoryName).
            then(res=>{
                this.setData({goodPage:res.data,skeletonLoading:false,scrollTop1:0})
            })
        }
        setTimeout(getGoodList,500)
        
   
    }
}
})