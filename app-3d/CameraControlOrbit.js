import Time from "../jogg/util/Time.js"
import { quat, vec3, mat3, mat4, vec2 } from "../jogg/gl-matrix/index.js"
import Vec2 from "../jogg/util/Vec2.js"
import Numbers from "../jogg/util/Numbers.js"

export default class CameraControlOrbit {
    constructor(camera, context){
        this.camera = camera
        this.camera.useEulers = false
        this.zoom_exp = 0
        this.zoom = Math.pow(10, this.zoom_exp)
        this.distance = 1000
        this.angle_left_right = 0
        this.angle_up_down = 0
        this.mat4 = mat4.create()
        this.mat3 = mat3.create()
        // up direction
        this.up = vec3.create()
        vec3.set(this.up, 0, 1, 0)
        // orbit target
        this.target = vec3.create()
        vec3.set(this.target, 0, 0, 0)
        // apply 
        this.apply()
        // subscribe
        this.context = context
        this.input = context.input
        this.input.subscribe("MouseDown", this, this.onMouseDown)
        this.input.subscribe("MouseMove", this, this.onMouseMove)
        this.input.subscribe("MouseUp", this, this.onMouseUp)
        this.input.subscribe("MouseScroll", this, this.onMouseScroll)
        // mouse drag
        this.mouseDown_orbit = false
        this.mouseDown_move = false
        this.mouseDown_target = vec3.create()
        this.mouseDown_screen_position = Vec2.create()
        this.mouseDown_angle_left_right = this.angle_left_right
        this.mouseDown_angle_up_down = this.angle_up_down
    }
    onMouseScroll(input){
        var e = input.event
        var dzoom = e.originalEvent.deltaY * 0.0005
        this.zoom_exp -= dzoom
        this.zoom = Math.pow(10, this.zoom_exp)        
        this.apply()
    }
    onMouseDown(input){
        var e = input.event
        if(e.which == 1){
            this.mouseDown_orbit = true
        } else if(e.which == 2){
            this.mouseDown_move = true
        }
        Vec2.copy(this.mouseDown_screen_position, input.mouse.canvasPosition)
        this.mouseDown_angle_left_right = this.angle_left_right
        this.mouseDown_angle_up_down = this.angle_up_down
        vec3.copy(this.mouseDown_target, this.target)
        e.preventDefault()
    }
    onMouseMove(input){
        if(this.mouseDown_orbit){
            var mouseMove_screen_position = input.mouse.canvasPosition
            var dx = mouseMove_screen_position.x - this.mouseDown_screen_position.x
            var dy = mouseMove_screen_position.y - this.mouseDown_screen_position.y
            var height = input.canvas.height
            this.angle_left_right = this.mouseDown_angle_left_right - dx / height * 4
            this.angle_up_down = this.mouseDown_angle_up_down + dy / height * 4 
            this.angle_up_down = Numbers.clamp(this.angle_up_down, -Math.PI/2.0, Math.PI/2.0)
            this.apply()
        } else if(this.mouseDown_move){
            var mouseMove_screen_position = input.mouse.canvasPosition
            vec3.copy(this.target, this.mouseDown_target)
            var dx = mouseMove_screen_position.x - this.mouseDown_screen_position.x
            var dy = mouseMove_screen_position.y - this.mouseDown_screen_position.y
            var height = input.canvas.height
            var s = 2 / height / this.zoom
            var csin = Math.sin(this.angle_up_down)
            var ccos = Math.cos(this.angle_up_down)
            this.translate(-dx*s, dy*s*ccos, -dy*s * csin)
            this.apply()
        }
    }
    onMouseUp(input){
        this.mouseDown_orbit = false
        this.mouseDown_move = false
    }
    translate(x, y, z){
        var csin = Math.sin(-this.angle_left_right)
        var ccos = Math.cos(-this.angle_left_right)
        var dx = x * ccos - z * csin
        var dz = x * csin + z * ccos
        this.target[0] += dx
        this.target[1] += y
        this.target[2] += dz   
    }
    update(context){
        var input = context.input
        var changed = false
        var mx = 0, mz = 0
        if(input.isKeyDown(87)){
            mz -= Time.delta * Math.sign(this.angle_up_down)
            changed = true
        } else if(input.isKeyDown(83)){
            mz += Time.delta * Math.sign(this.angle_up_down)
            changed = true
        }
        if(input.isKeyDown(65)){
            mx -= Time.delta
            changed = true
        } else if(input.isKeyDown(68)){
            mx += Time.delta
            changed = true
        }
        if(changed){
            this.translate(mx / this.zoom, 0, mz / this.zoom)
        }
        if(input.isKeyDown(82)){
            this.zoom_exp += Time.delta
            this.zoom = Math.pow(10, this.zoom_exp)
            changed = true
        } else if(input.isKeyDown(70)){
            this.zoom_exp -= Time.delta
            this.zoom = Math.pow(10, this.zoom_exp)
            changed = true
        }
        if(input.isKeyDown(37)){
            this.angle_left_right -= Time.delta
            changed = true
        } else if(input.isKeyDown(39)){
            this.angle_left_right += Time.delta
            changed = true
        }
        if(input.isKeyDown(38)){
            this.angle_up_down = Math.min(Math.PI/2.0, this.angle_up_down + Time.delta)
            changed = true
        } else if(input.isKeyDown(40)){
            this.angle_up_down = Math.max(-Math.PI/2.0, this.angle_up_down - Time.delta)
            changed = true
        }
        if(changed){
            this.apply()
        }
    }
    apply(){
        this.angle_left_right = this.angle_left_right%(Math.PI*2)
        if(this.angle_left_right < 0){
            this.angle_left_right += Math.PI*2
        } 
        if(this.angle_up_down > Math.PI/2.0 - 0.02){
            this.camera.position[0] = this.target[0]
            this.camera.position[2] = -this.target[2]
            this.camera.position[1] = this.distance
            this.camera.useEulers = true
            this.camera.eulers[0] = 90
            this.camera.eulers[1] = - this.angle_left_right / Math.PI * 180
            this.camera.eulers[2] = 0
        } else if(this.angle_up_down < -Math.PI/2.0 + 0.02){
            this.camera.position[0] = this.target[0]
            this.camera.position[2] = -this.target[2]
            this.camera.position[1] = this.distance
            this.camera.useEulers = true
            this.camera.eulers[0] = -90
            this.camera.eulers[1] = - this.angle_left_right / Math.PI * 180
            this.camera.eulers[2] = 0
        } else {
            var y = Math.sin(this.angle_up_down) * this.distance
            var r = Math.cos(this.angle_up_down) * this.distance
            this.camera.position[0] = Math.sin(this.angle_left_right) * r
            this.camera.position[2] = Math.cos(this.angle_left_right) * r
            this.camera.position[1] = y
            vec3.add(this.camera.position, this.camera.position, this.target)
            this.camera.useEulers = false
            mat4.lookAt(this.mat4, this.camera.position, this.target, this.up)
            mat4.invert(this.mat4, this.mat4)
            mat3.fromMat4(this.mat3, this.mat4)
            quat.fromMat3(this.camera.rotation, this.mat3)
        }
        var scale = 1.0 / this.zoom 
        vec3.set(this.camera.scale, scale, scale, scale)
        this.camera.viewMatrixNeedsUpdate = true
    }
}