class Timer {
    constructor(){
        this.startTime = 0.0
        this.endTime = 0.0
        this.duration = 0.0
    }
    start(time, duration){
        this.duration = duration
        this.startTime = time
        this.endTime = this.startTime + duration
    }
    restart(time, seamless){
        if(seamless){
            this.startTime += this.duration
            this.endTime += this.duration
        } else {
            this.start(time, this.duration)
        }
    }
    reset(){
        this.startTime = 0.0
        this.endTime = 0.0
        this.duration = 0.0
    }
    isFinished(time){
        if(this.duration == 0.0) return false; // timer is reset
        if(time < this.endTime) return false; // timer is running
        return true
    }
    isRunning(time){
        if(this.duration == 0.0) return false; // timer is reset
        if(time < this.endTime) return true; // timer is running
        return false
    }
    getAbsoluteRemainingTime(time){
        var remaining = this.endTime - time
        return remaining <= 0.0 ? 0.0 : remaining
    }
    getRelativeRemainingTime(time){
        var remaining = this.endTime - time
        return remaining <= 0.0 ? 0.0 : remaining/this.duration

    }
    getAbsolutePassedTime(time){
        var passed = time - this.startTime
        return passed >= this.duration ? this.duration : passed

    }
    getRelativePassedTime(time){
        var passed = time - this.startTime
        return passed >= this.duration ? this.duration : passed/this.duration

    }
}

export default Timer