import Gfw from "../jogg/gfw/Gfw.js"
import Monitor from "../jogg/util/Monitor.js"
import Time from "../jogg/util/Time.js"
import ShaderProgram from "../jogg/webgl/ShaderProgram.js"
import Shader from "../jogg/webgl/Shader.js"
import Shaders from "./Shaders.js"
import {vec2, vec3, mat4} from "../jogg/gl-matrix/index.js"
import Camera3d from "../jogg/gfw/Camera3d.js"
import VertexBuffer from "./VertexBuffer.js"
import Log from "../jogg/log/Log.js"
import CameraControlOrbit from "./CameraControlOrbit.js"
import Numbers from "../jogg/util/Numbers.js"

class AppSingleton {
    init(){

        // monitor
        this.monitor = new Monitor()
        this.monitor.install()
        this.monitor.set("FPS", "")

        // gfw
        Gfw.install()
        this.canvas = Gfw.createCanvas("main", {
            container: document.querySelector(".canvas-container"),
            type: "3d",
            input: true,
        })
        
        // camera
        this.camera = new Camera3d()
        this.cameraControlOrbit = new CameraControlOrbit(this.camera, this.canvas)
        this.cameraControlOrbit.target[0] = -0.75
        this.cameraControlOrbit.apply()
        
        // subscribe
        this.canvas.subscribe("Resize", this, this.resize)
        this.canvas.subscribe("Update", this, this.update)
        this.canvas.subscribe("Render", this, this.render)

        // gl
        this.gl = this.canvas.gl
        this.initWebgl()

        // compute
        this.compute()
        
        // remove loading 
        $(".loading").remove()

        // fullscreen
        this.canvas.setFullscreen(true)

        // start
        Gfw.start()
    }
    initWebgl(){
        var gl = this.gl
        // gl.enable(gl.DEPTH_TEST)
        gl.enable(gl.BLEND)
        gl.blendEquation(gl.FUNC_ADD)
        gl.blendFunc(gl.SRC_ALPHA, gl.DST_ALPHA)
        gl.clearColor(0, 0, 0, 1)
        // shaders
        this.vertexShader = new Shader(gl, "Vertex", Shaders.vertex)
        this.fragmentShader = new Shader(gl, "Fragment", Shaders.fragment)
        // compile shaders
        this.vertexShader.compile()
        this.fragmentShader.compile()
        // shader program
        this.shaderProgram = new ShaderProgram(gl)
        this.shaderProgram.attachShader(this.vertexShader)
        this.shaderProgram.attachShader(this.fragmentShader)
        this.shaderProgram.link()
        this.shaderProgram.addAttribute("aVoxelPosition")
        this.shaderProgram.addAttribute("aVoxelColor")
        this.shaderProgram.addUniform("uPointSize")
        this.shaderProgram.addUniform("uCameraTransform")
        // voxels positions
        this.voxelsPositions = new VertexBuffer(gl, gl.DYNAMIC_DRAW)
        // voxels colors
        this.voxelsColors = new VertexBuffer(gl, gl.DYNAMIC_DRAW)
        this.voxelsColors.pitch = 4
        // vectors
        this.vec3 = vec3.create()
        this.mat4 = mat4.create()
    }
    compute(){

        var gl = this.gl

        var t_start = Time.getTimeMillis()
        
        this.voxels_density = 512

        var position_x = -1.0
        var position_z = 0.0

        var bounding_box_size_x = 4.0
        var bounding_box_size_z = 2.0

        var num_voxels_x = Math.floor(this.voxels_density * bounding_box_size_x)
        var num_voxels_z = Math.floor(this.voxels_density * bounding_box_size_z)

        if(num_voxels_x%2==0) 
            num_voxels_x += 1
        if(num_voxels_z%2==0) 
            num_voxels_z += 1

        var step_x = bounding_box_size_x/num_voxels_x
        var step_z = bounding_box_size_z/num_voxels_z
        
        this.voxels_density_x = 1.0/step_x
        this.voxels_density_z = 1.0/step_z
        
        var offset_x = position_x-step_x*(num_voxels_x-1)*0.5 // + step_x/2.0
        var offset_z = position_z-step_z*(num_voxels_z-1)*0.5 // + step_z/2.0

        var scale_y = 2.0/3.0

        var voxels_positions = []
        var voxels_colors = []

        const max_iterations = 1024*4

        var max_z_points = Math.min(max_iterations, 512)
        var z_re_values = new Array(max_iterations)
        var z_re_values_end = z_re_values.length
        var z_re_values_end_minus_max = z_re_values.length - max_z_points

        for(var voxel_x = 0; voxel_x < num_voxels_x; voxel_x++){
            for(var voxel_z = 0; voxel_z < num_voxels_z; voxel_z++){
                const world_x = offset_x + voxel_x * step_x
                const world_z = offset_z + voxel_z * step_z

                const c_re = world_x
                const c_im = world_z
                var z_re = 0
                var z_im = 0

                var is_in_set = true

                for(var i = 0; i < max_iterations; i++){
                    var a = z_re
                    var b = z_im
                    z_re = a*a - b*b + c_re
                    z_im = 2*a*b + c_im
                    var z_squared = z_re*z_re + z_im*z_im
                    if(z_squared > 4.0){
                        is_in_set = false
                        break
                    }
                    z_re_values[i] = z_re
                }

                if(is_in_set){                
                    var z_re_values_start = z_re_values_end_minus_max
                    var z_re_values_last = z_re_values[z_re_values_end-1]
                    for(var j = z_re_values_end-2; j >= z_re_values_end_minus_max; j--){
                        /*
                        var z_re_values_curr = z_re_values[j]
                        var rel_err = Math.abs(1-(
                            z_re_values_last > z_re_values_curr ?
                            z_re_values_curr / z_re_values_last :
                            z_re_values_last / z_re_values_curr
                        ))
                        if(rel_err < 1E-6){
                            z_re_values_start = j+1
                            break
                        } 
                        */
                        var z_re_values_curr = z_re_values[j]
                        if(z_re_values_curr == z_re_values_last){
                            z_re_values_start = j+1
                            break
                        } 
                    }
                    var actual_z_points = z_re_values_end - z_re_values_start

                    var gray    = actual_z_points / max_z_points              
                    var red     = gray + 0.5
                    var green   = gray
                    var blue    = gray
                    var alpha   = 1.0-(actual_z_points / max_z_points) * (world_z == 0.0 ? 0.8 : 0.99)
                    for(var j = z_re_values_start; j < z_re_values_end; j++){
                        const world_y = -z_re_values[j] * scale_y
                        voxels_positions.push(world_x, world_y, world_z)
                        voxels_colors.push(red, green, blue, alpha)
                    }
                }
            }
        }

        this.voxelsPositions.vertices = new Float32Array(voxels_positions)
        this.voxelsColors.vertices = new Float32Array(voxels_colors)

        this.voxelsPositions.bufferData(gl)
        this.voxelsColors.bufferData(gl)

        var t_end = Time.getTimeMillis()
        var t_passed = t_end - t_start

        console.log("time = " + t_passed + "ms")

    }
    resize(context){
        var gl = this.gl
        var aspect = context.width/context.height
        gl.viewport(0, 0, this.canvas.element.width, this.canvas.element.height)
        // mat4.identity(this.camera.projection)
        mat4.ortho(this.camera.projectionMatrix, -1*aspect, 1*aspect, -1, 1, -1E+6, 1E+6)
        // mat4.perspective(this.camera.projectionMatrix, 65, aspect, 1E-6, 1E+6)
        this.camera.viewProjectionMatrixNeedsUpdate = true
    }
    update(context){
        var gl = this.gl
        // input
        var input = context.input
        // camera movement
        this.cameraControlOrbit.update(context)
        // this.camera.position[2] = 2 - Math.sin(Time.passed)*2
        // this.camera.eulers[1] = Math.cos(Time.passed*0.5)*30
        // this.camera.viewMatrixNeedsUpdate = true
        // monitor
        this.monitor.set("FPS", Math.round(Gfw.fps))
        this.monitor.set("Camera-Position-X", Numbers.roundToFixed(this.camera.position[0], 6, "            "))
        this.monitor.set("Camera-Position-Y", Numbers.roundToFixed(this.camera.position[1], 6, "            "))
        this.monitor.set("Camera-Position-Z", Numbers.roundToFixed(this.camera.position[2], 6, "            "))
        this.monitor.set("Camera-Distance  ", Numbers.roundToFixed(this.cameraControlOrbit.distance, 3, "         "))
        this.monitor.set("Camera-Zoom-Exp  ", Numbers.roundToFixed(this.cameraControlOrbit.zoom_exp, 3, "         "))
        this.monitor.set("Camera-Theta     ", Numbers.roundToFixed(this.cameraControlOrbit.angle_left_right/Math.PI*180, 3, "         ")+"°")
        this.monitor.set("Camera-Phi       ", Numbers.roundToFixed(this.cameraControlOrbit.angle_up_down/Math.PI*180, 3, "         ")+"°")
    }
    render(context){
        var gl = this.gl
        gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT)
        // begin render
        this.shaderProgram.use()
        // uniform point size
        var pointSize = Math.max(1.0, this.cameraControlOrbit.zoom / this.voxels_density * context.height / 2.82842712474)
        gl.uniform1f(this.shaderProgram.uniforms.uPointSize.location, pointSize)
        // uniform camera transform
        this.camera.updateViewProjectionMatrix()
        gl.uniformMatrix4fv(this.shaderProgram.uniforms.uCameraTransform.location, false, this.camera.viewProjectionMatrix);
        // attribute voxel positions
        gl.bindBuffer(gl.ARRAY_BUFFER, this.voxelsPositions.vbo)
        gl.vertexAttribPointer(this.shaderProgram.attributes.aVoxelPosition.location, this.voxelsPositions.pitch, gl.FLOAT, false, 0, 0)
        gl.enableVertexAttribArray(this.shaderProgram.attributes.aVoxelPosition.location)
        // attribute voxel colors
        gl.bindBuffer(gl.ARRAY_BUFFER, this.voxelsColors.vbo)
        gl.vertexAttribPointer(this.shaderProgram.attributes.aVoxelColor.location, this.voxelsColors.pitch, gl.FLOAT, false, 0, 0)
        gl.enableVertexAttribArray(this.shaderProgram.attributes.aVoxelColor.location)
        // draw
        gl.drawArrays(gl.POINTS, 0, this.voxelsPositions.numVertices)
    }
}

var App = new AppSingleton()
export default App