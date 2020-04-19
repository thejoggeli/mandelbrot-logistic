import Canvas from "./Canvas"

export default class Layer {
    constructor(canvas){
        this.canvas = canvas
        this.element = document.createElement("canvas")
        this.$element = $(this.element)
        this.$element.addClass("gfw-canvas")
        this.ctx = this.element.getContext("2d")
        Canvas.extendCtx(this.ctx)
    }
}