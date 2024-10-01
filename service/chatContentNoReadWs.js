const config=require('../config')
const eventBus=require('../utils/eventBus')
module.exports={
    connectChatNoRead(){
        const header={'content-type': 'application/json','Authorization': null}
        const token= wx.getStorageSync('token')
        if(token) header.token=token
        const socketTask = wx.connectSocket({
            url: config.wsHost+'/chatNoRead',header,

            success() {
            //   console.log('chatContentNoReadWs连接成功！');
            }
        });
        
        socketTask.onOpen(function () {
            console.log('WebSocket已打开');
            // that.globalData.socketOpen = true;
        });
      
        socketTask.onMessage(function (msg) {
            // console.log('收到服务器消息：', msg.noReadNum);
            // 触发事件，让其他页面可以收到消息
            eventBus.emit('noReadNumEvent', msg.noReadNum);
        });
      
        socketTask.onClose(function () {
            console.log('WebSocket已关闭');
            // that.globalData.socketOpen = false;
        });
      
        socketTask.onError(function (error) {
            // console.log('WebSocket错误：', error);
        });
        return socketTask
    }
}