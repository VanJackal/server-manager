import {logger} from 'logging'
const axios = require('axios')

type Res = {
    warn?:string,
    error?:string
}
enum State {
    Offline,
    Online,
    Unknown
}
type ServiceState = Res & {
    status:State,
    message:string
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
    logger.debug(`Getting status for: ${service}`)
    let {data, status} = await axios.get(`${process.env.SRV_ADDR}/status?srv=${service}`)
    logger.trace(`Status data:\n\t${JSON.stringify(data)}`)
    return {
        serviceID:service,
        serviceName:"minecraft?",
        description:"a minecraft server",
        players:0,
        status:data.status,
        info: data.message,
        lastPlayer: new Date(),
        warn:data.warn,
        error:data.error
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