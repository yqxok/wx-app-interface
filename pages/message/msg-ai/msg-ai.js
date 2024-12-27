const typeWriter=require('./typewriter.js')
Component({

properties: {

},

/**
 * 组件的初始数据
 */
data: {
    
    chats:[{type:1,text:'讲一个笑话'},{type:0,textObj:{
        text:'',//渲染的文本
        originText:'',//素材文本
        typeSpeed:20//打字速度
    }}],
    keyboardH:0
},
// observers:{
//     'textObj.originText':function(val){
        
//     }
// },
/**
 * 组件的方法列表
 */
methods: {
    navBack(){
        wx.navigateBack()
    },
    // showText(index){
    //     var text=this.data.text
    //     if (index < text.length) {
    //         // 更新当前文本内容
    //         this.data.currentText += text[index];
    //         // 使用setData更新视图
    //         this.setData({
    //            currentText:this.data.currentText
    //         });
    //         // 递归调用，显示下一个字符
    //         setTimeout(() => {
    //           this.showText(index + 1);
    //         }, 50); // 每50毫秒显示一个字符
    //     }
    // },
    // onLoad(){
    //     typeWriter.showText(this,'text',this.data.text)
    //     // this.showText(0);
    // }
    onLoad(){
        const requestTask= wx.request({
            url: 'http://10.61.117.240:7001/api/ai/generateStream', // 流式接口的URL
            method: 'GET',
            data: {
              message: '讲一个笑话'
            },
            header:{token:'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE3MzU4MzExMzEsInVzZXJJZCI6IjE4MTA2Njg4OTIzMTU2OTcxNTMifQ.0q-OJlAdEkDzdeSv_Gk5ZLVZben06Zci17q2HZlS7n0'},
            
            // header: {
            //     'content-type': 'application/json',
            // },
            enableChunked: true, // 开启流式传输模式
            success(res) {
              // 处理响应
            }
        });
        requestTask.onChunkReceived((response) => {
            // console.log(response)
            const arrayBuffer = response.data
            const uint8Array = new Uint8Array(arrayBuffer)
            const str = new TextDecoder('utf-8').decode(uint8Array)
            // typeWriter.showText(this,this.data.textObj+str)
            this.data.chats[1].textObj.originText+=str
            // this.setData({'textObj.originText[1]':str+})
            typeWriter.showText(this,'chats[1].textObj', this.data.chats[1].textObj)
            // this.setData({html:this.data.html+str})
            // console.log(str)
        //     let result =getApp().towxml(this.data.text+str,'markdown',{
        //      theme:'light',                   // 主题，默认`light`
        //      events:{                    // 为元素绑定的事件方法
        //           tap:(e)=>{
        //               console.log('h4',e);
        //           }
        //       }
        //    })

        //     // 更新解析数据  
        //     this.setData({html: result,text:this.data.text+str})
        })
    }
}
})