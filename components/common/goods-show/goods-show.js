// components/goods/goods-show/goods-show.js
const config=require('../../../config.js')
Component({
properties: {
    goodList:{
        type:Object,
        value:{}
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
    goodList:function(newValue){
        //  console.log(newValue)
        if('records' in newValue==false) return
        const list=newValue.records.map(item=>{
            const picUrl=item.picUrls[0]
            picUrl.h=345*picUrl.height/picUrl.width
            return item
        })
        // console.log('dfdsf')
        this.setData({
            goodList1:list.filter((item,index)=>index%2==0),
            goodList2:list.filter((item,index)=>index%2!=0),
            
        },()=>{})
        this.observerHeight()

    }
},
data: {
    goodList1:[],
    goodList2:[],
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
                    // console.log(res)
                    this.triggerEvent('goodShowHeightEvent',{height:res.height})
            }).exec()
        } catch (error) {
            
        }
    },
    //商品被点击事件
    goodTap(e){
        // console.log(e)
        this.triggerEvent('goodTapEvent',{goodDetail:e.currentTarget.dataset.item})
    },
    tapGoodUser(e){
        this.triggerEvent('tapGoodUserEvent',{goodVo:e.currentTarget.dataset.item})
    }

}
})