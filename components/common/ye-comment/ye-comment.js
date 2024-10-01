// const commentService=require('../../../service/goodCommentSevice')
const common=require('../../../utils/common.js')
Component({
properties: {
    // comments:{
    //     type:Array,
    //     value:[]
    // },
    goodDetailVo:{
        type:Object,
        value:null
    }
  
    // openAll:{
    //     type:Boolean,
    //     value:false
    // }
},
observers:{
    // comments:function(newValue){
    //     const newComments=this.data.newComments
    //     for(var i=0;i<newValue.length;i++){        
    //         if(newComments[i]){
    //             newValue[i].putAwayComment=newComments[i].putAwayComment
    //         }else{
    //             newValue[i].putAwayComment=true
    //         }
    //     }
    //     this.setData({newComments:newValue})
    // },
    goodDetailVo:function(newValue){
        const user=getApp().globalData.user
        if(newValue){
            getApp().goodCommentService.getGoodComments(newValue.goodId,user?user.userId:null)
            .then(res=>{
                res.data.forEach(item=>item.putAwayComment=true)
                this.setData({newComments:res.data})})
        }
    }
},
data: {
    newComments:[],
    input:{
        comment:null,
        inputValue:'',
        fatherId:null,
        commentStart:false,
        placeholder:'看对眼就留言，问问更多细节~'
    },
    marginBottom:0,
    inputFocus:false
},
methods: {
    showDialog(){
        this.setData({dialogShow:true})
    },
    getCommentList(goodId,userId){
        getApp().goodCommentService.getGoodComments(goodId,userId)
        .then(res=>this.setData({comments:res.data}))
    },
    getCommentMsg(g,commentId,type){
        return {
            commentId,goodId:g.goodId,content:g.content,senderId:g.userId,receiverId:g.replyUserId,type
        }
    },
    //回复评论区
    startComment(e){
        const user=getApp().globalData.user
        if(!user) return 
        var input=this.data.input
        var fatherId=null
        if(e.currentTarget.dataset.fatherid) fatherId=e.currentTarget.dataset.fatherid
        input.comment=e.currentTarget.dataset.comment
        input.arr=e.currentTarget.dataset.arr
        input.fatherId=fatherId
        input.commentStart=true
        if(input.comment){
            input.placeholder='回复：'+input.comment.userName
        }else{
            input.placeholder='看对眼就留言，问问更多细节~'
        }
        this.setData({input},()=>{
            setTimeout(()=>{
                this.setData({inputFocus:true})
            },100)
        })
        // this.triggerEvent('startCommentEvent',{comment,fatherId})
    },
    goodJob(e){
        const user=getApp().globalData.user
        if(!user) return
        const arr=e.currentTarget.dataset.arr,cmVos=this.data.newComments
        var item=null
        // console.log(arr)
        if(arr[1]==-1){
            item=cmVos[arr[0]]
            item.goodJobNum+=item.isGoodJob?-1:1
            item.isGoodJob=!item.isGoodJob
            this.setData({[`newComments[${arr[0]}].isGoodJob`]:item.isGoodJob,
            [`newComments[${arr[0]}].goodJobNum`]:item.goodJobNum})
        }else{
            item=cmVos[arr[0]].sonComments[arr[1]]     
            item.goodJobNum+=item.isGoodJob?-1:1
            item.isGoodJob=!item.isGoodJob
            this.setData({[`newComments[${arr[0]}].sonComments[${arr[1]}].isGoodJob`]:item.isGoodJob,[`newComments[${arr[0]}].sonComments[${arr[1]}].goodJobNum`]:item.goodJobNum})
        }
        if(item.isGoodJob)
            getApp().goodCommentService.saveGoodJob({commentId:item.commentId,userId:user.userId})
            .then(res=>{})
        else
            getApp().goodCommentService.deleteGoodJob({commentId:item.commentId,userId:user.userId})
            .then(res=>{})
    },
    resCommentEvent(e){
        const index=e.currentTarget.dataset.index
        if(index==0||index){//展开剩余评论或收起
            this.setData({[`newComments[${index}].putAwayComment`]:!this.data.newComments[index].putAwayComment})
        }
    },
    closeCommentView(){//
        this.setData({'input.commentStart':false,inputFocus:false})
    },
    keyboardOpen(e){//键盘开启
        this.setData({marginBottom:e.detail.keyboardH})
    },
    submitComment(e){
        const content=e.detail.value
        const input=this.data.input
        const user=getApp().globalData.user
        if(!user) return
        const goodCommentDto={goodId:this.properties.goodDetailVo.goodId,content,userId:user.userId}
        if(input.comment){//有回复评论
            goodCommentDto.fatherId=input.fatherId
            goodCommentDto.replyUserId=input.comment.userId
        }
        
        //保存评论
        getApp().goodCommentService.postGoodComment(goodCommentDto)
        .then(res=>{
            this.insertComment(res.data)
            const g=goodCommentDto
            console.log(g)
            if(g.replyUserId&&g.replyUserId!=g.userId){
                const commentMsgDto={commentId:res.data.commentId,goodId:g.goodId,content:g.content,senderId:g.userId,receiverId:g.replyUserId,type:0}
                const genericWsDto={uri:'/comment',data:commentMsgDto}
                getApp().chatContentSocket.send({data:JSON.stringify(genericWsDto)})
            }else if(!g.fatherId&&g.userId!=this.properties.goodDetailVo.userId){
                const commentMsgDto={commentId:res.data.commentId,goodId:g.goodId,content:g.content,senderId:g.userId,receiverId:this.properties.goodDetailVo.userId,type:1}
                const genericWsDto={uri:'/comment',data:commentMsgDto}
                getApp().chatContentSocket.send({data:JSON.stringify(genericWsDto)})
            }
        })
        // const input= this.data.input
        this.setData({'input.inputValue':''})
    },
    insertComment(cmVo){
       const arr=this.data.input.arr,cms=this.data.newComments
       if(arr[0]==-1&&arr[1]==-1){
            cms.splice(0,0,cmVo)
       }else if(arr[1]==-1){
           cms[arr[0]].sonComments.splice(0,0,cmVo)
           cms[arr[0]].sonCommentNum+=1
       }else{
           cms[arr[0]].sonComments.splice(arr[1],0,cmVo)
           cms[arr[0]].sonCommentNum+=1
       }
       this.setData({newComments:cms})
    
    }
}
})