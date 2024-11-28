// pages/publish/publish.js
var myStyle=`--pub-edit-container-height:1000rpx;`
const myBehavior=require('./behavior')
Component({
behaviors:[myBehavior],
data: {
    // getCategory:getApp().categoryService.getCategory,//传入api
    goodDto:{goodNum:1},
    goodVo:{},
    isUpdatePub:false,//发布按钮的文字
    fileList:[],

    priceShow:false,
    categoryOpen:false,
    textUnfold:false,//展开编辑窗口,
    loadingShow:false//加载
},
observers:{
    // fileList:function (newVal) {
    //     const picUrls=newVal.map(item=>item.url)
    //     this.setData({'goodDto.picUrls':picUrls})
    // }
},
lifetimes:{
    attached(){
        this.msgTip=this.selectComponent('#msgTip')
    }
},
methods:{
    onLoad(option){
        this.pubSort=this.selectComponent('#pub-sort')
        // const _this=this
        // console.log(option)
        if('key' in option&&option.key=='1')
            this.setData({isUpdatePub:true})
        const eventChannel = this.getOpenerEventChannel()
        // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
        eventChannel.on('editToPublishEvent',  (data)=> {
            const fileList=data.goodVo.picUrls.map(item=>{return {url:item.url}})
            const goodDto=this.getGoodDto(data.goodVo)
            this.pubSort.setCategores(data.goodVo.goodId) 
            this.setData({goodVo:data.goodVo,fileList,goodDto,categoryOpen:true})
           
        })
    },
    getGoodDto(gVo){
        return {goodId:gVo.goodId,goodNum:gVo.goodNum,html:gVo.html,picUrls:gVo.picUrls,
        price:gVo.price,categories:gVo.categories}
    },
    goodNumChange(e){
        this.setData({'goodDto.goodNum':e.detail})
    },
    textareaFocus(e){
        this.setData({textUnfold:!this.data.textUnfold})
    },
    editorInputEvent(){
        
        if(this.data.categoryOpen)
            return
        this.setData({categoryOpen:true})
    },
    openCategoryEvent(){
        console.log('ddd')
        this.setData({categoryOpen:!this.data.categoryOpen})
    },
    getPrice(e){
        this.setData({'goodDto.price':e.detail.price,priceShow:false})
    },
    openPrice(){
        this.setData({priceShow:true})
    },
    closePrice(){
        this.setData({priceShow:false})
    },
    //跳转到地址页面
    navToAddress(){
        wx.navigateTo({url: '../user/user-address/address-home/address-home'})
    },
    navBack(){
        wx.navigateBack()
    },
    //上传图片
    afterRead(e){
        for (const i in e.detail.file) 
            this.data.fileList.push({url:e.detail.file[i].url})
        this.setData({fileList:this.data.fileList})  
    },
    // 删除图片
    imgDelete(){
        this.data.fileList.pop()
        this.setData({fileList:this.data.fileList})
    }
}
})