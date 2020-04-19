import { mat4, vec3, quat } from "../gl-matrix/index.js";


export default class Camera3d {
    constructor(){

        // projection matrix
        this.projectionMatrix = mat4.create()
        mat4.perspective(this.projectionMatrix, 65, 1, 1E-6, 1E+6)

        // view matrix
        this.viewMatrix = mat4.create();
        this.inverseViewMatrix = mat4.create();

        // view-projection matrix
        this.viewProjectionMatrix = mat4.create()

        // position, rotation, scale
        this.position = vec3.create();
        this.rotation = quat.create();
        this.scale = vec3.create();

        // position, rotation, scale (initial values)
        vec3.set(this.rotation, 0, 0, 0)
        quat.identity(this.rotation)
        vec3.set(this.scale, 1, 1, 1);

        // euler angles
        this.eulers = vec3.create();
        this.useEulers = true

        // initial transform
        this.viewMatrixNeedsUpdate = true
        this.viewProjectionMatrixNeedsUpdate = true
        this.updateViewMatrix()
        this.updateViewProjectionMatrix()
    }   
    updateViewMatrix(){
        if(this.viewMatrixNeedsUpdate){
            this.viewMatrixNeedsUpdate = false
            this.viewProjectionMatrixNeedsUpdate = true
            if(this.useEulers){
                quat.fromEuler(this.rotation, this.eulers[0], this.eulers[1], this.eulers[2]);
            }
            mat4.fromRotationTranslationScale(this.viewMatrix, this.rotation, this.position, this.scale);
            mat4.invert(this.inverseViewMatrix, this.viewMatrix);	
        }
    }
    updateViewProjectionMatrix(){
        this.updateViewMatrix()
        if(this.viewProjectionMatrixNeedsUpdate){
            this.viewProjectionMatrixNeedsUpdate = false
            mat4.mul(this.viewProjectionMatrix, this.projectionMatrix, this.inverseViewMatrix)
        }
    }
}