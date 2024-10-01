const eventBus=require('../../../utils/eventBus')

Component({
properties:{
},

data:{
    isNameEdit:false,
    content:''
},
lifetimes:{
    attached(){
        
    }
},
methods:{
    navBack(){
        wx.navigateBack()
    },
    onLoad(option){
        if(option.key==0)
            this.setData({isNameEdit:true,content:option.content})
        else
            this.setData({isNameEdit:false,content:option.content})
    },
    saveText(e){
        const editValue=e.detail.value.editValue
        let pages = getCurrentPages();//获取page
        let prevPage = pages[pages.length-2];//上一个页面（父页面）
        const user=getApp().globalData.user
        if(this.data.isNameEdit){
            const oldUserName=user.userName
            user.userName=editValue
            getApp().userService.updateUser(user).then(res=>{
                prevPage.setData({'user.userName':editValue})
                eventBus.emit('userChangeEvent',null)
            }).catch(res=>user.userName=oldUserName)
        }else{
            const oldBio=user.bio
            user.bio=editValue
            getApp().userService.updateUser(user).then(res=>{
                prevPage.setData({'user.bio':editValue})
                eventBus.emit('userChangeEvent',null)
            }).catch(res=>user.bio=oldBio)
        }
        wx.navigateBack()
    }
}
})