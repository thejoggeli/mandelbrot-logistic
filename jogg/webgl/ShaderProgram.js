export default class ShaderProgram {
    constructor(gl){
        this.gl = gl
        this.attributes = {}
        this.uniforms = {}
        this.program = gl.createProgram()
        this.shaders = []
    }
    attachShader(shader){
        var gl = this.gl
        gl.attachShader(this.program, shader.shader)
        this.shaders.push(shader)
    }
    link(){
        var gl = this.gl
        gl.linkProgram(this.program)
        if(!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
		    var linkErrLog = gl.getProgramInfoLog(this.program)
            console.error("Shader this.program did not link successfully. " + "Error log: " + linkErrLog);		
        }
    }
    addAttribute(name){
        this.attributes[name] = {
            name: name,
            location: this.gl.getAttribLocation(this.program, name),
        }
    }
    addUniform(name){
        this.uniforms[name] = {
            name: name,
            location: this.gl.getUniformLocation(this.program, name),
        };	
    }
    use(){
        this.gl.useProgram(this.program)
    }   
}
