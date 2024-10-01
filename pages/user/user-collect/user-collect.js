// pages/user/user-collect/user-collect.js
var myBehavior=require('./my-behavior')
Component({
behaviors: [myBehavior],
properties: {

},

data: {
    swiperCellW:0,//窗口宽度
    isChoosedAll:false,//是否已经全选
    selectNum:0,//选中数量
    isManaged:false,//是否开启管理
    leftOpen:false,//是否已经左滑
    goodCollects:{},//page
    bottomHeight:150
},
lifetimes:{
    attached(){
    }
},
observers:{
    'goodCollects.records':function (newVal) {
        let selectNum=0,isChoosedAll=false
        newVal.forEach(item=>selectNum+=item.choosed?1:0)
        if(selectNum==newVal.length) isChoosedAll=true
        this.setData({selectNum,isChoosedAll})

    }
},
methods: {
    onLoad(){
        const winInfo= wx.getWindowInfo()
        this.setData({swiperCellW:winInfo.windowWidth})
        this.requestCollect()
    },
    requestCollect(){
        const user=getApp().globalData.user
        getApp().collectService.getCollectVoList(user.userId,1,8)
        .then(res=>{
            res.data.records.forEach(item=>item.choosed=false)
            this.setData({goodCollects:res.data})
        })
    },
    navBack(){
        wx.navigateBack()
    },
    startManage(){
        if(!this.data.leftOpen){
            this.animate('.bottom-container',[{translateY:this.data.bottomHeight+'rpx'},{translateY:0}],200)
        }else{
            this.animate('.bottom-container',[{translateY:0},{translateY:this.data.bottomHeight+'rpx'}],200)
        }
        this._chooseAll(true)
        this.setData({leftOpen:!this.data.leftOpen})
    },
    clickChoose(e){
        // console.log(e)
        const goodId= e.currentTarget.dataset.goodid
        const records=this.data.goodCollects.records
        records.forEach(item=>item.choosed=item.goodId==goodId?!item.choosed:item.choosed)
        this.setData({'goodCollects.records':records})
        
    },
    chooseAll(){
        this._chooseAll(false)
    },
    deleteCollectByList(){
        const records= this.data.goodCollects.records
        if(!records||records.length<1) return
        const goodIds= records.filter(item=>item.choosed==true).map(item=>item.goodId)
        const userId=getApp().globalData.user.userId
        getApp().collectService.deleteCollect(userId,goodIds)
        .then(res=>{
            this.startManage()
            this.requestCollect()
        })
    },
    deleteCollectById(e){
        const goodId= e.currentTarget.dataset.goodid
        const userId=getApp().globalData.user.userId
        getApp().collectService.deleteCollect(userId,[goodId])
        .then(res=>{
            this.requestCollect()
        })
    },
    navGoodDetail(e){
        const goodId=e.currentTarget.dataset.goodid
        wx.navigateTo({url: `./../../goods/good-detail/good-detail?goodId=${goodId}`})
       
        
    }
}
})