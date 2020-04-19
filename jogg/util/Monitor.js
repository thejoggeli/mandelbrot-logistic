import Log from "../log/Log.js" 

class Monitor {
    constructor(){
        this.rows = {}
        this.spacer = ": "
    }
    install(){
        Log.info("Monitor", "install")
        this.$anchor = $("<div class='jogg-monitor-anchor'>")
        this.$element = $("<div class='jogg-monitor'>")
        this.$element.addClass("noselect")
        $("body").append(this.$anchor)
        $(this.$anchor).append(this.$element)
        return this
    }
    uninstall(){
        this.$anchor.remove()
        this.rows = {}
    }
    setVisible(visible){
        if(visible){
            this.$element.show()
        } else {		
            this.$element.hide()
        }
    }
    add(key, name, value){
        if(this.rows[key] !== undefined){
            console.log("ERROR: monitor " + key + " already registered")
        } else {
            var row = new Monitor.Row(this, key, name)
            this.rows[key] = row
            this.$element.append(row.$element)
            if(value !== undefined){
                this.set(key, value)
            }
        }
    }
    label(name){
        var $label = $("<div class='monitor-label'></div>")
        $label.html(name)
        this.$element.append($label)
    }
    set(key, value){        
        if(this.rows[key] === undefined){
            this.add(key, key, value)
        } else {
            this.rows[key].set(value)
        }
    }
}
Monitor.Row = class {
    constructor(monitor, key, name){
        this.monitor = monitor            
        this.key = key
        this.name = name
        this.$element = $("<div class='monitor-row'>")
        this.$element.append("<span class='monitor-name'>" + name + this.monitor.spacer + "</span>")
        this.$value = $("<span class='monitor-value'></span>")
        this.$element.append(this.$value)
    }
    set(value){
        if(value === true) value = "true"
        else if(value === false) value = "false"
        this.$value.html(value)
    }
    destory(){
        this.$element.remove()
    }
}

export default Monitor