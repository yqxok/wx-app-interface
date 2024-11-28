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
    goodCollects:{cursor:0,isEnd:false,list:[]},
    bottomHeight:150
},
lifetimes:{
    attached(){
        this.msgTip=this.selectComponent('#msgTip')
    }
},
observers:{
    'goodCollects.list':function (newVal) {
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
        getApp().collectService.getCollectVoList(0,20)
        .then(res=>{
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
        const list=this.data.goodCollects.list
        list.forEach(item=>item.choosed=item.goodInfo.goodId==goodId?!item.choosed:item.choosed)
        this.setData({'goodCollects.list':list})
        
    },
    chooseAll(){
        this._chooseAll(false)
    },
    deleteCollectByList(){
        const list= this.data.goodCollects.list
        if(!list||list.length<1) return
        const goodIds= list.filter(item=>item.choosed==true).map(item=>item.goodInfo.goodId)
        getApp().collectService.deleteCollect(goodIds)
        .then(res=>{
            this.msgTip.showTip({msg:'取消收藏成功',warnType:false})
            this.startManage()
            this.requestCollect()
        })
    },
    deleteCollectById(e){
        const goodId= e.currentTarget.dataset.goodid
        getApp().collectService.deleteCollect([goodId])
        .then(res=>{
            this.msgTip.showTip({msg:'取消收藏成功',warnType:false})
            this.requestCollect()
        })
    },
    navGoodDetail(e){
        const goodId=e.currentTarget.dataset.goodid
        wx.navigateTo({url: `./../../goods/good-detail/good-detail?goodId=${goodId}`})
    }
}
})