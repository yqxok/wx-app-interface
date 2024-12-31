var index=0
// var text=''//原始文本
// var name=''//渲染数据名
//停止输出
const stop=()=>{
    index=0
}
/**
 * 
 * @param {*} obj 组件实例
 * @param {*} name textObj的对象变量名
 * @param {text,originText} textObj text作为渲染的变量，originText为要渲染的文本
 * @param {*} call 渲染结束后的回调函数
 */
const showText=(obj,name, textObj,call=()=>{})=>{
   
    var _this=obj
    const handle=()=>{
        if (textObj.text.length <textObj.originText.length&&textObj.originText[textObj.text.length]!='[') {
            // 更新当前文本内容
            textObj.text +=textObj.originText[textObj.text.length]
            // 使用setData更新视图
            _this.setData({
                [`${name}.text`]:textObj.text
            })
            // 递归调用，显示下一个字符
            setTimeout(() => {
              handle()
            }, 20); // 每20毫秒显示一个字符
        }else if(textObj.text.length ==textObj.originText.length)
            call()
    }
    if(textObj.text.length <textObj.originText.length&&textObj.originText[textObj.text.length]!='[')
        handle()
    
}
module.exports={showText,stop}