import Canvas from "./Canvas.js";
import Objects from "../util/Objects.js";
import Vec2 from "../util/Vec2.js";
import Camera2d from "./Camera2d.js"

export class Canvas2d extends Canvas {
    constructor(id, params){
        super(id, params)
        
        this.clearColor             = Objects.def(params, "clearColor", null)
        this.autoClear              = Objects.def(params, "autoClear", true)
        this.autoTransformScreen    = Objects.def(params, "autoTransformScreen", true)
        this.autoTransformCamera    = Objects.def(params, "autoTransformCamera", true)
        
        // camera
        Objects.set(params, "camera", false)
        
        // camera component
        this.camera = null
        if(params.camera){
            this.createCamera()
        }
        
        // create 2d ctx
        this.$element.addClass("gfw-canvas")
        this.ctx = this.element.getContext("2d")
        Canvas2d.extendCtx(this.ctx)

    }
    createCamera(){
        if(this.camera) return
        this.camera = new Camera2d(this)
        return this.camera
    }
    clear(){
        this.ctx.clearRect(0, 0, this.element.width, this.element.height)
    }
    transformScreen(){
        this.ctx.translate(this.element.width/2, this.element.height/2)
        this.ctx.scale(this.scale, this.scale)
    }
    transformCamera(){
        if(!this.camera) return
        this.ctx.rotate(-this.camera.angle)
        this.ctx.scale(this.camera.zoom, this.camera.zoom)
        this.ctx.translate(-this.camera.position.x, -this.camera.position.y)
    }
    renderBegin(){
        super.renderBegin()
        if(this.should_render){  
            // notify subscribers
            this.notifySubscribers("RenderPreTransform", this)
            // transform
            this.ctx.save(); 
            if(this.autoClear){
                if(this.clearColor){
                    this.ctx.fillStyle = this.clearColor
                    this.ctx.fillRect(0,0,this.element.width, this.element.height)
                } else {
                    this.ctx.clearRect(0,0,this.element.width, this.element.height)
                }
            }
            if(this.autoTransformScreen){
                this.transformScreen()
            }
            if(this.autoTransformCamera){
                this.transformCamera()
            }
        }
    }
    render(){
        super.render()
        if(this.should_render){
            this.notifySubscribers("Render", this)
        }
    }
    renderEnd(){        
        super.renderEnd()
        if(this.should_render){
            this.ctx.restore()
            this.notifySubscribers("RenderPostTransform", this)
        }
    }
    canvasToWorld(out, a){
        out.x = a.x - this.element.width/2
        out.y = a.y - this.element.height/2
        Vec2.scale(out, out, 1.0/this.scale)
        if(this.camera){
            Vec2.scale(out, out, 1.0/this.camera.zoom)
            Vec2.rotate(out, out, this.camera.angle)
            Vec2.add(out, out, this.camera.position)
        }
    }
    centerToWorld(out, a){
        Vec2.scale(out, a, 1.0/this.scale)
        if(this.camera){
            Vec2.scale(out, out, 1.0/this.camera.zoom)
            Vec2.rotate(out, out, this.camera.angle)
            Vec2.add(out, out, this.camera.position)
        }
    }
}
Canvas2d.extendCtx = function(ctx){
	ctx.strokeLine = function(x1, y1, x2, y2){
		ctx.beginPath()
		ctx.moveTo(x1,y1)
		ctx.lineTo(x2,y2)
		ctx.stroke();	
	}
	ctx.strokeCircle = function(x, y, radius){
		ctx.beginPath()
		ctx.arc(x, y, radius, 0, Math.PI*2.0, false)
		ctx.stroke();	
	}
	ctx.fillCircle = function(x, y, radius){
		ctx.beginPath()
		ctx.arc(x, y, radius, 0, Math.PI*2.0, false)
		ctx.fill();	
	}
	ctx.fillArrow = function(length, thickness, head_scale){
        if(length == 0) return
		var head_thickness_half = thickness*head_scale
        var head_length = thickness*head_scale*2
        if(length-head_length < 0){
            var s = 1 + ((length-head_length)/head_length)
            length = head_length
            ctx.save()
            ctx.scale(s, s)
            ctx.beginPath()
            ctx.fillRect(0, -thickness/2, length-head_length, thickness)
            ctx.lineTo(length-head_length, -head_thickness_half)
            ctx.lineTo(length, 0)
            ctx.lineTo(length-head_length, head_thickness_half)
            ctx.fill()
            ctx.restore()
        } else {
            ctx.beginPath()
            ctx.fillRect(0, -thickness/2, length-head_length, thickness)
            ctx.lineTo(length-head_length, -head_thickness_half)
            ctx.lineTo(length, 0)
            ctx.lineTo(length-head_length, head_thickness_half)
            ctx.fill()
        }
	}
	ctx.fillQuad = function(x1, y1, x2, y2, x3, y3, x4, y4){
		ctx.beginPath()
		ctx.moveTo(x1, y1)
		ctx.lineTo(x2, y2)
		ctx.lineTo(x3, y3)
		ctx.lineTo(x4, y4)
		ctx.closePath()
		ctx.fill()
	}
	ctx.fillRoundRect = function(x, y, width, height, radius){
		ctx.pathRoundRect(x, y, width, height, radius)
		ctx.fill()
	}
	ctx.strokeRoundRect = function(x, y, width, height, radius){
		ctx.pathRoundRect(x, y, width, height, radius);	
		ctx.stroke();	
	}
	ctx.pathRoundRect = function(x, y, width, height, radius){
		ctx.beginPath()
		ctx.moveTo(x + radius, y)
		ctx.lineTo(x + width - radius, y)
		ctx.quadraticCurveTo(x + width, y, x + width, y + radius)
		ctx.lineTo(x + width, y + height - radius)
		ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
		ctx.lineTo(x + radius, y + height)
		ctx.quadraticCurveTo(x, y + height, x, y + height - radius)
		ctx.lineTo(x, y + radius)
		ctx.quadraticCurveTo(x, y, x + radius, y)
		ctx.closePath();	
	}
}