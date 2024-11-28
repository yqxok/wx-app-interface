const config=require('../../config')
module.exports=Behavior({
methods:{
    sortChange(e){
        this.setData({'goodDto.categories':e.detail.sort})
    },
    validateHtml(){
        const html=this.data.goodDto.html
        if(html==null||html.length<10)
            throw new Error('描述不能少于10个字')
        return this
    },
    async submitForm(e){
        // const html
        // console.log(e.)
        this.data.goodDto.html=e.detail.value.textarea
        try {
            this.validateHtml().validatePicUrl().validateCategory().validatePrice()
            this.setData({loadingShow:true})
            var resData=null
            if(!this.data.isUpdatePub){//初次发布
                if(this.data.goodDto.picUrls==null){
                    console.log('上传图片')
                    const urls=await getApp().uploadService.upload({urls:this.data.fileList.map(i=>i.url),sort:'good'})
                    this.data.goodDto.picUrls=urls
                }
                resData=await getApp().goodService.postGood({...this.data.goodDto,
                    userId:getApp().globalData.user.userId
                })
                this.setData({loadingShow:false})
                wx.redirectTo({url:`../goods/good-detail/good-detail?goodId=${resData.data}`})
               
            }else{//重新发布
                const otherUrl=this.data.fileList.filter(item=>item.url.search(config.qiniuUrl)==-1?true:false).map(i=>i.url)
                const myHostUrl=this.data.goodVo.picUrls.filter(item=>{
                    const fileList=this.data.fileList
                    for(var i=0;i<fileList.length;i++){
                        if(fileList[i].url.indexOf(item.url)!=-1) return true
                    }
                    return false
                })
                const resUrl=await getApp().uploadService.upload({urls:otherUrl,sort:'good'})
                this.data.goodDto.picUrls=[...myHostUrl,...resUrl]
                resData=await getApp().goodService.updateGood({...this.data.goodDto})   
            }
            this.setData({loadingShow:false})
            wx.redirectTo({url:`../goods/good-detail/good-detail?goodId=${resData.data}`})
        } catch (error) {
            this.setData({loadingShow:false})
            this.msgTip.showTip({msg:error.message})
            
        }
    },
    validatePicUrl(){
        const fileList=this.data.fileList
        if(fileList==null||fileList.length<1)
            throw new Error('请上传图片')
        return this
    },
    validatePrice(){
        const price=this.data.goodDto.price
        if(typeof price == 'String'||price<=0)
            throw new Error('请输入价格')
        return this
    },
    validateCategory(){
        this.data.goodDto.categories=this.pubSort.getAllCategories()
        return this
    }

}
})
