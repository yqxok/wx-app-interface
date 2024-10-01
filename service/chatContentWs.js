const config=require('../config')
const eventBus=require('../utils/eventBus')
let isConnecting = false;  // 标记是否正在连接中
let reconnectAttempts = 0;  // 重连次数
const maxReconnectAttempts = 5;  // 最大重连次数
const reconnectInterval = 5000;  // 重连间隔时间（单位：毫秒）

module.exports={
    tryConnent(){
         // 如果已经在连接中，或者达到重连次数限制，不再尝试重连
        if (isConnecting || reconnectAttempts >= maxReconnectAttempts) 
            return;
        console.log('websocket尝试连接')
        isConnecting = true;
        reconnectAttempts++;
        const header={'content-type': 'application/json','Authorization': null}
        const token= wx.getStorageSync('token')
        if(token==null){
            console.log('token为null,无法连接websocket')
            return 
        } 
        header.token=token
        const socketTask = wx.connectSocket({
            url: config.wsHost+'/chatContent',header,
            success:()=> {
                isConnecting = false;
                reconnectAttempts = 0;
            },
            fail:()=>{
                console.log('WebSocket 重连失败，稍后再试');
                setTimeout(this.tryConnent, reconnectInterval);
            }
        });
        return socketTask
    },
    connectChatContent(){
        const socketTask= this.tryConnent()
        socketTask.onOpen( (res)=> {
            isConnecting = false;
            reconnectAttempts = 0;  // 重置重连次数
            console.log('chatContentWs已打开');
            // that.globalData.socketOpen = true;
        });
        
        socketTask.onMessage( (msg)=> {
            const message=JSON.parse(msg.data)
            if(message.uri==='/chatting')
                eventBus.emit('chatContentEvent', message.data);
            else if(message.uri==='/order')
                eventBus.emit('orderEvent', message.data);
            else if(message.uri==='/comment')
                eventBus.emit('commentEvent',message.data)
                
        });
      
        socketTask.onClose( (res)=> {
            console.log('WebSocket 已关闭！', res);
            eventBus.emit('wsCloseEvent',null)
            this.tryConnent();  // 调用重连函数
        });
      
        socketTask.onError( (error)=> {
            console.log('WebSocket 出现错误！', error);
            eventBus.emit('wsCloseEvent',null)
            this.tryConnent();  // 调用重连函数
        });
        return socketTask
    }
}