import Vec2 from "../util/Vec2.js"
import Time from "../util/Time.js"

export default class Camera2d {
    constructor(canvas){
        this.canvas = canvas
        this.position = Vec2.create()
        this.zoom = 1
        this.angle = 0
        this.bounds = new Camera2d.Bounds()
    }
    recalcBounds(){
        var canvas = this.canvas
        
        var xx = canvas.width/2
        var yy = canvas.height/2
        var radius = Math.sqrt(xx*xx+yy*yy) / this.zoom

        this.bounds.left   = this.position.x - radius 
        this.bounds.right  = this.position.x + radius
        this.bounds.top    = this.position.y - radius 
        this.bounds.bottom = this.position.y + radius

        this.bounds.width  = this.bounds.right  - this.bounds.left
        this.bounds.height = this.bounds.bottom - this.bounds.top

    }
    simpleMove(speed){
        var dirx = 0
        var diry = 0
        if(this.canvas.input.isKeyDown(87)) diry = -1
        if(this.canvas.input.isKeyDown(83)) diry = 1
        if(this.canvas.input.isKeyDown(65)) dirx = -1
        if(this.canvas.input.isKeyDown(68)) dirx = 1
        if(dirx != 0 || diry != 0){    
            var angle = Math.atan2(diry, dirx) + this.angle
            dirx = Math.cos(angle)
            diry = Math.sin(angle)
            this.position.x += dirx * Time.delta * speed / this.zoom
            this.position.y += diry * Time.delta * speed / this.zoom
        }
    }
    simpleRotate(speed){
        if(this.canvas.input.isKeyDown(81)){
            this.angle -= Time.delta * speed
        } else if(this.canvas.input.isKeyDown(69)){
            this.angle += Time.delta * speed
        }
    }
    simpleZoom(speed){
        if(this.canvas.input.isKeyDown(82)){
            this.zoom += Time.delta * this.zoom * speed  
        } else if(this.canvas.input.isKeyDown(70)){
            this.zoom -= Time.delta * this.zoom * speed
            if(this.zoom < 0.001) this.zoom = 0.001
        }
    }
}
Camera2d.Bounds = class {
    constructor(){
        this.top = 0
        this.bottom = 0
        this.left = 0
        this.right = 0
        this.width = 0
        this.height = 0
    }
}