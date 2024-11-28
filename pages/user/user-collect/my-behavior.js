
module.exports=Behavior({
methods:{
    _chooseAll:function(cancelAll){
        const list= this.data.goodCollects.list
        if(this.data.isChoosedAll||cancelAll){
            list.forEach(item=>item.choosed=false)
            this.setData({'goodCollects.list':list})
        }else{
            list.forEach(item=>item.choosed=true)
            this.setData({'goodCollects.list':list})
        }
    }
}
})