import Enum from "../util/Enum.js"
import Objects from "../util/Objects.js"

function EntityType(){}
EntityType.enum = new Enum()
EntityType.nextId = 1
EntityType.create = function(params){
    Objects.set(params, "id", EntityType.nextId++)
    Objects.set(params, "name", "type_" + params.id)
    EntityType[params.name] = EntityType.enum.addEntry(params)
}

export default EntityType 