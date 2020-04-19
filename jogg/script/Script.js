export default class Script {
    constructor(){
        this.owner = null
        this.name = null
        this.enabled = true
    }
    setEnabled(b){
        if(this.owner){
            this.owner.setScriptEnabled(this.name, b)
        } else {
            this.enabled = b
        }
    }
    onEnabled(){

    }
    onDisabled(){

    }
    onAdd(){

    }
    onRemove(){

    }
}