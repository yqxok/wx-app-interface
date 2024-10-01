module.exports={
    getWindowH(){
        let sysInfo=wx.getWindowInfo()
        console.log(sysInfo)
        return sysInfo.windowHeight-this.getNavH()
    },
    getNavH(){
        let statusH = wx.getSystemInfoSync().statusBarHeight
        let menuInfo=wx.getMenuButtonBoundingClientRect()
        let navH = (menuInfo.top - statusH) * 2 + menuInfo.height
        return navH+statusH
    },
    getRandomString(e){
        e = e || 32;
        var t = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678",
        a = t.length,
        n = "";
        for (i = 0; i < e; i++) n += t.charAt(Math.floor(Math.random() * a));
        return n
    }
}