
module.exports=Behavior({
methods:{
    _chooseAll:function(cancelAll){
        const records= this.data.goodCollects.records
        if(this.data.isChoosedAll||cancelAll){
            records.forEach(item=>item.choosed=false)
            this.setData({'goodCollects.records':records})
        }else{
            records.forEach(item=>item.choosed=true)
            this.setData({'goodCollects.records':records})
        }
    }
}
})