import Input        from "./Input.js"
import Vec2         from "../util/Vec2.js"
import Fullscreen   from "../util/Fullscreen.js"
import Objects      from "../util/Objects.js"
import Log          from "../log/Log.js"
import Subscribable from "../util/Subscribable.js"

export default class Canvas extends Subscribable {
    constructor(id, params){
        super()

        this.id = id
        this.installed = false
        this.renderRequested = false
        this.focused = false
        this.wasInViewport = false
        this.isInViewport = false
        this.scale = 1

        // params
        this.autoRender             = Objects.def(params, "autoRender", true)
        this.renderIfOffscreen      = Objects.def(params, "renderIfOffscreen", false)
        this.outerContainer         = Objects.def(params, "container", document.body)
        this.width                  = Objects.def(params, "width", 100)
        this.height                 = Objects.def(params, "height", 100)

        if(params.height === undefined){
            this.enableScaling = false
        } else {
            this.enableScaling = true
        }

        Objects.set(params, "input", false)
        
        // html
        this.$outerContainer = $(this.outerContainer)
        this.$innerContainer = $("<div class='gfw-canvas-container'>")
        this.element = document.createElement("canvas")
        this.$element = $(this.element)
        
        // input component        
        this.input = null
        if(params.input){
            this.createInput()
        }
    }
    createInput(){
        if(this.input) return
        this.input = new Input(this, this.$innerContainer)
        this.input.subscribe("Focus", this, this.onInputFocus)
        this.input.subscribe("Blur", this, this.onInputBlur)
        if(this.installed){
            this.input.install()
            this.input.resize()
        }
        return this.input
    }
    onInputFocus(){
        this.notifySubscribers("Focus", this)
        this.focused = true        
        this.$outerContainer.addClass("has-focus")
    }
    onInputBlur(){
        this.notifySubscribers("Blur", this)     
        this.focused = false   
        this.$outerContainer.removeClass("has-focus")
    }
    install(){
        Log.print(Log.Info, "Canvas", "install, id=" + this.id)
        this.installed = true
        this.$outerContainer.append(this.$innerContainer)
        this.$innerContainer.append(this.$element)
        if(this.input){
            this.input.install()
        }
    }
    uninstall(){
        Log.print(Log.Info, "Canvas", "uninstall, id=" + this.id)
        this.installed = false
        $(this.element).remove()
        if(this.input){
            this.input.uninstall()
        }
    }
    setFullscreen(fullscreen){
        if(fullscreen){
            Fullscreen.enter(this.$outerContainer[0])
            this.focus()
        } else {
            Fullscreen.leave(this.$outerContainer[0])
        }
        Fullscreen.refresh()
    }
    isFullscreen(){
        return this.$innerContainer.hasClass("fullscreen")
    }
    focus(){
        if(this.input){
            this.input.focus()
        }
    }
    blur(){
        if(this.input){
            this.input.blur()
        }
    }
    update(){
        this.updateIsInViewport()
        if(this.isInViewport != this.wasInViewport){
            if(this.isInViewport){
                this.notifySubscribers("EnterViewport", this)               
            } else {
                this.notifySubscribers("LeaveViewport", this)
            }
        }
        if(this.input){
            this.input.update()
        }
        this.notifySubscribers("Update", this)
    }
    requestRender(){
        this.renderRequested = true
    }
    renderBegin(){     
        this.should_render = false
        if(this.autoRender || this.renderRequested){
            if(this.renderIfOffscreen || this.isInViewport){
                this.should_render = true
            }
        }
    }
    render(){}
    renderEnd(){}
    finishFrame(){
        if(this.input){
            this.input.clearFrameKeys()
        }
        this.renderRequested = false
    }
    resize(){
        var containerWidth = this.$outerContainer.innerWidth()
        var containerHeight = this.$outerContainer.innerHeight()
        var canvas = this
        this.element.width = containerWidth
        this.element.height = containerHeight
        if(this.enableScaling){
            this.scale = this.element.height / this.height
            this.width = containerWidth/containerHeight * this.height 
        } else {
            this.scale = 1
            this.width = this.element.width
            this.height = this.element.height
        }
        if(this.input){
            this.input.resize()
        }
        this.requestRender()
        this.notifySubscribers("Resize", this)
    }
    getOffsetLeft(){
        return this.$outerContainer.offset().left
    }
    getOffsetTop(){
        return this.$outerContainer.offset().top
    }
    updateIsInViewport(){    
        var bounding = this.element.getBoundingClientRect();
        this.wasInViewport = this.isInViewport
        var w = (window.innerWidth || document.documentElement.clientWidth)
        var h = (window.innerHeight || document.documentElement.clientHeight)
        this.isInViewport = !(
            bounding.top >= h || 
            bounding.left >= w ||
            bounding.bottom <= 0 ||
            bounding.right <= 0
        );
    }
    canvasToWorld(out, a){
        out.x = a.x - this.element.width/2
        out.y = a.y - this.element.height/2
    }
    centerToWorld(out, a){
        Vec2.scale(out, a, 1.0/this.scale)
    }
}