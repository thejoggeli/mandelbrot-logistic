export default class Enum {
    constructor(entries_params){
        this.entries = []
        this.entries_by_id = {}
        if(entries_params){
            for(var t in entries_params){
                this.addEntry(entries_params[t])
            }
        }
    }
    addEntry(entry_params){
        var type = new Enum.Entry(entry_params)
        this.entries.push(type)
        this.entries_by_id[type.id] = type
        this[type.name] = type 
        return type
    }
    getEntryById(id){
        return this.entries_by_id[id]
    }
    getEntryByName(name){
        return this[name]
    }
    install(target){
        for(var t in this.entries){
            var type = this.entries[t]
            target[type.name] = type
        }
        return this
    }
}
Enum.Entry = class {
    constructor(params){
        this.id = params.id
        this.name = params.name
        delete params.id
        delete params.name
        for(var p in params){
            this[p] = params[p]
        }
    }
}