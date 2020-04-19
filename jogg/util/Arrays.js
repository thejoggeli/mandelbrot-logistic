function Arrays(){}
Arrays.removeObject = function(array, obj){
    var index
    while((index = array.indexOf(obj)) != -1){
		array.splice(index, 1)
    }
}
Arrays.removeIndex = function(array, index){	
	array.splice(index, 1)
}

export default Arrays