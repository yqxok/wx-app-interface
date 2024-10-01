const http=require('../utils/promiseRequest.js')
module.exports={
    async upload({urls,sort}){
        const resUrls=[]
        for (const item of urls) {
           const res=await http.uploadFile({filePath:item,
                url:`/upload/${sort}`,
                name:'pic'
            })
           resUrls.push(res.data)
        }
        return resUrls
    }
    // upload({url,sort}){
    //     wx.uploadFile({
    //       filePath: url,
    //       name: 'pic',
    //       url: 'http://localhost:7001/api'+`/upload/${sort}`,
    //       success(res){
            
    //       },
    //       fail(res){
    //         console.log(res)  
    //       }
    //     })
    // }
}