const typeWriter=require('./typewriter.js')
Component({

properties: {

},

/**
 * 组件的初始数据
 */
data: {
    
    user:null,
    keyboardH:0,
    chats:[{type:0,textObj:{
            text:'',//渲染的文本
            originText:'请问有什么能帮助你的吗？',//素材文本
            items:[]
        }}]
},
/**
 * 组件的方法列表
 */
methods: {
    navBack(){
        wx.navigateBack()
    },
    onLoad(){
        setTimeout(()=>{
            typeWriter.showText(this,`chats[0].textObj`, this.data.chats[0].textObj)
        },500)
        
        if(getApp().globalData.user)
            this.setData({user:getApp().globalData.user})
    },
    navToGoodDetail(e){
        wx.navigateTo({url: `../../goods/good-detail/good-detail?goodId=${e.currentTarget.dataset.goodid}`})
    },
    //流式响应
    msgSend(e){
        const chats=this.data.chats
        chats.unshift({type:1,text:e.detail.value})
        chats.unshift({type:0,textObj:{text:'', originText:'',items:[]}})
        this.setData({chats})
        //监听消息是否传输完毕
        let timeId=null
        const task=getApp().aiService.send(e.detail.value)
        task.onChunkReceived((response) => {
            clearTimeout(timeId)
            let data = response.data
            const type = Object.prototype.toString.call(data); // Uni8Array的原型对象被更改了所以使用字符串的信息进行判断。
            let str
            if(type ==="[object Uint8Array]"){
                str=decodeURIComponent(escape(String.fromCharCode.apply(null,data)))
            }else if(data instanceof ArrayBuffer){
                // 将ArrayBuffer转换为Uint8Array
                console.log("ArrayBuffer");
                const uint8Array = new Uint8Array(data);
                str=decodeURIComponent(escape(String.fromCharCode.apply(null,uint8Array)))
            }
            this.data.chats[0].textObj.originText+=str
            //渲染
            // typeWriter.showText(this,`chats[0].textObj`, this.data.chats[0].textObj)
            timeId=setTimeout(()=>{
                //反序列化消息
                const obj=JSON.parse(this.data.chats[0].textObj.originText)
                this.data.chats[0].textObj.originText=obj.message
                //渲染ai消息
                typeWriter.showText(this,`chats[0].textObj`, this.data.chats[0].textObj,()=>{
                      //渲染商品数据
                    this.setData({'chats[0].textObj.items':obj.items})
                })
            },500)
        })
        task.offChunkReceived((res)=>{
            console.log(res)
        })
    },
    Uint8ArrayToString(fileData){
        var dataString = "";
        for (var i = 0; i < fileData.length; i++) {
          dataString += String.fromCharCode(fileData[i]);
        }
       
        return dataString
      
    },
    keyboardOpen(e){
        this.setData({keyboardH:e.detail.keyboardH})
    },
    keyboardClose(){
        this.setData({keyboardH:0})
    }
}
})