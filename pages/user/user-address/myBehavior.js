module.exports=Behavior({
methods:{
    modifyChoosed(zones,zoneShow){
        zoneShow.forEach((item,index)=>{
            item.choosed=item.zone.indexOf(zones[index])
        })
        
        return zoneShow
    },
    validateAddress(){
        const _addr=this.data.addressDto
        var reg = /^1[3456789]\d{9}$/;
        if(_addr.receiver==null)
            throw new Error('请输入联系人')
        if(!reg.test(_addr.phoneNumber))
            throw new Error('请输入有效的手机号码')
        if(!_addr.dormiInfo.school||!_addr.dormiInfo.zone||!_addr.dormiInfo.dormiName)
            throw new Error('请选择宿舍楼')
        if(_addr.dormiNum==null)
            throw new Error('请输入宿舍号')
        
    },

}
})