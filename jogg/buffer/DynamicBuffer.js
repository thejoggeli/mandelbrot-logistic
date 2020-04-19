export default class DynamicBuffer {
    constructor(param_1){
        if(param_1 instanceof ArrayBuffer){
            // create from ArrayBuffer
            this.buffer = param_1
            this.view = new DataView(this.buffer)
            this.write_ptr = this.buffer.byteLength
            this.read_ptr = 0
        } else  if(typeof param_1 === 'number'){
            // create from Int (initial size)
            this.buffer = new ArrayBuffer(parseInt(param_1))
            this.view = new DataView(this.buffer)
            this.write_ptr = 0
            this.read_ptr = 0                
        } else {
            // create default size
            this.buffer = new ArrayBuffer(32)
            this.view = new DataView(this.buffer)
            this.write_ptr = 0
            this.read_ptr = 0
        }
    }
    getDataSize(){
        return this.write_ptr        
    }
    getBufferSize(){
        return this.buffer.byteLength
    }
    getDataView(){
        return new DataView(this.buffer, 0, this.write_ptr)
    }
    getBufferView(){
        return this.view
    }
    ensureSize(s){
        if(this.buffer.byteLength < s){
            var new_size = this.buffer.byteLength
            while(new_size < s){
                new_size *= 2
            }
            if(ArrayBuffer.transfer){
                this.buffer = ArrayBuffer.transfer(this.buffer, new_size)
            } else {
                // weird workaround, ArrayBuffer.transfer doesn't seem to work in node.js
                var old = this.buffer
                this.buffer = new ArrayBuffer(new_size)
                new Uint8Array(this.buffer).set(new Uint8Array(old))
            }
            this.view = new DataView(this.buffer)
        }
    }
    read(type){
        return type.read(this)
    }
    readInt8(){
        this.ensureSize(this.read_ptr +1 )
        var x = this.view.getInt8(this.read_ptr)
        this.read_ptr += 1
        return x
    }
    readUint8(){      
        this.ensureSize(this.read_ptr + 1)  
        var x = this.view.getUint8(this.read_ptr)
        this.read_ptr += 1
        return x
    }
    readInt16(){
        this.ensureSize(this.read_ptr + 2)
        var x = this.view.getInt16(this.read_ptr)        
        this.read_ptr += 2
        return x
    }
    readUint16(){
        this.ensureSize(this.read_ptr + 2)
        var x = this.view.getUint16(this.read_ptr)        
        this.read_ptr += 2
        return x
    }
    readInt32(){
        this.ensureSize(this.read_ptr + 4)
        var x = this.view.getint32(this.read_ptr)        
        this.read_ptr += 4
        return x
    }
    readUint32(){
        this.ensureSize(this.read_ptr + 4)
        var x = this.view.getUint32(this.read_ptr)        
        this.read_ptr += 4
        return x
    }
    readFloat32(){
        this.ensureSize(this.read_ptr + 4)
        var x = this.view.getFloat32(this.read_ptr)    
        this.read_ptr += 4    
        return x
    }
    readString(){
        var decoder = DynamicBuffer.TextDecoder
        var length = this.readUint16()
        var view = new DataView(this.buffer, this.read_ptr, length)
        var str = decoder.decode(view)
        this.read_ptr += length
        return str
    }
    readSkip(n){
        this.read_ptr += n
        return this
    }
    write(type, x){
        type.write(this, x)
    }
    writeInt8(x){
        this.ensureSize(this.write_ptr + 1)
        this.view.setInt8(this.write_ptr, x)
        this.write_ptr += 1
    }
    writeUint8(x){
        this.ensureSize(this.write_ptr + 1)
        this.view.setUint8(this.write_ptr, x)
        this.write_ptr += 1
    }
    writeInt16(x){
        this.ensureSize(this.write_ptr + 2)
        this.view.setInt16(this.write_ptr, x)
        this.write_ptr += 2
    }
    writeUint16(x){
        this.ensureSize(this.write_ptr + 2)
        this.view.setUint16(this.write_ptr, x)
        this.write_ptr += 2
    }
    writeInt32(x){
        this.ensureSize(this.write_ptr + 4)        
        this.view.setInt32(this.write_ptr, x)
        this.write_ptr += 4
    }
    writeUint32(x){
        this.ensureSize(this.write_ptr + 4)        
        this.view.setUint32(this.write_ptr, x)
        this.write_ptr += 4
    }
    writeFloat32(x){
        this.ensureSize(this.write_ptr + 4)    
        this.view.setFloat32(this.write_ptr, x)
        this.write_ptr += 4
    }
    writeString(str){
        var encoder = DynamicBuffer.TextEncoder
        var arr = encoder.encode(str)
        var length = arr.byteLength
        this.writeUint16(length)
        this.ensureSize(this.write_ptr + length)
        new Uint8Array(this.buffer).set(new Uint8Array(arr), this.write_ptr)
        this.write_ptr += length
    }
    beginRead(offset){
        this.read_ptr = offset
    }
    beginWrite(){
        this.write_ptr = 0
    }
    endWrite(){
        // nothing?
    }
}
DynamicBuffer.TextEncoder = new TextEncoder("utf-8")
DynamicBuffer.TextDecoder = new TextDecoder("utf-8")

