const app=getApp()
Component({
options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
},
properties:{
    leftWidth:{
        type:Number,
        value:0
    },
    rightWidth:{
        type:Number,
        value:0
    },
    openLeft:{
        type:Boolean,
        value:false
    }
},
observers:{
    leftEnabled:function(newVal) {
        console.log('fdfdf')
        this.setData({enableLeft:newVal})
    },
    rightEnabled:function (newVal) {
        console.log('fdfkkkk')
        this.setData({enableRight:newVal})
    },
    openLeft:function(newVal) {
        if(newVal){
            this.setData({enableRight:false})
        }else{
            this.setData({rightEnabled:true})
        }
    }
},
data:{
    swiperCellW:0,
    enableRight:true,
    enableLeft:true
},
lifetimes:{
    attached(){
        const winInfo= wx.getWindowInfo()
        this.setData({swiperCellW:winInfo.windowWidth})
    }
},
methods:{

    openLeft(){
        this.setData({openLeft:!this.data.openLeft,enableLeft:!this.data.enableLeft})
    },
  
}
})