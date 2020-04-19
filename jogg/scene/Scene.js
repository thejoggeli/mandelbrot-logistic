import Log from "../log/Log.js"
import Arrays from "../util/Arrays.js"
import Scriptable from "../script/Scriptable.js"

class Scene extends Scriptable {
    constructor(){
        super()
        this.entities = []
        this.entities_added_queue = []
        this.entities_removed_queue = []
        this.entities_by_type = {}
        this.entities_by_id = {}
        this.entities_by_tag = {}
        this.entities_by_group = {}
        this.next_entity_id = 1
        this.render_order = null
    }
    getNextEntityId(){
        return this.next_entity_id++
    }
    onScriptAdd(script){
        script.scene = this
    }
    reset(){
        this.processAddedEntities()
        for(var i in this.entities){
            this.removeEntity(this.entities[i])
        }
        for(var x in this.scripts){
            this.scripts[x].onReset()
        }
        this.processRemovedEntities()
    }
    createTag(name){
        Log.error("Scene", "tag already exists: " + name)
        if(this.entities_by_tag[name] !== undefined){
            Log.error("Scene", "group already exists: " + name)
            return
        }
        this.entities_by_tag[name] = []
    }
    createGroup(name){
        if(this.entities_by_group[name] !== undefined){
            Log.error("Scene", "group already exists: " + name)
            return
        }
        Log.info("Scene", "create group " + name)
        this.entities_by_group[name] = []
    }
    moveEntityToGroup(entity, group){
        if(this.entities_by_group[group] === undefined){
            Log.error("Scene", "Group doesn't exist: " + group)
            return
        }
        Arrays.removeObject(this.entities_by_group[entity.group], entity)
        this.entities_by_group[group].push(entity)
        entity.group = group
    }
    addEntity(entity){
        if(entity.scene != null){
            Log.print(Log.Error, "Scene", "entity is already in a scene")
            return
        }
        if(entity.addded_to_scene){
            Log.print(Log.Error, "Scene", "entity was already in a scene")
            return
        }
        entity.scene = this
        entity.id = this.getNextEntityId()
        entity.init()
        this.entities_added_queue.push(entity)
    }
    removeEntity(entity){
        if(entity.removed_from_scene){
            Log.print(Log.Error, "Scene", "entity was already removed from a scene")
            return
        }
        if(entity.scene != this){
            Log.print(Log.Error, "Scene", "entity is not in this scene")
            return
        }
        entity.delete()
        entity.scene = null
        this.entities_removed_queue.push(entity)
    }
    addEntityImmediate(entity){
        this.addEntity(entity)
        this.processAddedEntities()
    }
    removeEntityImmediate(entity){
        this.removeEntity(entity)
        this.processRemovedEntities()
    }
    processAddedEntities(){
        if(this.entities_added_queue.length == 0) return
        // process added entities
        for(var i in this.entities_added_queue){
            var entity = this.entities_added_queue[i]
            // add entity to entities
            this.entities.push(entity)
            // add entity to entities_by_id
            this.entities_by_id[entity.id] = entity
            // add entity to entities_by_type
            if(this.entities_by_type[entity.type.id] === undefined)
                this.entities_by_type[entity.type.id] = []
            this.entities_by_type[entity.type.id].push(entity)
            // add entity to group
            if(this.entities_by_group[entity.group] === undefined){
                this.createGroup(entity.group)
            } else {
                this.entities_by_group[entity.group].push(entity)
            }
            // add entity to tags
            for(var key in entity.tags){
                if(this.entities_by_tag[key] === undefined){
                    this.entities_by_tag[key] = []
                }
                this.entities_by_tag[key].push(entity)
            }
        }
        this.entities_added_queue = []
    }
    processRemovedEntities(){
        if(this.entities_removed_queue.length == 0) return
        // process removed entities
        for(var i in this.entities_removed_queue){
            var entity = this.entities_removed_queue[i]
            // remove entity from entities
            Arrays.removeObject(this.entities, entity)
            // remove entity from entities_by_id
            delete this.entities_by_id[entity.id]
            // remove entity from entities_by_type
            Arrays.removeObject(this.entities_by_type[entity.type.id], entity)
            // remove entity from group
            Arrays.removeObject(this.entities_by_group[entity.group], entity)
            // remove entity from tags
            for(var key in entity.tags){
                Arrays.removeObject(this.entities_by_tag[key], entity)
            }
        }
        this.entities_removed_queue = []  
    }
    addEntityTag(entity, tag){
        if(this.entities_by_tag[tag] === undefined){
            this.entities_by_tag[tag] = []
        }
        this.entities_by_tag[tag].push(entity)
        entity.tags[tag] = true
    }
    removeEntityTag(entity, tag){
        if(this.entities_by_tag[tag]){
            Arrays.removeObject(this.entities_by_tag[tag], entity)
        }
        delete entity.tags[tag]
    }
    getEntities(){
        return this.entities
    }
    getEntityById(id){
        if(this.entities_by_id[id] === undefined){
            return null
        }    
        return this.entities_by_id[id]
    }
    getEntitiesByType(type){
        if(this.entities_by_type[type.id] === undefined){
            return null
        }    
        return this.entities_by_type[type.id]
    }
    getEntitiesByGroup(name){
        return this.entities_by_group[name]
    }
    getEntitiesByTag(name){
        var entities = this.entities_by_tag[name]
        if(!entities){
            entities = []
            this.entities_by_tag[name] = entities
        }
        return entities
    }
    update(context){
        this.processAddedEntities()
        this.processRemovedEntities()
        for(var i in this.entities){
            this.entities[i].update(context)
        }
        this.processAddedEntities()
        this.processRemovedEntities()
    }
    setRenderOrder(order){
        this.render_order = order
    }
    render(context){
        if(this.render_order){
            for(var x in this.render_order){
                var type = this.render_order[x]
                var entities = this.getEntitiesByType(type)
                for(var i in entities){
                    entities[i].render(context)
                }
            }  
        } else {
            for(var i in this.entities){
                this.entities[i].render(context)
            }
        }
        for(var x in this.scripts){
            this.scripts[x].onRender(context)
        }   
    }
    renderDebug(context){
        for(var i in this.entities){
            this.entities[i].renderDebug(context)
        }     
        for(var x in this.scripts){
            this.scripts[x].onRenderDebug(context)
        }  
    }
    unmarkEntities(entities){
        for(var i in entities){
            entities[i].marked = false
        }
    }
    removeUnmarkedEntities(entities){
        for(var i in entities){
            var entity = entities[i]
            if(!entity.marked){
                this.removeEntity(entity)
            }
        }    
    }
}

export default Scene