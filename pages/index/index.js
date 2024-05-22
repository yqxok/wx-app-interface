// index.js
Page({
  data:{
    msg:'马嘉祺',
    count:1
  },
  click({target}){
     console.log(target)
    // this.data.count+=1
    this.setData({
      count:this.data.count+1
    })
  }
})
