function getDateTime(createTime){
    // 使用split方法分割字符串
    let parts = createTime.split(" ");
    // 获取日期部分（mm/dd）
    let mm_dd = parts[0].split("/").slice(1).join("/");
    // 获取时间部分（hh:MM）
    let hh_MM = parts[1].split(":").slice(0, 2).join(":");
    return mm_dd+' '+hh_MM
}
function getTime(createTime){
    let parts = createTime.split(" ")
     // 获取时间部分（hh:MM
    let hh_MM = parts[1].split(":").slice(0, 2).join(":");
    return hh_MM
}

function convertTime(collect) {
    for (let i = 0; i < collect.length - 1; i++) {
        collect[i].createTime=collect[i].createTime.replace(/-/g, '/')
        collect[i+1].createTime=collect[i+1].createTime.replace(/-/g, '/')
        const current = collect[i];
        const next = collect[i + 1];
        const currentTime = new Date(current.createTime);
        const nextTime = new Date(next.createTime);
        const minutesDifference = Math.abs((nextTime - currentTime) / 60000);
        if (minutesDifference > 3) {
            current.sendTime='';
        }
    }
    collect[collect.length-1].sendTime=''
    const now = new Date();
    for (let i = 0; i < collect.length; i++) {
        const cur = collect[i];
        const createTime = new Date(cur.createTime);
        if (cur.sendTime===undefined) continue;

        // const daysDifference = Math.floor((now - createTime) / (1000 * 60 * 60 * 24));
        if (createTime.getDate() === now.getDate()) {
            cur.sendTime=getTime(cur.createTime)
        } else {
            cur.sendTime=getDateTime(cur.createTime)
        }
    }
}
function setSendTime(last,now){
     // 确保last和now都有createTime属性
     if (!last.createTime || !now.createTime) {
        console.error('Both objects must have a createTime property.');
        return;
    }

    // 将createTime字符串转换为Date对象
    const lastTime = new Date(last.createTime.replace(/-/g, '/'));
    const nowTime = new Date(now.createTime.replace(/-/g, '/'));

    // 计算两个时间的差值（以分钟为单位）
    const timeDifferenceInMinutes = Math.abs((nowTime - lastTime) / 60000);

    // 如果时间差大于3分钟
    if (timeDifferenceInMinutes > 3) {
        // 格式化now.createTime为HH:MM格式
        const hours = nowTime.getHours().toString().padStart(2, '0');
        const minutes = nowTime.getMinutes().toString().padStart(2, '0');
        const formattedTime = `${hours}:${minutes}`;
        // 赋值给now.createTime
        now.sendTime = formattedTime;
    }
}
function getCurrentTime() {
    const now = new Date();
    const year = now.getFullYear().toString(); // 获取年份
    const month = (now.getMonth() + 1).toString().padStart(2, '0'); // 获取月份，+1是因为getMonth()返回的月份是从0开始的
    const day = now.getDate().toString().padStart(2, '0'); // 获取日期
    const hours = now.getHours().toString().padStart(2, '0'); // 获取小时
    const minutes = now.getMinutes().toString().padStart(2, '0'); // 获取分钟
    const seconds = now.getSeconds().toString().padStart(2, '0'); // 获取秒

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
function getHourMinute(){
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0'); // 获取小时
    const minutes = now.getMinutes().toString().padStart(2, '0'); // 获取分钟
    return `${hours}:${minutes}`
}
module.exports={convertTime,setSendTime,getCurrentTime,getHourMinute}