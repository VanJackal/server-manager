import {logger} from 'logging'

type Res = {
    warn?:string,
    error?:string
}
enum State {
    Offline,
    Online,
    Unknown
}
type Status = Res & {
    serviceName:string,
    serviceID:string,
    description:string,
    status:State,
    info:string,
    players:number,
    boot?:Date,
    lastPlayer?:Date,
    shutdown?:Date,
    additional?:string//holds extra info (e.g. link to mod list)
}

//TODO add icon to the server
async function getStatus(service:string):Promise<Status>{
    logger.warn("Not Implemented - gsm-interface.getStatus")
    return {
        serviceID:service,
        serviceName:"minecraft?",
        description:"a minecraft server",
        players:0,
        status:State.Offline,
        info: "Service Offline",
        lastPlayer: new Date(),
        warn:"not implemented"
    }
}

async function setState(service:string, state:boolean):Promise<Res> {
    logger.warn("Not Implemented - gsm-interface.setState")
    if(!state) throw "Test error"
    return {}
}

export {
    setState,
    getStatus,
    State
}