// components/common/my-input/my-input.js
// const app=getApp()
Component({
externalClasses:['custom-class'],
properties: {
    placeholder:{
        type:String,
        value:'想和TA说点什么...'
    },
    isFocus:{
        type:Boolean,
        value:false
    },
    marginBottom:{
        type:Number,
        value:0
    },
    // inputValue:{
    //     type:String,
    //     value:''
    // }
    
},
observers:{
    isFocus:function (newValue) {
        
    }
},
/**
 * 组件的初始数据
 */
data: {
    inputValue:''
},
lifetimes:{
    attached(){
        this.windowInfo=wx.getWindowInfo()
        //监听键盘高度变化
        wx.onKeyboardHeightChange((res) => {
        if (res.height > 0) {
            this.triggerEvent('keyboardOpen',{keyboardH:res.height})
        }else{
            this.triggerEvent('keyboardClose')
        }})

    }
},
/**
 * 组件的方法列表
 */
methods: {
    focus(e){
        // const keyboardH=e.detail.height
        // this.triggerEvent('keyboardOpen',{keyboardH})
        
    },
    blur(e){
        // const windowHeight= this.windowInfo.windowHeight
        // this.triggerEvent('keyboardClose')
    },
    submit(e){
        this.triggerEvent('inputValueEvent',{value:e.detail.value.textarea})
        this.setData({inputValue:''})
    }
}
})