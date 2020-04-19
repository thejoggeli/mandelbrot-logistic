import Log from "../log/Log.js"

export default class Subscribable {
    constructor(){ 
        this.subscriptions = {}
    }
    // subscribe to type
    subscribe(type, caller, func){
        if(this.subscriptions[type] === undefined){
            this.subscriptions[type] = []
        }
        this.subscriptions[type].push({caller: caller, func: func})
    }
    // unsubscribe from type
    unsubscribe(type, caller){
        if(this.subscriptions[type] === undefined){
            Log.error("Subscribable", "can't unsubscribe because type not found (type=" + type + ")")        
            return
        }
        var subscribers = this.subscriptions[type]
        var i = subscribers.length
        while(i--){
            if(subscribers[i].caller == caller){
                subscribers.splice(i, 1)
            }
        }
    }
    // notify subscribers
    notifySubscribers(type, message){
        var subscribers = this.subscriptions[type]
        if(subscribers){
            for(var s in subscribers){
                subscribers[s].func.call(subscribers[s].caller, message)
            }
        }
    }
}