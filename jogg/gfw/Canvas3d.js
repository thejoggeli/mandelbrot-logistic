import Canvas from "./Canvas.js";

export class Canvas3d extends Canvas {
    constructor(id, params){
        super(id, params)
        
        // webgl context
        this.gl = this.element.getContext("webgl")

    }
    render(){
        super.render()
        if(this.should_render){
            this.notifySubscribers("Render", this)
        }
    }
}