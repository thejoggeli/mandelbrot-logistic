import Log from "../log/Log.js"

class PacketSender {
    constructor(){
        this.packets = []
    }
    addPacket(packet){
        this.packets.push(packet)
        // Log.debug("GameClient", "Received " + packet.type.name)
    }
    getPackets(){
        return this.packets
    }
    clearPackets(){
        if(this.packets.length > 0){
            this.packets = []
        }
    }
    processAll(){
        Log.error("PacketSender", "processAll() not implemented")
    }
}


export default PacketSender