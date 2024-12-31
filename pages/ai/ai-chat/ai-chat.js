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
    onLoad(option){
        
        if(getApp().globalData.user)
            this.setData({user:getApp().globalData.user})
        //判断是否为历史消息
        if(option.roomId){
            getApp().aiService.getChats(option.roomId)
            .then(res=>{
               const chats=res.data.map(item=>{
                    if(item.type==0)
                        return {chatId:item.chatId,type:item.type,sendTime:item.sendTime,
                            textObj:{text:item.content,originText:item.content,items:item.goods}}
                    else
                        return {chatId:item.chatId,type:item.type,text:item.content,sendTime:item.sendTime}
                })
                this.data.chats[0].textObj.text=this.data.chats[0].textObj.originText
                this.data.chats.unshift(...chats)
                this.setData({roomId:option.roomId,chats:this.data.chats})
            })
        }else{
            setTimeout(()=>{
                typeWriter.showText(this,`chats[0].textObj`, this.data.chats[0].textObj)
            },500)
            getApp().aiService.createRoom()
            .then(res=>this.setData({roomId:res.data}))
        }
    },
    navToGoodDetail(e){
        wx.navigateTo({url: `../../goods/good-detail/good-detail?goodId=${e.currentTarget.dataset.goodid}`})
    },
    //流式响应
    msgSend(e){
        const chats=this.data.chats
        const history=chats.filter((item,index)=>index!=chats.length-1).map(item=>{
            if(item.type==0)
                return {type:item.type,content:item.textObj.originText}
            else
                return {type:item.type,content:item.text}
        })
        const aigcReq={message:e.detail.value,history}
        chats.unshift({type:1,text:e.detail.value})
        chats.unshift({type:0,textObj:{text:'', originText:'',items:[]}})
        this.setData({chats})
        //监听消息是否传输完毕
        let timeId=null
        
        const task=getApp().aiService.send(aigcReq)
        task.onChunkReceived((response) => {
            clearTimeout(timeId)
            let data = response.data
            const type = Object.prototype.toString.call(data); // Uni8Array的原型对象被更改了所以使用字符串的信息进行判断。
            let str
            if(type ==="[object Uint8Array]"){
                str=decodeURIComponent(escape(String.fromCharCode.apply(null,data)))
            }else if(data instanceof ArrayBuffer){
                // 将ArrayBuffer转换为Uint8Array
                const uint8Array = new Uint8Array(data)
                str=decodeURIComponent(escape(String.fromCharCode.apply(null,uint8Array)))
            }
            this.data.chats[0].textObj.originText+=str
            //渲染
            typeWriter.showText(this,`chats[0].textObj`, this.data.chats[0].textObj)
            timeId=setTimeout(()=>{
                //反序列化消息
                const originText=this.data.chats[0].textObj.originText
                var json='[]',text=originText
                const bracketIndex = originText.indexOf('[');
                if (bracketIndex !== -1) {
                    json=originText.substring(bracketIndex)
                    text=originText.substring(0,bracketIndex)
                } 
                //渲染商品数据
                const obj=JSON.parse(json)
                this.setData({'chats[0].textObj.items':obj})
                //保存消息
                getApp().aiService.saveMsg({userContent:e.detail.value,aiContent:text,roomId:this.data.roomId,goods:json}).then(res=>{})
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