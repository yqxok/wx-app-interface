// pages/user/user-settting/user-settting.js
const eventBus=require('../../../utils/eventBus')
Component({

properties: {

},

data: {

},

methods: {
    navBack(){
        wx.navigateBack()
    },
    logout(){
        wx.removeStorage({key: 'user'})
        wx.removeStorage({key:'token'})
        getApp().globalData.user=null
        //发布登出事件
        eventBus.emit('logoutEvent',null)
        wx.navigateBack()
    }
}
})