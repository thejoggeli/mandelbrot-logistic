import Strings from "./Strings.js"

function Time(){}

Time.start_ms   = 0
Time.passed_ms  = 0
Time.curr_ms    = 0
Time.last_ms    = 0
Time.delta_ms   = 0

Time.start      = 0
Time.passed     = 0
Time.curr       = 0
Time.last       = 0
Time.delta      = 0
Time.delta_raw  = 0

Time.scale      = 1.0

Time.delta_min_ms = 0
Time.delta_max_ms = Infinity

Time.setScale = function(scale){
    Time.scale = scale
}

Time.setDeltaMinMillis = function(ms){
    this.delta_min_ms = ms
}
Time.setDeltaMaxMillis = function(ms){
    this.delta_max_ms = ms
}

Time.setDeltaMinMillis(1)       // 1000 FPS
Time.setDeltaMaxMillis(1000)    // 1 FPS

Time.start = function(){
    Time.start_ms   = Time.getTimeMillis()
    Time.curr_ms    = Time.start_ms
    Time.start      = Time.start_ms / 1000.0
    Time.curr       = Time.curr_ms  / 1000.0
}

Time.update = function(){
    Time.last_ms    = Time.curr_ms
    Time.curr_ms    = Time.getTimeMillis()
    Time.passed_ms  = Time.curr_ms - Time.start_ms
    Time.delta_ms   = Time.curr_ms - Time.last_ms

    if(Time.delta_ms < Time.delta_min_ms){
        Time.delta_ms = Time.delta_min_ms
    } else if(Time.delta_ms > Time.delta_max_ms){
        Time.delta_ms = Time.delta_max_ms
    }

    Time.last       = Time.last_ms   / 1000.0
    Time.curr       = Time.curr_ms   / 1000.0
    Time.passed     = Time.passed_ms / 1000.0
    Time.delta_raw  = Time.delta_ms  / 1000.0
    Time.delta      = Time.delta_raw * Time.scale

}

Time.getTimeMillis = function(){
	return (new Date()).getTime();
}

Time.sleep = function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

Time.toBeautifulString = function(time, ms, s, m, h, d){    
    var str = ""
    if(d){
        var hours = Math.floor(time / (3600*24))
        str += Strings.pad("00", hours.toString(),   true) + d        
    }    
    if(h){
        var hours = d ? Math.floor(time % (3600*24) / 3600) : Math.floor(time / 3600)
        str += Strings.pad("00", hours.toString(),   true) + h        
    }
    if(m){
        var minutes = h ? Math.floor((time % 3600) / 60) : Math.floor(time / 60)
        str += Strings.pad("00", minutes.toString(), true) + m
    }
    if(s){
        var seconds = m ? Math.floor(time % 60) : Math.floor(time)
        str += Strings.pad("00", seconds.toString(), true) + s
    }
    if(ms){
        var millis = s ? Math.floor((time % 1.0) * 1000.0) : Math.floor(time * 1000.0)
        str += Strings.pad("000", millis.toString(), true) + ms
    }
    return str
}

export default Time