import Enum             from "../util/Enum.js"
import DynamicBuffer    from "../buffer/DynamicBuffer.js"
import DataType         from "../buffer/DataType.js"
import Log              from "../log/Log.js"

export default class Packet {
    constructor(){
        this.type = null
        this.data = null
        this.buffer = null
        this.initial_buffer_size = 32
    }
    pack(type, data){
        if(typeof type == "string"){
            type = Packet.Type.getEntryByName(type)
        }
        // data to bytes
        this.data = data
        this.buffer = new DynamicBuffer(this.initial_buffer_size)
        this.type = type
        this.buffer.beginWrite(0)
        this.buffer.writeUint16(this.type.id)
        if(type.pack){
            type.pack(this.buffer, data)
        } else {
            for(var x in type.attributes){
                var attribute = type.attributes[x]
                var value = data[attribute.name]
                if(value === undefined){
                    Log.error("BinaryPacket", "attribute missing: " + attribute.name)
                    value = attribute.default
                }
                attribute.type.write(this.buffer, value)
            }
        }
        return this
    }
    unpack(bytes){
        // bytes to data
        this.data = {}        
        this.buffer = new DynamicBuffer(bytes) 
        this.buffer.beginRead(0)
        var type_id = this.buffer.readUint16()
        this.type = Packet.Type.getEntryById(type_id)
        if(this.type.unpack){
            this.type.unpack(this.buffer, this.data)
        } else {
            for(var x in this.type.attributes){
                var attribute = this.type.attributes[x]
                this.data[attribute.name] = attribute.type.read(this.buffer)                
            }
        }
        return this
    }
}

Packet.Type = new Enum()
Packet.AddType = function(params){
    if(params.attributes){
        for(var x in params.attributes){
            var attribute = params.attributes[x]
            attribute.type = DataType[attribute.type]
        }
    }
    Packet.Type.addEntry(params)
}
