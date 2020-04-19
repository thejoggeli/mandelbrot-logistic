import Strings      from "./Strings.js"

class Color {
    constructor(r, g, b, a){
        this.r = r === undefined ? 255 : r
        this.g = g === undefined ? 255 : g
        this.b = b === undefined ? 255 : b
        this.a = a === undefined ? 255 : a
        this.r_float = 0
        this.g_float = 0
        this.b_float = 0
        this.a_float = 0 
        this.h = 0
        this.s = 0
        this.l = 0
        this.rgba32 = 0
        this.rgbastr = 0
        this.hexstr = 0
    }
    set_rgb(r, g, b){
        this.r = r; this.g = g; this.b = b
        return this
    }
    set_rgba(r, g, b, a){
        this.r = r; this.g = g; this.b = b; this.a = a
        return this
    }
    set_rgba32(rgba32){
        this.rgba32 = rgba32
        return this
    }
    set_hsl(h, s, l){
        this.h = h; this.s = s; this.l = l
        return this
    }
    hsl_to_rgb(){        
        this.hsl_to_rgbfloat()
        this.a_float = 1.0
        this.rgbafloat_to_rgba()
        return this
    }
    hsl_to_rgbfloat(){        
        this.h %= 1.0
        if(this.s == 0){
            this.r = this.g = this.b = this.l; // achromatic
        } else {
            var q = this.l < 0.5 ? this.l * (1 + this.s) : this.l + this.s - this.l * this.s
            var p = 2 * this.l - q
            this.r = Color.hue2rgb(p, q, this.h + 1/3)
            this.g = Color.hue2rgb(p, q, this.h)
            this.b = Color.hue2rgb(p, q, this.h - 1/3)
        }
        return this
    }
    rgbfloat_to_rgb(){    
        this.r = Math.min(Math.floor(this.r*256), 255)
        this.g = Math.min(Math.floor(this.g*256), 255)
        this.b = Math.min(Math.floor(this.b*256), 255)
        return this
    }
    rgbafloat_to_rgba(){        
        this.r = Math.min(Math.floor(this.r*256), 255)
        this.g = Math.min(Math.floor(this.g*256), 255)
        this.b = Math.min(Math.floor(this.b*256), 255)
        this.a = Math.min(Math.floor(this.a*256), 255)
        return this
    }
    rgba_to_rgba32(){
        this.rgba32 = (this.r*0x1000000) + (this.g*0x10000) + (this.b*0x100) + this.a 
        return this
    }
    rgba32_to_rgba(){
        this.r = (this.rgba32 >> 24) & 0xFF
        this.g = (this.rgba32 >> 16) & 0xFF
        this.b = (this.rgba32 >>  8) & 0xFF
        this.a = (this.rgba32 >>  0) & 0xFF
        return this
    }
    hsl_to_rgbastr(){
        this.hsl_to_rgb()
        this.rgba_to_rgbastr()
        return this
    }
    rgba_to_rgbastr(){
        this.rgbastr = "rgba(" + this.r + ", " + this.g + ", " + this.b + ", " + (this.a/255) + ")"
        return this
    }
    hsl_to_hexstr(){
        this.hsl_to_rgb()   
        this.rgba_to_hexstr()
    }
    rgba_to_hexstr(){
        this.rgba_to_rgba32()
        this.rgba32_to_hexstr()
        return this
    }
    rgba32_to_hexstr(){
        this.hexstr = "#" + Strings.pad("00000000", this.rgba32.toString(16), true)
        return this
    }    
}
// helper function for hslToRgb
Color.hue2rgb = function(p, q, t){
    if(t < 0) t += 1
    if(t < 0) t += 1
    if(t > 1) t -= 1
    if(t < 1/6) return p + (q - p) * 6 * t
    if(t < 1/2) return q
    if(t < 2/3) return p + (q - p) * (2/3 - t) * 6
    return p
}
Color.instance = new Color()

export default Color