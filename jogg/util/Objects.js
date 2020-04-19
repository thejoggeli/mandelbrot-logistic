function Objects(){}

Objects.def = function (obj, key, def){
	if(obj[key] === undefined){
		return def
	}
	return obj[key]
}
Objects.set = function(obj, key, def){
    if(obj[key] === undefined){
        obj[key] = def
    }
}

export default Objects
