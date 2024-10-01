module.exports={
    copyProperties(source,target){
        for (const key in target) {
            if (source.hasOwnProperty(key)) {
              target[key] = source[key];
            }
        }
    }
}