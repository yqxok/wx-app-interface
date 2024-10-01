const app=getApp()
Component({
properties:{
},

data:{
    isNameEdit:false
},
lifetimes:{
    attached(){
        
    }
},
methods:{
    navBack(){
        wx.navigateBack()
    }
}
})