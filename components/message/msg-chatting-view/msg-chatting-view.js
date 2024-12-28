
Component({
 
  properties:{
  },
  pageLifetimes:{
    show(){
      
    }
  },
  lifetimes:{
    attached(){
      const query=wx.createSelectorQuery().in(this)
      query.select('.msg-input-container').boundingClientRect((rect) => {
        console.log(rect)
        this.setData({
          preHight:rect.height
        })
      }).exec();
      this.query=wx.createSelectorQuery().in(this)
      this.query.select('.msg-input-container').boundingClientRect(rect=>{
        if(Math.abs(rect.height-this.data.preHight)>Number.EPSILON){
          this.setData({
            preHight:rect.height,
            height:rect.height+20,
            scrollTop:1000
          })
        }
      })
      
    }
  },
  methods:{
    //监听输入框高度
    handleInput(e){
      this.query.exec()
      
    }
  },
  data:{
    height:70,
    preHight:80,
    scrollTop:1000,
   
  
  
    
  }
})