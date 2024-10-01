const Dialog=require('@vant/weapp/dialog/dialog.js')
Component({
data:{
    address:[
        // {receiver:'叶启欣',phoneNumber:13257676770,address:'东莞理工学院 松山湖 莞华12栋',dormiNum:304,default:true},
        // {receiver:'张三',phoneNumber:15766066826,address:'东莞理工学院 松山湖 莞博22栋',dormiNum:504, default:false}
    ],
    cfdAddressId:null,//确定要删除的addressId
    current:0,//当前默认的地址
    manageOpen:false,
    deleteTableShow:false,
    getAddress:false//是否点击地址项返回地址信息

},
observers:{
    address:function (v1) {
        console.log(v1)
    }
},
methods:{
    onLoad(option){

        if('key' in option&&option.key=='1'){
            this.setData({getAddress:true})
        }
    },
    reloadAddress(){
        const user=getApp().globalData.user
        getApp().addressService.getAddressList(user.userId)
        .then(res=>this.setData({address:res.data}))
    },
    onShow(){
        this.reloadAddress()
    },
    navBackWithAddress(e){
        const item=e.currentTarget.dataset.item
        // let oneselfAddress = e.currentTarget.dataset.address;
        let pages = getCurrentPages();//获取page
        let prevPage = pages[pages.length-2];//上一个页面（父页面）
        //直接调用上一个页面的setData()方法
        prevPage.setData({
            addressVo:item
        })
        wx.navigateBack()
    },
    onClickLeft(){
        wx.navigateBack()
    },
    manageSwitch(){
        this.setData({manageOpen:!this.data.manageOpen})
    },
    setDefault(e){
        const user=getApp().globalData.user
        const addressId=e.currentTarget.dataset.addressid
        getApp().addressService.setDefaultAddress(user.userId,addressId)
        .then(res=>this.reloadAddress())
        // const num=e.currentTarget.dataset.num
        // if(num==this.data.current) return
        // const address=this.data.address
        // address[this.data.current].default=false
        // address[num].default=true
        // this.setData({address,current:num})
    },
    deleteAddress(e){
        console.log(e)
        const num=e.target.dataset.num
        const addressId=e.currentTarget.dataset.addressid
        this.setData({deleteTableShow:true,cfdAddressId:addressId})
    },
    confirmDelete(){
        console.log('确认删除')
        const cfdAddressId=this.data.cfdAddressId
        if(cfdAddressId==null) return
        getApp().addressService.deleteAddress(cfdAddressId)
        .then(res=>{
           this.reloadAddress()
        })
    },
    cancelDelete(){
        this.setData({cfdAddressId:null})
    },
    navToAddressEdit(e){
        const index=e.currentTarget.dataset.index
        // const _this=this
        wx.navigateTo({url:'../user-address?key=1',//
            success:(res)=>{
                res.eventChannel.emit('addressDataEvent', { addressDto: this.data.address[index] })
            }
        })
    },
    navToNewAddress(){
        wx.navigateTo({
          url: '../user-address',
        })
    }
}
})