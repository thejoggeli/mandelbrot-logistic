import Strings from "./Strings.js"

function Numbers(){}

Numbers.PI2 = Math.PI*2
Numbers.rad2deg = 1/Math.PI*180
Numbers.deg2rad = 1/180*Math.PI

Numbers.clamp = function(x, min, max){
	if(x < min) return min
	if(x > max) return max
	return x
}

Numbers.linspace = function(start, stop, num, endpoint){
    var out = new Array(num)
    Numbers.linspace_inplace(out, start, stop, endpoint)
    return out
}
Numbers.linspace_inplace = function(out, start, stop, endpoint){
    var num = out.length
    var step = endpoint ? (stop-start)/(num-1) : (stop-start)/num
    for(var i = 0; i < num; i++){
        out[i] = start + step*i 
    }
    return out
}

Numbers.moveTowardsAngle = function(current, target, speed){
	current = current%Numbers.PI2
	target = target%Numbers.PI2
	if(current<0) current += Numbers.PI2
	if(target<0) target += Numbers.PI2
	var d1 = current-target
	if(d1 < 0) {d1 += Numbers.PI2}
	var d2 = target-current
	if(d2 < 0) {d2 += Numbers.PI2}
	if(d1>d2){
		return current+speed*Numbers.PI2;		
	} else {
		return current-speed*Numbers.PI2
	}
}

Numbers.deltaAngle = function(a1, a2){
	a1 = a1%Numbers.PI2
	a2 = a2%Numbers.PI2
	if(a1<Numbers.PI2) a1 += Numbers.PI2
	if(a2<Numbers.PI2) a2 += Numbers.PI2
	var diff = a2-a1
	if(diff > Math.PI){
		diff = -(Numbers.PI2-diff)
	} else if(diff < -Math.PI){
		diff = Numbers.PI2+diff
	}
	return diff
}

Numbers.lerpAngle = function(a, b, r){
    return a + Numbers.deltaAngle(a, b) * r
}
Numbers.lerpAngleClamp = function(minAngle, maxAngle, time){
	if(time >= 1){
		return maxAngle
	} else {		
		minAngle = minAngle%Numbers.PI2
		maxAngle = maxAngle%Numbers.PI2
		if(minAngle<Numbers.PI2) minAngle += Numbers.PI2
		if(maxAngle<Numbers.PI2) maxAngle += Numbers.PI2
		var diff = maxAngle-minAngle
		if(diff > Math.PI){
			diff = -(Numbers.PI2-diff)
		} else if(diff < -Math.PI){
			diff = Numbers.PI2+diff
		}
		return minAngle + diff * time
	}
}
Numbers.lerp = function(a, b, r){
	if(a == b) return a
	return a+(b-a)*r
}
Numbers.lerpClamp = function(a, b, r){
	if(a == b) return a
	var min = a > b ? b : a
	var max = a > b ? a : b
	return Numbers.clamp(a+(b-a)*r, min, max)
}


Numbers.roundTo = function(val, decimals){
	var p = Math.pow(10, decimals)
	return Math.round(val*p)/p
}

Numbers.roundToFixed = function(val, decimals, pad){
    if(pad){
        return Strings.pad(pad, Numbers.roundTo(val,decimals).toFixed(decimals), true)
    } else {
        return Numbers.roundTo(val,decimals).toFixed(decimals)
    }
}

Numbers.randomInt = function(min,max){
	return Math.floor(Math.random()*(max-min)+min)
}

Numbers.randomElement = function(array){
	return array[0, Numbers.randomInt(0, array.length)]
}

Numbers.randomFloat = function(min,max){
	return Math.random()*(max-min)+min
}

Numbers.randomBool = function(trueChance){
	return Math.random() < trueChance
}

export default Numbers