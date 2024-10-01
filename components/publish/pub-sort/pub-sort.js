const { async } = require("validate.js")

Component({
properties:{
    //父组件传递的分类数组
    getCategory:Function,
    closed:{
        type:Boolean,
        value:false
    },
    allCategories:{//传入分类
        type:Array,
        value:[]
    }
},
observers:{
    allCategories:function (newVal) {
        
    }
},
data:{
    // all:[['手机','数码','玩具','户外','书籍'],['垃圾','狗屎','傻逼']],
    categories:{
        all:[],//网络请求的数据
        allBeChoose:false,
        chosenSort:[],//被选中的分类标签序号
    },
    sortBarHeight:'10rpx'
    //chosenSort[i]=j表示第i行的第j个被选中
},
lifetimes:{
    attached(){
        this.properties.getCategory({})
        .then(res=>{
            this.data.categories.all=[res.data]
            this.setData({categories:this.data.categories})
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
    //提供给父组件的api
    async setCategores(categories){
        const categoriesTmp=this.data.categories
        for(let index=0;index<categories.length;index++){
            let item=categories[index]
            const res =await this.properties.getCategory({pkId:item})
            if(res.data.length>0)
                categoriesTmp.all.push(res.data)
  
            const num= categoriesTmp.all[index].indexOf(item)
            categoriesTmp.chosenSort.push(num)
            
        }
        this.setData({'categories.all':categoriesTmp.all,'categories.chosenSort':categoriesTmp.chosenSort})
   

           
           
        // })
 
    },
    //提供给父组件的api
    getAllCategories(){
        
        const categories=this.data.categories
        categories.choosed=categories.chosenSort.map((value,index)=>categories.all[index][value])
        if(categories.choosed.length!==categories.all.length)
            throw new Error('请选择标签')
        return categories.choosed
    },
    //选中分类按钮
    async sortTap(e){
        if(!e.target.dataset.item)
            return
        const categories=this.data.categories
        const i=e.target.dataset.item[0]
        const j=e.target.dataset.item[1]

        if(categories.chosenSort[i]==j){//取消标签
            categories.all=categories.all.slice(0,i+1)
            categories.chosenSort=categories.chosenSort.slice(0,i)
            this.setData({categories})
        }else{//选中标签
            categories.chosenSort=categories.chosenSort.slice(0,i)
            categories.chosenSort.push(j)
            this.setData({'categories.chosenSort':categories.chosenSort})
            // categories.chosenSort.push(categories.all[i][j])
            const res= await this.properties.getCategory({pkId:categories.all[i][j]})
            categories.all=categories.all.slice(0,i+1)
            if(res.data.length>0){
                categories.all.push(res.data)
            }
            this.setData({'categories.all':categories.all})
        }
        
        this.triggerEvent('sortChangeEvent',{sort:categories.chosenSort.map((value,index)=>categories.all[index][value])})
        
    }
   
}
})