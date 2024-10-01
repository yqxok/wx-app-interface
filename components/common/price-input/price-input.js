Component({
properties:{
    show:Boolean
},
data:{
    inputValue:''
},
methods:{
    showTableEvent(){
        this.setData({show:true})
    },
    closeTableEvent(){
        this.setData({show:false})
    },
    chooseNum(e){
        if(!e.target.dataset.num)
            return;
        const num=e.target.dataset.num
        let inputValue=this.data.inputValue 
        if(num==='^'){
            this.triggerEvent('closePriceEvent')
            return
        }
        if(inputValue===''&&isNaN(parseInt(num)))
            return
        if(num==='.'&&inputValue.indexOf('.')!=-1)
            return
        if(!isNaN(parseInt(num)) &&inputValue.indexOf('.')!=-1&&inputValue.substr(inputValue.indexOf('.')+1).length>=2)
            return
        if(num==='finish'){
            const price=Number(inputValue)
            if(isNaN(price)) return
            this.triggerEvent('getPriceEvent',{price})
            return
        }
        if(num==='del'){
            inputValue= inputValue.slice(0,inputValue.length-1)
            this.setData({inputValue})
            return   
        }
        inputValue+=num
        this.setData({inputValue})
        
    }
   
}
})