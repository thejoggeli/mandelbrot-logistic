class FrequencyCounter {    
    constructor(){
        this.frequency = 0
        this.counter = 0
        this.timer = 0
    }
    start(time){
        this.timer = time
    }
    count(){
        this.counter++
    }
    compute(time){
        var last = this.timer
        var curr = time
        if(this.counter == 0){
            this.frequency = Infinity
        } else {
            this.frequency = this.counter / (curr - last)
        }
        this.counter = 0
        this.timer = curr
        return this.frequency
    }
}

export default FrequencyCounter