const app=getApp()
Component({
properties:{

},
data:{
    date:'请选择',
    currentDate: new Date().getTime(),
    show:false,
    img:'https://img.zcool.cn/community/01fc8555fe47136ac7251df821f27e.jpg@1280w_1l_2o_100sh.jpg'
},
methods:{
    onShow(){
        this.setData({user:app.globalData.user})
    },
    onInput(event) {
        this.setData({
        currentDate: event.detail,
        });
    },
    onDisplay(){
        this.setData({
        show:true
        })
    },
    onClose() {
        this.setData({ show: false });
    },
    onClickLeft(){
        wx.navigateBack()
    }
}
})