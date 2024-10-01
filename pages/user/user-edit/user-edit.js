const app=getApp()
const eventBus=require('../../../utils/eventBus')
Component({
properties:{
},

data:{
    dateShow:false,
    genderShow:false,
    isMan:true,//选择的性别
    currentDate:null,
    enableEdit:true,//是否可以编辑
    user:null,
    host:getApp().config.host
},
observers:{
    
},
lifetimes:{
    attached(){
        
    }
},
methods:{
    readImg(e){
        const url=e.detail.file.url
        getApp().uploadService.upload({urls:[url],sort:'user'})
        .then(res=>{
            // console.log(res)
            const user=getApp().globalData.user
            const oldUrl=user.profilePicUrl
            user.profilePicUrl=res[0].url
            getApp().userService.updateUser(user)
            .then(res1=>{
                this.setData({'user.profilePicUrl':res[0].url})
                eventBus.emit('userChangeEvent',null)
            }).catch(res2=>user.profilePicUrl=oldUrl)   
        })
        // console.log(e.detail.file)
    },
    onLoad(option){
        if(option.key==0)
            this.setData({enableEdit:false})
        else
            this.setData({enableEdit:true})
        const eventChannel = this.getOpenerEventChannel()
        eventChannel.on('userEditEvent',  (data)=>{
            this.setData({user:data.user,
                currentDate:new Date(data.user.birthday+'T12:00:00').getTime()})
        })
    },
    confirmBirthday(e){
        const date= new Date(e.detail)
        const y= date.getFullYear()
        const m= date.getMonth()+1
        const d= date.getDate()
        const birthday= y + "-" + (m < 10 ? "0" + m : m) + "-" + (d < 10 ? "0" + d : d)
        const user=getApp().globalData.user
        const oldBirthday=user.birthday
        user.birthday=birthday
        getApp().userService.updateUser(user)
        .then(res=>{
            eventBus.emit('userChangeEvent',null)
            this.setData({'user.birthday':birthday,dateShow:false})
        }).catch(res=>user.birthday=oldBirthday)
    },
    cancelBirthday(){
        this.setData({dateShow:false})
    },
    birthdayChange(e){
        console.log('日期变了')
        const date= new Date(e.detail)
        const y= date.getFullYear()
        const m= date.getMonth()+1
        const d= date.getDate()
        const birthday= y + "-" + (m < 10 ? "0" + m : m) + "-" + (d < 10 ? "0" + d : d)
        // this.setData({currentDate:e.detail,'user.birthday':birthday})
        // const user=getApp().globalData.user
        // const oldBirthday=user.birthday
        // user.birthday=birthday
        // getApp().userService.updateUser(user).then(res=>{
        //     this.setData({'user.birthday':birthday})
        //     wx.setStorage({key:'user',data:user})
        // }).catch(res=>user.birthday=oldBirthday)
    },
    dateSelect(){
        this.setData({dateShow:true})
    },
    genderSelectShow(){
        this.setData({genderShow:!this.data.genderShow})
    },
    genderSelect(){
        const user=getApp().globalData.user
        const oldGender=user.gender
        if(this.data.isMan) {
            user.gender='MALE'
            this.setData({'user.gender':'MALE'})
        }else{
            user.gender='FEMALE'
            this.setData({'user.gender':'FEMALE'})
        }
        getApp().userService.updateUser(user).then(res=>{
            this.setData({genderShow:!this.data.genderShow})
            eventBus.emit('userChangeEvent',null)
        }).catch(res=>user.gender=oldGender)
    },
    touchGender(e){
        const gender=e.currentTarget.dataset.gender
        if(gender=='0'){
            this.setData({isMan:false})
        }else{
            this.setData({isMan:true})
        }
    },
    navBack(){
        let pages = getCurrentPages();//获取page
        let prevPage = pages[pages.length-2];//上一个页面（父页面）
        prevPage.setData({user:this.data.user})
        wx.navigateBack()
    },
    navToNameEdit(){
        wx.navigateTo({url: `../name-edit/name-edit?key=0&content=${this.data.user.userName}`})
    },
    navToBioEdit(){
        wx.navigateTo({url: `../name-edit/name-edit?key=1&content=${this.data.user.bio}`})
    }
}
})