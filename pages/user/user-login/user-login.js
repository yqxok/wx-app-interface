
const eventBus=require('../../../utils/eventBus')
Component({
data:{
    user:null,
    isLogin:true
},
lifetimes:{
    attached(){
        this.msgTip=this.selectComponent('#msgTip')
    }
},
methods:{
    //路由返回
    onClickLeft(){
        wx.navigateBack()
    },
    chgSignIn(){
        this.setData({isLogin:false})
    },
    chgLogIn(){
        this.setData({isLogin:true})
    },
    validateData(phoneNumber,password){
        var reg = /^1[3456789]\d{9}$/
        if(!reg.test(phoneNumber))
            throw new Error('请输入正确的手机号码')
        if(password.length<6)
            throw new Error('密码不小于6位')
    },
    submit(e){
        const v=e.detail.value
        try {
            this.validateData(v.phoneNumber,v.password)
        } catch (error) {
            this.msgTip.showTip({msg:error.message})
            return
        }
        if(this.data.isLogin){
            getApp().userService.login({phoneNumber:v.phoneNumber,password:v.password})
            .then(res=>{
                getApp().userService.getUserByToken(res.data)
                .then(res1=>{
                    wx.setStorage({key:'token',data:res.data})
                    getApp().globalData.user=res1.data
                    eventBus.emit('loginEvent',null)
                    wx.navigateBack()
                })
            }).catch(err=>this.msgTip.showTip({msg:err.message}))
        }else{
            if(v.password!=v.tryAgain){
                this.msgTip.showTip({msg:'两次密码输入不同'})
                return
            }
            getApp().userService.signIn({phoneNumber:v.phoneNumber,password:v.password})
            .then(res=>{
                this.msgTip.showTip({msg:'注册成功',warnType:false})
                this.setData({isLogin:true})
            }).catch(err=>this.msgTip.showTip({msg:err.message}))
        }
        // Notify({ type: 'primary', message: '通知内容' })
        
    },
    login(){
        wx.login({
            success: (res) => {
            //先向微信获取code，再获取登录信息
                getApp().userService.login(res.code)
                .then(result=>{
                    // console.log(result.message)
                    wx.setStorage({key:'user',data:result.data}) 
                    wx.setStorage({key:'token',data:result.message})
                    getApp().globalData.user=result.data
                    eventBus.emit('loginEvent',null)
                    wx.navigateBack()			     

                })
            },
        })
    }
}
})