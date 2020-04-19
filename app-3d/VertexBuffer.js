import Log from "../jogg/log/Log.js"

export default class VertexBuffer {
    constructor(gl, usage){
        this.gl = gl
        this.usage = usage
        this.vertices = null 
        this.vbo = gl.createBuffer()
        this.pitch = 3
        this.numVertices = 0
    }
    bufferData(){
        if(this.vertices.length%this.pitch != 0){
            this.numVertices = 0
            Log.error("VertexBuffer", "vertices.length must be divisible by pitch " + this.pitch)
        } else {
            this.numVertices = this.vertices.length/this.pitch
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vbo)
            this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.vertices), this.usage)
        }
    }
}