// components/user/user-header/user-header.js
Component({
properties:{
    user:Object
},
data:{
    img:'https://img.zcool.cn/community/01fc8555fe47136ac7251df821f27e.jpg@1280w_1l_2o_100sh.jpg'
},
methods:{
//事件通信
userLogin(){
    this.triggerEvent("userTapLogin",{msg:'用户登录'})
},
btnClick(){
    this.triggerEvent("settingClickEvent")
}
}
})