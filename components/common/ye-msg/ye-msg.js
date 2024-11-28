// components/common/ye-msg/ye-msg.js
Component({
properties: {
    top:{
        type:String,
        value:'40%'
    }
},

data: {
    msg:'',
    opacity:0,
    warnType:true,
    zIndex:-1
},

/**
 * 组件的方法列表
 */
methods: {
    showTip({msg,warnType=true}){
        console.log(msg)
        this.setData({opacity:1,zIndex:10,msg,warnType})
        setTimeout(()=>{
            this.setData({opacity:0})
        },1000)
    }
}
})