// pages/user/user-pub/user-pub.js
const config=require('../../../config')
Component({

/**
 * 组件的属性列表
 */
properties: {

},

/**
 * 组件的初始数据
 */
data: {
    deleteTableShow:false,
    goodVos:[],
    // host:getApp().config.host,
    

    curSelectedItem:null
},

/**
 * 组件的方法列表
 */
methods: {
    
    onShow(){
        
        this.getGoodVoList()
    },
    getGoodVoList(){
        const user=getApp().globalData.user
        getApp().goodService.getGoodListById(user.userId,0)
        .then(res=>this.setData({goodVos:res.data}))
    },
    confirmDelete(e){
        getApp().goodService.deleteGoodById(this.data.curSelectedItem.goodId).
        then(res=>this.getGoodVoList())
        this.setData({curSelectedItem:null})
        // console.log(e)
    },
    cancelDelete(){
        this.setData({deleteTableShow:false,curSelectedItem:null})
    },
    showDeleteTable(e){
        // console.log(e)
        const item=e.currentTarget.dataset.item
        this.setData({deleteTableShow:true,curSelectedItem:item})
    },
    navBack(){
        wx.navigateBack()
    },
    navToGoodDetail(e){
        wx.navigateTo({url: `../../goods/good-detail/good-detail?goodId=${e.currentTarget.dataset.goodid}`})
    },
    navToPubEdit(e){
        // console.log(e)
        const goodId=e.currentTarget.dataset.goodid
        getApp().goodService.getGoodDetailVo(goodId)
        .then(res=>{
            wx.navigateTo({url:'../../publish/publish?key=1',
            success:(res1)=>{
                // res.eventChannel.emit('editToPublishEvent', { goodVo:this.data.goodDetailVo })
                res1.eventChannel.emit('editToPublishEvent', { goodVo:res.data })
            }
        })
        })
       
    }
}
})