import Vec2 from "../util/Vec2.js"
import Subscribable from "../util/Subscribable.js"
import Gfw from "./Gfw.js"

class Input extends Subscribable {
    constructor(canvas, $container){
        super()
        this.canvas = canvas 
        this.$container = $container
        this.downKeys = []
        this.frameDownKeys = []
        this.frameUpKeys = []
        this.newTouches = []
        this.touches = {}
        this.numTouches = 0
        this.hasFrameKeys = false
        this.mouse = new Input.MouseHandle(this)
        for(var i = 0; i < 256; i++){
            this.downKeys[i] = false
            this.frameDownKeys[i] = false
            this.frameUpKeys[i] = false
        }
        this.event = null
        this.preventKeys = {}
    }
    install(){        
        this.$overlay = $("<div class='gfw-input-overlay'>")
        this.$overlay.attr("tabindex", -1)
        this.$container.append(this.$overlay)
        this.$overlay.on("keydown", (e) => {
            if(this.downKeys[e.keyCode] == false){ 
                this.downKeys[e.keyCode] = true
                this.frameDownKeys[e.keyCode] = true
                this.hasFrameKeys = true
                this.notifySubscribers("KeyDown", e)
            }
            if(this.preventKeys[e.keyCode] || Gfw.preventKeys[e.keyCode]){
                e.preventDefault()
            }
        })
        this.$overlay.on("keyup", (e) => {
            this.downKeys[e.keyCode] = false
            this.frameUpKeys[e.keyCode] = true
            this.hasFrameKeys = true
            this.event = e
            this.notifySubscribers("KeyUp", this)
            if(this.preventKeys[e.keyCode] || Gfw.preventKeys[e.keyCode]){
                e.preventDefault()
            }
        })
        this.$overlay.on("mousedown ", (e) => {
            this.mouse.isDown = true
            this.mouse.downFrame = true
            var touchHandle = new Input.TouchHandle(this, "mouse")
            this.newTouches.push(touchHandle)
            this.touches.mouse = touchHandle
            this.mouse.setWindowPosition(e.pageX, e.pageY)
            this.event = e
            this.notifySubscribers("MouseDown", this)
        })
        this.$overlay.on("mouseup ", (e) => {
            this.mouse.setWindowPosition(e.pageX, e.pageY)
            this.mouse.isDown = false
            this.mouse.upFrame = true
            if(this.touches.mouse !== undefined){
                this.touches.mouse.expired = true
                delete this.touches.mouse
            }
            this.event = e
            this.notifySubscribers("MouseUp", this)
        })
        this.$overlay.on("mousemove ", (e) => {
            this.mouse.setWindowPosition(e.pageX, e.pageY)
            if(e.target != this.$overlay && e.which != 1){
                this.mouse.isDown = false
                this.mouse.upFrame = true
                if(this.touches.mouse !== undefined){
                    this.touches.mouse.expired = true
                    delete this.touches.mouse
                }
            }
            this.event = e
            this.notifySubscribers("MouseMove", this)
        })
        this.$overlay.on("mousewheel", (e) => {
            this.event = e
            this.notifySubscribers("MouseScroll", this)
        })
        this.$overlay.on("touchstart", (e) => {
            for(var t = 0; t < e.changedTouches.length; t++){
                var touch = e.changedTouches[t]
                var emulateMouse = this.numTouches == 0
                var touchHandle = new Input.TouchHandle(this, touch, emulateMouse)
                this.numTouches++
                this.newTouches.push(touchHandle)
                this.touches[touchHandle.id] = touchHandle
                touchHandle.setWindowPosition(touch.clientX, touch.clientY)
                if(touchHandle.emulateMouse){
                    this.mouse.isDown = true
                    this.mouse.downFrame = true
                    this.mouse.setWindowPosition(touch.clientX, touch.clientY)
                }
            }
            e.preventDefault()
            e.stopPropagation()
            this.event = e
            this.notifySubscribers("TouchStart", this)
        })
        this.$overlay.on("touchend", (e) => {
            for(var t = 0; t < e.changedTouches.length; t++){
                var touch = e.changedTouches[t]
                var touchHandle = this.touches[touch.identifier]
                touchHandle.expired = true
                if(touchHandle.emulateMouse){
                    this.mouse.isDown = false
                    this.mouse.upFrame = true
                    this.mouse.setWindowPosition(touch.clientX, touch.clientY)
                }
                delete this.touches[touchHandle.id]
                this.numTouches--
            }    
            e.preventDefault()
            e.stopPropagation()
            this.event = e
            this.notifySubscribers("TouchEnd", this)
        })
        this.$overlay.on("touchmove", (e) => {
            for(var t = 0; t < e.changedTouches.length; t++){        
                var touch = e.changedTouches[t]
                var touchHandle = this.touches[touch.identifier]
                touchHandle.setWindowPosition(touch.clientX, touch.clientY)
                if(touchHandle.emulateMouse){
                    this.mouse.setWindowPosition(touch.clientX, touch.clientY)
                }
            }
            e.preventDefault()
            e.stopPropagation()
            this.event = e
            this.notifySubscribers("TouchMove", this)
        })
        this.$overlay.on("focus", (e) => {
            this.notifySubscribers("Focus", this)
        })
        this.$overlay.on("blur", (e) => {
            this.notifySubscribers("Blur", this)
        })
    }
    setPreventKey(key, prevent){
        this.preventKeys[key] = prevent
    }
    uninstall(){
        this.$overlay.remove()
    }    
    update(){
    /*  for(var t in this.touches){
            var touch = this.touches[t]
            touch.updateWorldPosition()  
        } */
    }
    updateMousePosition(e){    
        this.mouse.setWindowPosition(e.pageX, e.pageY)
    }
    clearFrameKeys(){
        if(this.hasFrameKeys){
            for(var i = 0; i < 256; i++){
                this.frameDownKeys[i] = false
                this.frameUpKeys[i] = false
            }
            this.hasFrameKeys = false
        }
        this.mouse.downFrame = false
        this.mouse.upFrame = false
        // clear touches
        if(this.newTouches.length > 0){
            this.newTouches = []
        }
    }
    clear(){        
        this.downKeys = []
        this.frameDownKeys = []
        this.frameUpKeys = []
        this.newTouches = []
        for(var i = 0; i < 256; i++){
            this.downKeys[i] = false
            this.frameDownKeys[i] = false
            this.frameUpKeys[i] = false
        }
        this.touches = {}
        this.hasFrameKeys = false
        this.mouse.isDown = false
        this.mouse.downFrame = false
        this.mouse.upFrame = false
    }
    isKeyDown(code){
        return (this.downKeys[code] === true)
    }
    keyDown(code){
        return this.frameDownKeys[code]
    }
    keyUp(code){
        return this.frameUpKeys[code]
    }
    isMouseDown(){
        return this.mouse.isDown
    }
    mouseDown(){
        return this.mouse.downFrame
    }
    mouseUp(){
        return this.mouse.upFrame
    }
    resize(){
        this.$overlay.width(this.canvas.element.width)
        this.$overlay.height(this.canvas.element.height)
    }
    focus(){
        this.$overlay.focus()
    }
    blur(){
        this.$overlay.blur()
    }
}
Input.MouseHandle = class {
    constructor(input){
        this.input = input
        this.windowPosition = Vec2.create()
        this.canvasPosition = Vec2.create()
        this.centerPosition = Vec2.create()
        this.worldPosition = Vec2.create()
        this.isDown = false
        this.downFrame = false
        this.upFrame = false
    }
    setWindowPosition(x, y){
        // mouse position relative to window
        this.windowPosition.x = x
        this.windowPosition.y = y
        // mouse position relative to canvas (top left corner)
        this.canvasPosition.x = this.windowPosition.x - this.input.canvas.getOffsetLeft() 
        this.canvasPosition.y = this.windowPosition.y - this.input.canvas.getOffsetTop()
        // mouse position relative to canvas (center)
        this.centerPosition.x = this.canvasPosition.x - this.input.canvas.element.width/2
        this.centerPosition.y = this.canvasPosition.y - this.input.canvas.element.height/2
        // mouse position relative to world
        this.input.canvas.centerToWorld(this.worldPosition, this.centerPosition)
        // mouse prepends to be a touch
        var touch = this.input.touches.mouse
        if(touch){
            Vec2.copy(touch.worldPosition, this.worldPosition)
            Vec2.copy(touch.canvasPosition, this.canvasPosition)
            Vec2.copy(touch.windowPosition, this.windowPosition)
        }
    }

}
Input.TouchHandle = class {
    constructor(input, touch, emulateMouse){
        this.input = input
        this.windowPosition = Vec2.create()
        this.canvasPosition = Vec2.create()
        this.worldPosition = Vec2.create()
        this.emulateMouse = emulateMouse === undefined ? false : emulateMouse
        if(touch === "mouse"){
            this.id = "mouse_" + Input.TouchHandle.mouseIdCount++
            this.isMouse = true
            this.touch = null
        } else {
            this.id = touch.identifier
            this.isMouse = false
            this.touch = touch
        }    
        this.expired = false
        this.taken = false
    }      
    setWindowPosition(x, y){
        Vec2.set(this.windowPosition, x, y)
        this.updateCanvasPosition()
        this.updateWorldPosition()
    }
    updateCanvasPosition(){
        this.canvasPosition.x = this.windowPosition.x - this.input.canvas.getOffsetLeft() 
        this.canvasPosition.y = this.windowPosition.y - this.input.canvas.getOffsetTop()
    }
    updateWorldPosition(){
        this.input.canvas.screenToWorld(this.worldPosition, this.canvasPosition)
    }
}
Input.TouchHandle.mouseIdCount = 0

export default Input