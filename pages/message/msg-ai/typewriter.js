var index=0
// var text=''//原始文本
// var name=''//渲染数据名
//停止输出
const stop=()=>{
    index=0
}

const showText=(obj,name, textObj)=>{
   
    var _this=obj
    const handle=(index)=>{
        if (index <textObj.originText.length) {
            // 更新当前文本内容
            textObj.text +=textObj.originText[index]
            // 使用setData更新视图
            _this.setData({
                [`${name}.text`]:textObj.text
            })
            // 递归调用，显示下一个字符
            setTimeout(() => {
              handle(index + 1)
            }, textObj.typeSpeed?textObj.typeSpeed:30); // 每50毫秒显示一个字符
        }
    }
    if(textObj.text.length==index)
        handle(index)
    
}
module.exports={showText,stop}