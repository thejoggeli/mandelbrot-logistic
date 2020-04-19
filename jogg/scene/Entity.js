import Vec2         from "../util/Vec2.js"
import Scriptable   from "../script/Scriptable.js"

export default class Entity extends Scriptable {
    constructor(type, scene){
        super()
        this.added_to_scene = false
        this.removed_form_scene = false
        this.id = -1
        this.type = type
        this.marked = false
        this.group = "default"
        this.tags = {}
        this.position = Vec2.create()
        this.velocity = Vec2.create()
        this.angle = 0
        this.angle_velocity = 0
        this.user_data = {}
        this.scene = null
        // try adding entity to scene
        if(scene !== undefined){
            scene.addEntity(this)
        }
    }
    onScriptAdd(script){
        script.entity = this
        // init script if entity is already added to the scene
        if(this.scene){
            script.onInit()
        }
    }
    onScriptRemove(script){
        script.onDelete()
    }
    setMarked(b){
        this.marked = b
    }
    setGroup(group){
        if(this.scene){
            this.scene.moveEntityToGroup(this, group)
        } else {
            this.group = group
        }
    }
    addTag(tag){
        if(this.scene){
            this.scene.addEntityTag(this, tag)
        } else {
            this.tags[tag] = true            
        }
    }
    hasTag(tag){
        return this.tags[tag] !== undefined && this.tags[tag] !== false
    }
    removeTag(tag){
        if(this.scene){
            this.scene.removeEntityTag(this, tag)
        } else {
            delete this.tags[tag]
        }
    }
    init(){
        this.added_to_scene = true
        // init scripts that were added before the entity was added to the scene
        for(var x in this.scripts){
            this.scripts[x].onInit()
        }        
    }
    delete(){
        this.removed_form_scene = false
        for(var x in this.scripts){
            this.scripts[x].onDelete()
        }
    }
    update(context){
        for(var x in this.scripts_enabled){
            this.scripts_enabled[x].onUpdate(context)
        }
    }
    render(context){
        for(var x in this.scripts_enabled){
            this.scripts_enabled[x].onRender(context)
        }
    }
    renderDebug(context){
        for(var x in this.scripts_enabled){
            this.scripts_enabled[x].onRenderDebug(context)
        }
    }
    destroy(){
        if(this.scene){
            this.scene.removeEntity(this)
        }
    }
}

