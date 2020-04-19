import Log              from "./Log.js"
import LogTargetBase    from "./LogTargetBase.js"

var FgBlack = "\x1b[30m"
var FgRed = "\x1b[31m"
var FgGreen = "\x1b[32m"
var FgYellow = "\x1b[33m"
var FgBlue = "\x1b[34m"
var FgMagenta = "\x1b[35m"
var FgCyan = "\x1b[36m"
var FgWhite = "\x1b[37m"

class LogTargetTerminal extends LogTargetBase {
    constructor(){
        super()
        for(var e in Log.Levels.entries){
            Log.Levels.entries[e].color_terminal = "" 
        }
        Log.Info.color_terminal = FgGreen
        Log.Error.color_terminal = FgRed
        Log.Warning.color_terminal = FgYellow
        Log.Unknown.color_terminal = FgBlue
        Log.Debug.color_terminal = FgMagenta
    }
    print(level, source, ...message){
        var prefix = "[" + level.short + "][" + source
        prefix = prefix.padEnd(this.prefix_pad_size-1, this.prefix_pad_char) + "]"
        prefix = level.color_terminal + prefix + FgWhite
        console.log(prefix, ...message)
    }
}

export default LogTargetTerminal