// components/common/ye-msg/ye-msg.js
Component({
properties: {

},

data: {
    msg:'',
    opacity:0
},

/**
 * 组件的方法列表
 */
methods: {
    showTip(msg){
        console.log(msg)
        this.setData({opacity:1,msg})
        setTimeout(()=>{
            this.setData({opacity:0})
        },1000)
    }
}
})