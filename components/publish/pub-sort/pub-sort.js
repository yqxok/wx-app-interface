const { async } = require("validate.js")

Component({
properties:{
    closed:{
        type:Boolean,
        value:false
    },
   
},
data:{
    tags:[],//标签
    sortBarHeight:'10rpx'

},
lifetimes:{
    attached(){
        getApp().categoryService.getCategory()
        .then(res=>{
 
            this.data.tags.push(res.data)
            this.setData({tags:this.data.tags})
        })
    }
},
methods:{
    //展开分类栏
    openCategory(){
        this.triggerEvent('openCategoryEvent')
    },
    
    //提供给父组件的api
    isAllSelected(){
        const categories=this.data.categories
        return categories.chosenSort.length==categories.all.length
    },
    //提供给父组件的api,查询该商品的标签
    async setCategores(goodId){
        getApp().categoryService.getCategoryByGoodId(goodId)
        .then(res=>this.setData({tags:res.data}))
    },
    //提供给父组件的api，获取所选的标签
    getAllCategories(){
        const tags=this.data.tags
        let list=[]
        for(let i=0;i<tags.length;i++){
            if(tags[i].choose==-1)
                throw new Error('请选择标签')
            list.push(tags[i].categories[tags[i].choose])
        }
        return list
    },
    //选中分类按钮
    async sortTap(e){
        if(!e.target.dataset.item)
            return
        let tags=this.data.tags
        const i=e.target.dataset.item[0]
        const j=e.target.dataset.item[1]

        if(tags[i].choose==j){//取消标签
            tags=tags.slice(0,i+1)
            tags[i].choose=-1
            this.setData({tags})
        }else{//选中标签
            tags[i].choose=j
            const res= await getApp().categoryService.getCategory(tags[i].categories[j])
            tags=tags.slice(0,i+1)
            if(res.data.categories.length>0){
                tags.push(res.data)
            }
            this.setData({tags})
        }
    }
}
})