import {logger} from 'logging'
const axios = require('axios')
import {Service} from 'db'

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
    message:string,
    players:number
}
type Status = Res & {
    serviceName:string,
    serviceId:string,
    description:string,
    status:State,
    info:string,
    players:number,
    lastBoot?:Date,
    lastPlayer?:Date,
    shutdown?:Date,
    additional?:string//holds extra info (e.g. link to mod list)
}

//TODO add icon to the server
async function getStatus(service:string):Promise<Status | Res>{
    logger.debug(`Getting status for: ${service}`)
    const serviceEntry = await Service.findOne({serviceId:service})
    if (!serviceEntry){
        return {
            error:`Service with id \`${service}\` not found.`
        }
    }

    const {data, status} = await axios.get(`${process.env.SRV_ADDR}/status?srv=${service}`)
    logger.trace(`Status data:\n\t${JSON.stringify(data)}`)

    return {
        serviceId:service,
        serviceName:serviceEntry.name,
        description:serviceEntry.description,
        players:data.players,
        status:data.status,
        info: data.message,
        additional: serviceEntry.additional,
        lastBoot: serviceEntry.lastBoot,
        lastPlayer: serviceEntry.lastPlayer,
        shutdown: serviceEntry.shutdown,
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