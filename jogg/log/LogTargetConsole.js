import Log              from "./Log.js"
import LogTargetBase    from "./LogTargetBase.js"

class LogTargetConsole extends LogTargetBase {
    constructor(){
        super()
        this.use_colors = true
        for(var e in Log.Levels.entries){
            Log.Levels.entries[e].color_console = "" 
        }
        Log.Info.color_console = "color: green"
        Log.Error.color_console = "color: red"
        Log.Warning.color_console = "color: orange"
        Log.Unknown.color_console = "color: blue"
        Log.Debug.color_console = "color: magenta"
    }
    print(level, source, ...message){
        if(level == Log.Error){
            console.error(...message)
        } else if(level == Log.Warning){
            console.warn(...message)
        }
        var prefix = "[" + level.short + "][" + source
        prefix = prefix.padEnd(this.prefix_pad_size-1, this.prefix_pad_char) + "]"
        if(this.use_colors && level.color_console != ""){
            console.log("%c" + prefix, level.color_console, ...message)
        } else {
            console.log(prefix, ...message)
        }
    }
}

export default LogTargetConsole