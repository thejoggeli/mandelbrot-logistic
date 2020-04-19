import Log from "../log/Log.js"
import Packet from "./Packet.js"
import Subscribable from "../util/Subscribable.js"

class PacketReceiver extends Subscribable {
    constructor(){
        super()
        this.packets = []
        this.subscriptions = {}
        this.enable_debug = false
    }
    addPacket(packet){
        // Log.debug("PacketReceiver", "Received " + packet.type.name)
        this.packets.push(packet)
    }
    getPackets(){
        return this.packets
    }
    clearPackets(){
        if(this.packets.length > 0){
            this.packets = []
        }
    }
    processPackets(){
        if(this.packets.length > 0){
            // first clear packets queue and keep a reference to the old current
            // this way subscribers can add new packets inside their event listeners 
            var packets = this.packets
            this.clearPackets()
            // notify subscribers
            for(var p in packets){
                var packet = packets[p]
                this.notifySubscribers(packet.type.name, packet)
            }
        }
    }
}

export default PacketReceiver
