// components/goods/goods-show/goods-show.js
const config=require('../../../config.js')
Component({
properties: {
   
    goodList1:{
        type:Array,
        value:[]
    },
    goodList2:{
        type:Array,
        value:[]
    },
    overlay:{
        type:Boolean,
        value:false
    },
    needGoodUser:{
        type:Boolean,
        value:true
    }
},
observers:{
    goodList1:function(newValue){
        
        this.observerHeight()

    }
},
data: {
    // goodList1:[],
    // goodList2:[],
    host:null
},
lifetimes:{
    attached(){
        // console.log('dfsdf')
        this._observer = wx.createSelectorQuery().in(this)
        // console.log(config)
        this.setData({host:config.host})
    }
},
methods: {
    observerHeight(){
        
        try {
            this._observer.select('#nihao')
            .boundingClientRect((res)=>{
                    this.triggerEvent('goodShowHeightEvent',{height:res.height})
            }).exec()
        } catch (error) {
            
        }
    },
    //商品被点击事件
    tapGood(e){

        this.triggerEvent('goodTapEvent',{goodId:e.currentTarget.dataset.goodid})
    },
    tapUser(e){
        this.triggerEvent('tapGoodUserEvent',{userId:e.currentTarget.dataset.userid})
    }

}
})