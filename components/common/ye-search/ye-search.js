// components/common/ye-search/ye-search.js
Component({

externalClasses:['custom-class'],
properties: {
    placeholder:{
        type:String,
        value:''
    },
    enableInput:{
        type:Boolean,
        value:true
    },
    backgroundColor:{
        type:String,
        value:'white'
    }
},

/**
 * 组件的初始数据
 */
data: {

},

/**
 * 组件的方法列表
 */
methods: {
    startSearch(){
        this.triggerEvent('startSearchEvent')
    }
}
})