
let statusH = wx.getSystemInfoSync().statusBarHeight
let menuInfo=wx.getMenuButtonBoundingClientRect()
let navH = (menuInfo.top - statusH) * 2 + menuInfo.height;
Component({
externalClasses:['custom-status','custom-nav','custom-class'],
properties:{
    backgroundColor:{
        type:String,
        value:''
    }
},
data: {
    nav:{
        statusH,//状态栏高度
        height:46,//导航栏高度
        navH,
        menuInfo
    }
}
})