const config=require('../config.js')
module.exports={
    //封装wx.request()
    request(httpConfig){
        httpConfig.url=config.host+httpConfig.url
        const token= wx.getStorageSync('token')
        if(token) httpConfig.header={token}
        return new Promise((resolve,reject)=>{
            wx.request({...httpConfig,
                success:(res)=>{
                    if(res.data.code>=200&&res.data.code<300){
                        resolve(res.data)
                    }else
                        reject(res.data)
                },
                fail:(res)=>{
                   throw res
                }
            })    
        })  
    },
    //封装wx.upload()
    uploadFile(httpConfig){
        httpConfig.url=config.host+httpConfig.url
        const token= wx.getStorageSync('token')
        if(token) httpConfig.header={token}
        return new Promise((resolve,reject)=>{
            wx.uploadFile({...httpConfig,
                success:(res)=>{
                    const data=JSON.parse(res.data)
                    if(data.code>=200&&data.code<300){
                        resolve(data)
                    }else
                        reject(data)
                },
                fail:(res)=>{
                    throw res
                }
            })    
        })
    }
}