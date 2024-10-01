const app=getApp()
Component({
data:{
    user:null,
    mySelf:null,
    background:'https://ts4.cn.mm.bing.net/th?id=OIP-C.xffq1npGsVo7qNo2HdMttgHaEo&w=316&h=197&c=8&rs=1&qlt=90&o=6&dpr=1.7&pid=3.1&rm=2',
    current:0,
    noSellGoods:{orders:[]},
    selledGoods:{orders:[]},
    opacityDegree:0,
    backgroundH:600,//背景图高度
    goodShowHeight:0//swiper高度
},
lifetimes:{
    attached(){
        //计算背景图的px高度
        const app=getApp()
        // const windowInfo=getApp().windowInfo
        console.log(app)
        const w=app.windowInfo.windowWidth
        this.backgroundHPx= this.data.backgroundH/750*w-app.globalData.navH-app.globalData.statusH
        // console.log(windowInfo)
    }
},
methods:{
    onLoad(){

        const user=getApp().globalData.user
        this.setData({mySelf:user})
        const eventChannel = this.getOpenerEventChannel()
        // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
        eventChannel.on('userHomeEvent',  (data)=>{
            this.setData({user:data.user})
             getApp().goodService.getGoodListById(data.user.userId,0)
            .then(res=>this.setData({'noSellGoods.records':res.data}))
            getApp().goodService.getGoodListById(data.user.userId,1)
            .then(res=>this.setData({'selledGoods.records':res.data}))
        })
      
  
    },
    // onShow(){
    //     const user=getApp().globalData.user
    //     const curUser=this.data.user
    //     if(curUser==null||curUser.userId!=user.userId) return
    //     this.setData({user})
    // },
    scrolling(e){
        // console.log(e)
        const topH=e.detail.scrollTop
        if(topH>this.backgroundHPx&&this.data.opacityDegree==0)
            this.setData({opacityDegree:1})
        if(topH<this.backgroundHPx&&this.data.opacityDegree==1)
            this.setData({opacityDegree:0})
        // console.log(e)
    },
    goodsShowChange(e){
        // console.log(e)
        this.setData({goodShowHeight:e.detail.height})
    },
    pageChangeEvent(e){
        this.setData({current:e.detail.current})
    },
    navBack(){
        wx.navigateBack()
    },
    navToUserNotEdit(){
        wx.navigateTo({url: '../user-edit/user-edit?key=0',
        success:(res)=>{
            res.eventChannel.emit('userEditEvent',{user:this.data.user})
        }})
    },
    navToUserEdit(){
        wx.navigateTo({url: '../user-edit/user-edit?key=1',
        success:(res)=>{
            res.eventChannel.emit('userEditEvent',{user:this.data.user})
        }})
    },
    // //商品展示高度变化
    // goodShowHeightEvent(e){
    //     this.setData({goodShowHeight:e.detail.height+50})
    // },
    navToGoodDetail(e){
        wx.navigateTo({url: `../../goods/good-detail/good-detail?goodId=${e.detail.goodDetail.goodId}`,
        success:(res)=>{
            // res.eventChannel.emit('goodDetailEvent', { goodVo:e.detail.goodDetail })
        }})
    }
}
})