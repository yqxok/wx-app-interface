const http=require('../utils/promiseRequest.js')
module.exports={
    getDormitoryByName(school,zone){
        let tmp={school,zone}
        const data = Object.keys(tmp).reduce((obj, key) => {
            if (tmp[key] !== null && tmp[key] !== undefined) {
              obj[key] = tmp[key];
            }
            return obj;
          }, {});
        return  http.request({url:'/dormitory',data,method:'GET'})
    }
}