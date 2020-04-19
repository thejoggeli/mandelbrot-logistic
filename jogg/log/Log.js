import Enum from "../util/Enum.js"
import LogTargetConsole from "./LogTargetConsole.js"

function Log(){}
Log.targets = []
Log.addTarget = function(target){
    Log.targets.push(target)
    Log.print(Log.Info, "Log", target.constructor.name + " added")
}
// (1) ...message
// (2) source, ...message
// (3) level, source, ...message
Log.print = function(...args){
    var level, source, message
    switch(args.length){
        case 0: {
            level = Log.Unknown
            source = "Anonymous"
            message = [""]
            break
        }
        case 1: {
            level = Log.Unknown
            source = "Anonymous"
            message = args 
            break
        } 
        case 2: {
            level = Log.Unknown
            source = args[0]
            message = args.slice(1)
            break
        }
        default: {
            level = args[0]
            source = args[1]
            message = args.slice(2)
        }
    }
    if(Log.targets.length == 0){
        Log.addTarget(new LogTargetConsole())
    }
    for(var i in Log.targets){
        Log.targets[i].print(level, source, ...message)        
    }
}
Log.info = function(...args){
    if(args.length == 1){
        args.unshift("Anonymous")
    }
    args.unshift(Log.Info)
    Log.print(...args)
}
Log.debug = function(...args){
    if(args.length == 1){
        args.unshift("Anonymous")
    }
    args.unshift(Log.Debug)
    Log.print(...args)
}
Log.warning = function(...args){
    if(args.length == 1){
        args.unshift("Anonymous")
    }
    args.unshift(Log.Warning)
    Log.print(...args)
}
Log.error = function(...args){
    if(args.length == 1){
        args.unshift("Anonymous")
    }
    args.unshift(Log.Error)
    Log.print(...args)
}
Log.Levels = new Enum([
    {id: 0x00, name: "Unknown", short: "?"},
    {id: 0x10, name: "Info",    short: "I"},
    {id: 0x20, name: "Debug",   short: "D"},
    {id: 0x30, name: "Warning", short: "W"},
    {id: 0x40, name: "Error",   short: "E"},
])
Log.Unknown = Log.Levels.getEntryById(0x00)
Log.Info    = Log.Levels.getEntryById(0x10)
Log.Debug   = Log.Levels.getEntryById(0x20)
Log.Warning = Log.Levels.getEntryById(0x30)
Log.Error   = Log.Levels.getEntryById(0x40)

export default Log