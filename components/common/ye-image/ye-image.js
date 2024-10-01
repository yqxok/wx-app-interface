// components/common/ye-image/ye-image.js
Component({
externalClasses:['image-class'],
properties: {
    src:{
        type:String,
        value:'https://gd-hbimg.huaban.com/08bc577200c1146b3aa6dddb87822b6c892b9d3a1a9a-P9Zen7_fw658'
    }
},
observers:{
    src:function(newVal){
        this.setData({imgUrl:newVal})
    }
},
data: {
    imgUrl:''
},
methods: {
    tapImg(e){
        this.triggerEvent('click')
    },
    imageError(e){
        this.setData({imgUrl:'https://gd-hbimg.huaban.com/08bc577200c1146b3aa6dddb87822b6c892b9d3a1a9a-P9Zen7_fw658'})
    }
}
})