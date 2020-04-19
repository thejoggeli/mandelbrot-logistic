import Log              from "../log/Log.js"
import Fullscreen       from "../util/Fullscreen.js"
import Arrays           from "../util/Arrays.js"
import Objects          from "../util/Objects.js"
import FrequencyCounter from "../util/FrequencyCounter.js"
import Time             from "../util/Time.js"
import Timer            from "../util/Timer.js"
import Canvas           from "./Canvas.js"
import Subscribable     from "../util/Subscribable.js"
import { Canvas2d } from "./Canvas2d.js"
import { Canvas3d } from "./Canvas3d.js"

class GfwSingleton extends Subscribable {
    constructor(){
        super()
        this.installed = false
        this.started = false
    }
    install(_params){        
        Log.print(Log.Info, "Gfw", "install")
        
        this.preventKeys = {}
        this.focusedCanvas = null
        this.uninstallRequested = false
        this.requestAnimationFrameId = null
        this.fps = 0 
        this.nextCanvasId = 1
        this.started = false

        // params
        var params = _params === undefined ? {} : _params 

        // state variables
        this.installed = true
        this.started = false
        this.uninstallRequested = false
        this.requestAnimationFrameId = null
        this.focusedCanvas = null

        // fps counter
        this.fps = 0 
        this.fpsFrequencyCounter = new FrequencyCounter()
        this.fpsTimer = new Timer()

        // canvases
        this.canvases = []
        this.canvases_by_id = {}

        // fullscreen
        Fullscreen.install()

        // html
        var that = this
        this.resize_bind = function(){
            that.resize()
        }
        $(window).on("resize orientationchange", this.resize_bind)

        // resize just to be sure
        this.resize()
    }
    uninstall(){
        this.uninstallRequested = true
    }
    uninstallExecute(){
        Log.print(Log.Info, "Gfw", "uninstall")
        // state variables
        this.installed = false
        // canvases
        for(var i in this.canvases){
            this.canvases[i].uninstall()
        }
        // html
        $(window).off("resize orientationchange", this.resize_bind)
        // cancel animation frame
        window.cancelAnimationFrame(this.requestAnimationFrameId)
    }
    start(){
        if(this.started){
            Log.print(Log.Error, "Gfw", "already started")
            return
        }
        Time.start()
    
        // fps counter
        this.fps = 0 
        this.fpsTimer.start(Time.passed, 1)
        this.fpsFrequencyCounter.start(Time.passed)
    
        this.requestAnimationFrameId = window.requestAnimationFrame(() => this.frame())
        this.started = true
    }
    getCanvas(id){
        return this.canvases_by_id[id]
    }
    createCanvas(id, _params ){
        if(!this.installed){
            Log.print(Log.Error, "Gfw", "Gfw needs to be installed before a canvases can be created")
            return null
        }
        if(id === null){
            id = "null-" + (this.nextCanvasId++)
        }
        if(this.getCanvas(id) != null){
            Log.print(Log.Error, "Gfw", "canvas with id=" + id + " already exists")
            return null
        }
        var params = _params === undefined ? {} : _params
        var type = Objects.def(params, "type", "2d")
        var canvas = null
        if(type == "2d"){
            canvas = new Canvas2d(id, params)
        } else if(type == "3d"){
            canvas = new Canvas3d(id, params)
        } else {
            Log.error("Gfw", "invalid canvas type " + type)
            return null
        }
        this.canvases.push(canvas)
        this.canvases_by_id[id] = canvas
        canvas.install()
        canvas.subscribe("Focus", this, this.onCanvasFocus)
        canvas.subscribe("Blur", this, this.onCanvasBlur)
        // resize just to be sure
        this.resize()
        return canvas
    }
    onCanvasFocus(canvas){
        this.focusedCanvas = canvas
        this.notifySubscribers("Focus", canvas)
    }
    onCanvasBlur(canvas){
        if(this.focusedCanvas == canvas){
            this.focusedCanvas = null
        }
        this.notifySubscribers("Blur", canvas)        
    }
    destroyCanvas(id){
        var canvas = this.getCanvas(id)
        if(canvas){
            canvas.uninstall()
            Arrays.removeObject(this.canvases, canvas)
            delete this.canvases_by_id[id]
        }
    }
    resize(){
        for(var x in this.canvases){
            this.canvases[x].resize()
        }
        // notify subscribers
        this.notifySubscribers("Resize", this)
    }
    frame(){
        
        // update time
        Time.update()
    
        // fps counter
        this.fpsFrequencyCounter.count()
        if(this.fpsTimer.isFinished(Time.passed)){
            this.fps = this.fpsFrequencyCounter.compute(Time.passed)
            this.fpsTimer.restart(Time.passed)
        }

        // notify subscribers
        this.notifySubscribers("UpdateEarly", this)
    
        // update canvases    
        for(var x in this.canvases){
            this.canvases[x].update()
        }

        // notify subscribers
        this.notifySubscribers("UpdateLate", this)
        
        // notify subscribers
        this.notifySubscribers("RenderPreTransform", this)
    
        // render begin
        for(var x in this.canvases){
            this.canvases[x].renderBegin()
        }

        // notify subscribers
        this.notifySubscribers("RenderEarly", this)
    
        // render canvases
        for(var x in this.canvases){
            this.canvases[x].render()
        }

        // notify subscribers
        this.notifySubscribers("RenderLate", this)
    
        // render end
        for(var x in this.canvases){
            this.canvases[x].renderEnd()
        }

        // notify subscribers
        this.notifySubscribers("RenderPostTransform", this)
        
        // update canvases    
        for(var x in this.canvases){
            this.canvases[x].finishFrame()
        }
    
        // uninstall requested?
        if(this.uninstallRequested){
            this.uninstallExecute()
        } else {
            // next frame
            this.requestAnimationFrameId = window.requestAnimationFrame(() => this.frame())
        }
    }
    setPreventKey(key, prevent){
        this.preventKeys[key] = prevent
    }
}

var Gfw = new GfwSingleton()

export default Gfw