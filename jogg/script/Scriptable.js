import Log from "../log/Log.js"

export default class Scriptable {
    constructor(){        
        this.scripts = {}
        this.scripts_enabled = {}
    }
    setScriptEnabled(name, enabled){
        var script = this.scripts[name]
        if(!script){
            Log.error("Scriptable", "can't enable script, name doesn't exist, name=" + name)
            return
        }
        if(enabled){
            this.scripts_enabled[name] = script
            script.enabled = true
            script.onEnabled()
        } else {
            delete this.scripts_enabled[name]
            script.enabled = false
            script.onDisabled()
        }
    }
    addScript(name, script){
        if(this.scripts[name] !== undefined){
            Log.error("Scriptable", "can't add script, name already exists, name=" + name)
            return
        }
        this.scripts[name] = script
        if(script.enabled){
            this.scripts_enabled[name] = script
        }
        script.owner = this
        script.name = name
        script.onAdd()
        this.onScriptAdd(script)
        return script
    }
    getScript(name){
        return this.scripts[name]
    }
    removeScript(name){
        var script = this.scripts[name]
        if(!script){
            Log.warning("Scriptable", "can't remote script, name doesn't exist, name=" + name)
            return
        }
        delete this.scripts[name]
        delete this.scripts_enabled[name]
        script.onRemove()
        this.onScriptRemove(script)
    }
    onScriptAdd(script){
        // user
    }
    onScriptRemove(script){
        // user
    }
}