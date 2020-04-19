export default class {
    constructor(size){
        this.buffer = new Array(size)
        for(var i in this.buffer){
            this.buffer[i] = 0
        }
        this.pointer = 0
        this.average = 0
    }
    push(val){
        this.buffer[this.pointer++] = val
        if(this.pointer == this.buffer.length){
            this.pointer = 0
        }
        return this
    }
    compute(){
        var sum = 0
        for(var i in this.buffer){
            sum += this.buffer[i]
        }
        this.average = sum / this.buffer.length
        return this.average
    }

}