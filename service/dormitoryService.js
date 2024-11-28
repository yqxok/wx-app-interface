const http=require('../utils/promiseRequest.js')
module.exports={
    /**
     * 查询dormitory
     * @param {*} school 
     * @param {*} zone 
     */
    getDormitoryByName(school,zone){
        let tmp={school,zone}
        const data = Object.keys(tmp).reduce((obj, key) => {
            if (tmp[key] !== null && tmp[key] !== undefined) {
              obj[key] = tmp[key];
            }
            return obj;
          }, {});
        return  http.request({url:'/address/dormi',data,method:'GET'})
    },
    /**
     * 获取dormiId
     * @param {school,zone,dormiName} dormiInfo 
     */
    getDormiId(dormiInfo){
        return http.request({url:'/address/id',data:dormiInfo,method:'POST'})
    }
}