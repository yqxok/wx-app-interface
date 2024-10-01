const behavior=require('./myBehavior')
Component({
behaviors:[behavior],
data:{
    show:false,
    isUpdateAddress:false,
    //接口数据添加逻辑字段
    zoneShow:[
        {choosed:-1,district:'学校',item:null},
        {choosed:-1,district:'校区',item:null},
        {choosed:-1,district:'宿舍楼',item:null}],
    cur:0,
    addressDto:{//表单数据
        addressId:null,
        school:null,
        zone:null,
        dormiName:null,
        phoneNumber:null,
        receiver:null,
        dormiNum:null,
        isDefault:0
    },
    address:''
    
},
lifetimes:{
    async attached(){  
        // const _this=this
        const func=getApp().dormitoryService.getDormitoryByName
        const arr=[]
        const res1= await func()
        this.data.zoneShow[0].item=res1.data
        this.setData({zoneShow:this.data.zoneShow})
        this.msgTip=this.selectComponent('#msgTip')
    }
},
methods:{
    onLoad(option){
        if('key' in option&&option.key=='1')
            this.setData({isUpdateAddress:true})
        const eventChannel = this.getOpenerEventChannel()
        
        eventChannel.on('addressDataEvent', (data)=> {
            const zoneShow=this.data.zoneShow
            this.setData({addressDto:data.addressDto})
            zoneShow[0].choosed=zoneShow[0].item.indexOf(data.addressDto.school)
            const func= getApp().dormitoryService.getDormitoryByName
            func(data.addressDto.school).then(res=>{
                zoneShow[1].item=res.data
                zoneShow[1].choosed=res.data.indexOf(data.addressDto.zone)
                func(data.addressDto.school,data.addressDto.zone).then(res1=>{
                    zoneShow[2].item=res1.data
                    zoneShow[2].choosed=res1.data.indexOf(data.addressDto.dormiName)
                    this.setData({zoneShow,cur:2})

                })
            })
        })
    },
    showTableEvent(){
        this.setData({show:true})
    },
    closeTableEvent(){
        const zoneShow=this.data.zoneShow
        for(const key in zoneShow){
            const index=zoneShow[key].choosed
            if(index==-1){
                this.setData({show:false,'addressDto.school':null,'addressDto.zone':null,
                'addressDto.dormiName':null})
                return
            }
        }
        const addressDto=this.data.addressDto
        addressDto.school=zoneShow[0].item[zoneShow[0].choosed]
        addressDto.zone=zoneShow[1].item[zoneShow[1].choosed]
        addressDto.dormiName=zoneShow[2].item[zoneShow[2].choosed]
        this.setData({show:false,addressDto})
    },
    chooseZone(e){
        const index=e.currentTarget.dataset.index
        console.log(index)
        const cur=this.data.cur
        if(cur===index) return
        const zoneShow=this.data.zoneShow
        for(let i=index;i<=cur;i++)
            zoneShow[i].choosed=-1
        console.log(zoneShow)
        this.setData({cur:index,zoneShow})
    },
    chooseItem(e){
        const index=e.currentTarget.dataset.index
        const cur=this.data.cur
        const zoneShow=this.data.zoneShow
        let temp=cur
        if(cur<2) temp++
        //发起网络请求
        if(cur==0)
            getApp().dormitoryService.getDormitoryByName(zoneShow[0].item[index])
            .then(res=>this.setData({[`zoneShow[${temp}].item`]:res.data}))
        if(cur==1)
            getApp().dormitoryService.getDormitoryByName(zoneShow[0].item[zoneShow[0].choosed],zoneShow[1].item[index])
            .then(res=>this.setData({[`zoneShow[${temp}].item`]:res.data}))
        this.setData({[`zoneShow[${cur}].choosed`]:index,cur:temp})
    },
    onClickLeft(){
        wx.navigateBack()
    },
    
    saveAddress(){
        const user= getApp().globalData.user
        try {
            this.validateAddress()
            getApp().addressService.saveAddress(user.userId,this.data.addressDto)
            .then(res=>wx.navigateBack())
        } catch (error) {
            this.msgTip.showTip(error.message)
        }
       
    },
    updateAddress(){
        try {
            this.validateAddress()
            getApp().addressService.updateAddress(this.data.addressDto.addressId,this.data.addressDto)
            .then(res=>wx.navigateBack())
        } catch (error) {
            this.msgTip.showTip(error.message)
        }
       
    },
    receiverChange(e){
        this.setData({'addressDto.receiver':e.detail})
    },
    phoneNumberChange(e){
        this.setData({'addressDto.phoneNumber':e.detail})
    },
    dormiNumChange(e){
        this.setData({'addressDto.dormiNum':e.detail})
    }
}
})