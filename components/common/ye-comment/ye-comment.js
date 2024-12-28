// const commentService=require('../../../service/goodCommentSevice')
const common=require('../../../utils/common.js')
Component({
properties: {
    // comments:{
    //     type:Array,
    //     value:[]
    // },
    good:{
        type:Object,
        value:null    
    }
},
observers:{
    'good.goodId':function(newValue){
        const user=getApp().globalData.user
        if(!this.data.goodId&&newValue){
            const getComment=user?getApp().goodCommentService.comments:getApp().goodCommentService.commentsNoLogin
            getComment(newValue,0,8)
            .then(res=>{
                this.setData({comments:res.data,goodId:newValue})})
        }
    }
},
data: {
    comments:{cursor:0,isEnd:true,list:[]},
    input:{
        comment:null,//评论缓存
        fatherId:null,
        replyId:null,
        commentStart:false,//留言窗口是否开启
        isReply:false,//是否为回复评论
        placeholder:'看对眼就留言，问问更多细节~'
    },
    goodId:null,
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
        input.comment=e.currentTarget.dataset.comment
        input.arr=e.currentTarget.dataset.arr
        input.commentStart=true
        if(e.currentTarget.dataset.fatherid){
            input.isReply=true
            input.fatherId=e.currentTarget.dataset.fatherid
            input.replyId=input.comment.userInfo.userId
        } 
        if(input.comment){
            input.placeholder='回复：'+input.comment.userInfo.userName
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
        const arr=e.currentTarget.dataset.arr,cmVos=this.data.comments.list
        var item=null
        // console.log(arr)
        if(arr[1]==-1){
            item=cmVos[arr[0]]
            item.goodJobNum+=item.isGoodJob?-1:1
            item.isGoodJob=!item.isGoodJob
            this.setData({[`comments.list[${arr[0]}]`]:item})
        }else{
            item=cmVos[arr[0]].sonComments.list[arr[1]]     
            item.goodJobNum+=item.isGoodJob?-1:1
            item.isGoodJob=!item.isGoodJob
            this.setData({[`comments.list[${arr[0]}].sonComments.list[${arr[1]}]`]:item})
        }
        if(item.isGoodJob)
            getApp().goodCommentService.saveGoodJob(item.commentId?item.commentId:item.sonCommentId)
            .then(res=>{})
        else
            getApp().goodCommentService.deleteGoodJob(item.commentId?item.commentId:item.sonCommentId)
            .then(res=>{})
    },
    clickImg(e){
        this.triggerEvent('imgClickEvent',{userId:e.currentTarget.dataset.userid}) 
    },
    resCommentEvent(e){
        const index=e.currentTarget.dataset.index
        const comment=this.data.comments.list[index]
        const sonComments=comment.sonComments
        //展开剩余评论或收起
        if(!sonComments.isEnd){
            getApp().goodCommentService.sonCommentsNoLogin(comment.commentId,sonComments.cursor,6)
            .then(res=>{
                console.log(res.data)
                // const cursorPage=res.data
                sonComments.isEnd=res.data.isEnd
                sonComments.cursor=res.data.cursor
                sonComments.list.push(...res.data.list)
                sonComments.size+=res.data.size
                sonComments.showEnd=res.data.showEnd
                // comment.putAwayComment=!res.data.isEnd
                this.setData({[`comments.list[${index}]`]:comment})
            })
        }else if(comment.putAwayComment){
            this.setData({[`comments.list[${index}].putAwayComment`]:false,
            [`comments.list[${index}].sonComments.showEnd`]:false})
        }else{
            this.setData({[`comments.list[${index}].putAwayComment`]:true,
            [`comments.list[${index}].sonComments.showEnd`]:true})
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
        console.log("提交")
        if(!getApp().globalData.user) return
        // const goodCommentDto={goodId:this.data.good.goodId,content,userId:user.userId}
        if(input.isReply){//回复评论
            getApp().goodCommentService.sendSonComment(input.fatherId,input.replyId,content)
            .then(res=>{
                getApp().goodCommentService.comments(this.data.goodId,0,8)
                .then(res1=>this.setData({comments:res1.data}))
            })
        }else{
            getApp().goodCommentService.sendComment(this.data.goodId,content)
            .then(res=>{
                getApp().goodCommentService.comments(this.data.goodId,0,8)
                .then(res1=>this.setData({comments:res1.data}))
            })
        }
        this.setData({'input.commentStart':false})
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