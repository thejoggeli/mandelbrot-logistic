import Numbers from "./Numbers.js"

function Vec2(x, y){
	this.x = x
	this.y = y
}
Vec2.create = function(x, y){
	var vec2 = new Vec2(x === undefined ? 0 : x, y === undefined ? 0 : y)
	return vec2
}
Vec2.set = function(out, x, y){
	out.x = x
	out.y = y
}
Vec2.setPolar = function(out, angle, length){
	out.x = Math.cos(angle)*length
	out.y = Math.sin(angle)*length
}
Vec2.copy = function(out, a){
	out.x = a.x
	out.y = a.y
}
Vec2.add = function(out, a, b){
	out.x = a.x+b.x
	out.y = a.y+b.y	
}
Vec2.addScaled = function(out, a, b, s){
	out.x = a.x+b.x*s
	out.y = a.y+b.y*s
}
Vec2.sub = function(out, a, b){
	out.x = a.x-b.x
	out.y = a.y-b.y
}
Vec2.mul = function(out, a, b){
	out.x = a.x/b.x
	out.y = a.y/b.y
}
Vec2.div = function(out, a, b){
	out.x = a.x/b.x
	out.y = a.y/b.y
}
Vec2.scale = function(out, a, s){
	out.x = a.x*s
	out.y = a.y*s
}
Vec2.normalize = function(out, a){
	var len = Math.sqrt(a.x*a.x+a.y*a.y)
	out.x = a.x/len
	out.y = a.y/len
}
Vec2.getLength = function(a){
	return Math.sqrt(a.x*a.x+a.y*a.y)
}
Vec2.setLength = function(out, a, len){	
	var norm = Math.sqrt(a.x*a.x+a.y*a.y)
	out.x = a.x/norm*len
	out.y = a.y/norm*len
}
Vec2.getLengthSquared = function(a){
	return a.x*a.x+a.y*ay
}
Vec2.getDistance = function(a, b){
	var x = a.x-b.x
	var y = a.y-b.y
	return Math.sqrt(x*x+y*y)
}
Vec2.getDistanceSquared = function(a, b){
	var x = a.x-b.x
	var y = a.y-b.y
	return x*x+y*y
}
Vec2.setAngle = function(out, a, angle){
	var len = Math.sqrt(a.x*a.x+a.y*a.y)
	out.x = Math.cos(angle)*len
	out.y = Math.sin(angle)*len
}
Vec2.rotate = function(out, a, deltaAngle){
	var len = Math.sqrt(a.x*a.x+a.y*a.y)
	var angle = deltaAngle + Math.atan2(a.y, a.x)
	out.x = Math.cos(angle)*len
	out.y = Math.sin(angle)*len	
}
Vec2.getDirectionOf = function(out, a, b){
	out.x = a.x
	out.y = a.y	
	var len = Math.sqrt(out.x*out.x+out.y*out.y)
	out.x /= len
	out.y /= len	
}
Vec2.getDirectionFromTo = function(out, a, b){
	out.x = (b.x-a.x)
	out.y = (b.y-a.y)	
	var len = Math.sqrt(out.x*out.x+out.y*out.y)
	out.x /= len
	out.y /= len	
}
Vec2.getAngle = function(a){
	return Math.atan2(a.y, a.x)
}
Vec2.getDeltaAngle = function(a, b){
    Numbers.deltaAngle(Math.atan2(a.y, a.x), Math.atan2(b.y, b.x))
}
Vec2.getAngleBetween = function(a, b){  
    return Math.atan2(target.y - source.y, target.x - source.x)
}
Vec2.equals = function(a, b){
	return a.x == b.x && a.y == b.y
}
Vec2.toString = function(a){
    return "Vec2 {x: " + a.x + ", y: " + a.y + "}"
}
Vec2.lerp = function(out, a, b, r){
    out.x = a.x + (b.x - a.x) * r
    out.y = a.y + (b.y - a.y) * r
}

export default Vec2