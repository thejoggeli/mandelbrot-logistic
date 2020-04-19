import Log from "../log/Log.js"
import Subscribable from "./Subscribable.js"

class Messenger extends Subscribable {
    constructor(){ 
        super()
        this.messages = []
        this.messages_by_type = {}
        this.subscriptions = {}
    }
    // send message immediately
    sendMessage(type, message){
        this.notifySubscribers(type, message)
    }
    // add message to queue
    addMessage(type, message){
        Log.debug("Messenger", type)
        this.messages.push(message)
        if(this.messages_by_type[type] === undefined){
            this.messages_by_type[type] = []
        }
        this.messages_by_type[type].push(message)
    }
    // send all messages in queue
    processMessages(){
        if(this.messages.length > 0){
            // first clear messages queue and keep a reference to the old current
            // this way subscribers can add new messages inside their event listeners
            var messages_by_type = this.messages_by_type
            this.clearMessages()
            // notify subscribers
            for(var type in messages_by_type){
                var messages = messages_by_type[type]
                for(var m in messages){
                    this.notifySubscribers(type, messages[m])
                } 
            }
        }
    }
    // clear message queue
    clearMessages(){
        if(this.messages.length > 0){
            this.messages = []
            this.messages_by_type = {}
        }
    }
}

export default Messenger