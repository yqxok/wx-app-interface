const goodService=require('./goodService.js')
const userService=require('./userService.js')
const categoryService=require('./categoryService.js')
const uploadService=require('./uploadService.js')
const goodCommentService=require('./goodCommentSevice.js')
const addressService=require('./addressService.js')
const dormitoryService=require('./dormitoryService.js')
const chatContentService=require('./chatContentService.js')
const chatContentWs=require('./chatContentWs')
const collectService=require('./collectService')
const orderService=require('./orderService')
module.exports={
    goodService,
    userService,
    categoryService,
    uploadService,
    goodCommentService,
    addressService,
    dormitoryService,
    chatContentService,
    chatContentWs,
    collectService,
    orderService
}