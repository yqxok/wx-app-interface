const config=require('../config')
const eventBus=require('../utils/eventBus')
let wsProperty={
    isConnecting:false, // 标记是否正在连接中
    reconnectAttempts:0,  // 重连次数
    maxReconnectAttempts:5,  // 最大重连次数
    reconnectInterval:5000,  // 重连间隔时间（单位：毫秒）
    reconnectObj:null,//重连计时器
    heartBeatInterval:5000,//发送心跳时间间隔
    lastTimeStamp:0,//记录上次心跳发送的时间戳
    heartReplyTimeout:4000,//最长心跳回复时间，不能大于心跳发送间隔
    heartBeatTimeObj:null,//心跳计时器
    heartTimeoutObj:null,//心跳过期计时器
    socketTask:null,//通道
}
/**
 * 开启websocket连接，带有重连，心跳机制
 */
function connect(){
    if (wsProperty.isConnecting || wsProperty.reconnectAttempts >= wsProperty.maxReconnectAttempts||wsProperty.socketTask) 
        return;
    const token= wx.getStorageSync('token')
    if(!token){
        console.log('token为空,无法连接websocket')
        return 
    } 
    wsProperty.isConnecting=true
    wsProperty.reconnectAttempts++
    wsProperty.socketTask=wx.connectSocket({
        url: config.wsHost,header:{token},
    })
    wsProperty.socketTask.onOpen((res)=> {
        wsProperty.isConnecting = false
        wsProperty.reconnectAttempts = 0;  // 重置重连次数
        console.log('websocket已打开')
        startHeartBeat()//开启心跳检测
    });
    wsProperty.socketTask.onMessage((msg)=> {
        const message=JSON.parse(msg.data)
        if(message.type!=0)
            console.log(message.data)
        if(message.type==0){//心跳包回复
            clearHeartTimeOut(wsProperty.heartTimeoutObj)
        }else if(message.type==3)
            eventBus.emit('chatContentEvent', message.data)
        else if(message.type=1)
            eventBus.emit('orderEvent', message.data)
        else if(message.type==2)
            eventBus.emit('commentEvent',message.data)
    });
    wsProperty.socketTask.onClose( (res)=> {
        console.log('WebSocket 已关闭！')
        eventBus.emit('wsCloseEvent',null)
        wsProperty.socketTask=null
        clearHeartBeat()
        setTimeout(connect,wsProperty.reconnectInterval)
    });
    
    wsProperty.socketTask.onError( (error)=> {
        console.log('WebSocket 出现错误！')
        eventBus.emit('wsCloseEvent',null)
        wsProperty.socketTask=null
        clearHeartBeat()
        setTimeout(connect,wsProperty.reconnectInterval)
    });
}
/**
 * 关闭websocket连接
 */
function close(){
    if(!wsProperty.socketTask) return
    wsProperty.socketTask.close({success:()=>wsProperty.socketTask=null})
    
}
function clearReconnectObj(){
    if(wsProperty.reconnectObj){
        clearTimeout(wsProperty.reconnectObj)
        wsProperty.reconnectObj=null
    }
}
/**
 * 清除心跳发送器
 */
function clearHeartBeat(){
    if(wsProperty.heartBeatTimeObj){
        clearInterval(wsProperty.heartBeatTimeObj)
        wsProperty.heartBeatTimeObj=null
    }
}
/**
 * 清除心跳回复计时器
 */
function clearHeartTimeOut(){
    if(wsProperty.heartTimeoutObj){
        clearTimeout(wsProperty.heartTimeoutObj)
        wsProperty.heartTimeoutObj=null
    }
}
/**
 * 开启心跳机制
 */
function startHeartBeat(){
    console.log('开启心跳')
    wsProperty.heartBeatTimeObj=setInterval(()=>{
        if(!wsProperty.socketTask) return
        const data={type:0,data:'heartBeat'}
        
        wsProperty.socketTask.send({data:JSON.stringify(data),
        success:()=>{
            //timeout时间内没有心跳回复则断开websocket连接,再开启重连
            wsProperty.heartTimeoutObj= setTimeout(()=>{
                console.log('timeout时间内没有心跳回复则断开websocket连接,再开启重连')
                close()
                connect()
            },wsProperty.heartReplyTimeout)
        }})
        wsProperty.lastTimeStamp=Date.now()
    },wsProperty.heartBeatInterval)
}
module.exports={connect,close}