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
        dormiInfo:{
            dormiId:-1,
            school:'',
            zone:'',
            dormiName:''},
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
            zoneShow[0].choosed=zoneShow[0].item.indexOf(data.addressDto.dormiInfo.school)
            const func= getApp().dormitoryService.getDormitoryByName
            func(data.addressDto.dormiInfo.school).then(res=>{
                zoneShow[1].item=res.data
                zoneShow[1].choosed=res.data.indexOf(data.addressDto.dormiInfo.zone)
                func(data.addressDto.dormiInfo.school,data.addressDto.dormiInfo.zone).then(res1=>{
                    zoneShow[2].item=res1.data
                    zoneShow[2].choosed=res1.data.indexOf(data.addressDto.dormiInfo.dormiName)
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
                this.setData({show:false,'addressDto.dormiInfo.school':null,'addressDto.dormiInfo.zone':null,
                'addressDto.dormiInfo.dormiName':null})
                return
            }
        }
        const addressDto=this.data.addressDto
        addressDto.dormiInfo.school=zoneShow[0].item[zoneShow[0].choosed]
        addressDto.dormiInfo.zone=zoneShow[1].item[zoneShow[1].choosed]
        addressDto.dormiInfo.dormiName=zoneShow[2].item[zoneShow[2].choosed]
        getApp().dormitoryService.getDormiId(addressDto.dormiInfo)
        .then(res=>{
            addressDto.dormiInfo.dormiId=res.data
            this.setData({show:false,addressDto})
        })
        
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
        //发请求
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
        try {
            this.validateAddress()
            const a=this.data.addressDto
            getApp().addressService.saveAddress({receiver:a.receiver,phoneNumber:a.phoneNumber,dormiNum:a.dormiNum,dormitoryId:a.dormiInfo.dormiId})
            .then(res=>wx.navigateBack())
        } catch (error) {
            this.msgTip.showTip({msg:error.message})
        }
        
    },
    updateAddress(){
        try {
            const user= getApp().globalData.user
            this.validateAddress()
            getApp().addressService.updateAddress({receiver:a.receiver,phoneNumber:a.phoneNumber,dormiNum:a.dormiNum,dormitoryId:a.dormiInfo.dormiId})
            .then(res=>wx.navigateBack())
        } catch (error) {
            this.msgTip.showTip({msg:error.message})
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