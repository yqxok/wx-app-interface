module.exports=Behavior({
data:{

    goodList:{
        isEnd:false,
        current:1,
        records:[]
    },
    startX: 0,
    startY: 0,
},
lifetimes:{
    attached(){
    }
},
methods:{
    onTouchStart(e) {
        this.setData({
          startX: e.touches[0].pageX,
          startY: e.touches[0].pageY,
        });
    },
    onTouchMove(e) {
        const moveX = e.touches[0].pageX;
        const moveY = e.touches[0].pageY;
        const diffX = moveX - this.data.startX;
        const diffY = moveY - this.data.startY;
        console.log('dfsdfd')

        // 判断滑动方向，若为左右滑动，则阻止默认事件
        if (Math.abs(diffX) > Math.abs(diffY)) {
            e.preventDefault();
        }
    }
}
})