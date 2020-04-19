import Enum from "../util/Enum.js"

export default class Shader {
    constructor(gl, type, src){
        type = Shader.Type.getEntryByName(type)
        this.gl = gl
        this.type = type
        this.src = src.trim()
        this.shader = gl.createShader(gl[type.gl_type])
    }
    compile(){        
        var gl = this.gl
        gl.shaderSource(this.shader, this.src)
        gl.compileShader(this.shader)

        var compilationLog = gl.getShaderInfoLog(this.shader)
        if(compilationLog != ""){
            console.error(compilationLog)
            var split = this.src.split("\n")
            for(var i = 0; i < split.length; i++){
                var line = ""+(i+1)
                console.warn(line.padStart(5)+": " + split[i])
            }
        }
    }
}
Shader.Type = new Enum([
    {id: 0, name: "Vertex", gl_type: "VERTEX_SHADER"},
    {id: 1, name: "Fragment", gl_type: "FRAGMENT_SHADER"},
    {id: 2, name: "Geometry", gl_type: "GEOMETRY_SHADER"},
])