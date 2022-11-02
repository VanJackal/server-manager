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

    const {data, status} = await axios.get(`${process.env.SRV_ADDR}/status/${service}`)
    logger.trace(`Status data:\n\t${JSON.stringify(data)}`)
    logger.trace(`Service Date:\n\t${JSON.stringify(serviceEntry)}`)
    if (data.players>0){
        Service.findOneAndUpdate({serviceId:service},{lastPlayer:Date.now()})
    }
    return {
        serviceId:service,
        serviceName:serviceEntry.name,
        description:serviceEntry.description,
        players:data.players,
        status:data.status?State.Online:State.Offline,
        info: data.message,
        additional: serviceEntry.additional,
        lastBoot: serviceEntry.lastBoot,
        lastPlayer: data.players>0?new Date():serviceEntry.lastPlayer,
        shutdown: serviceEntry.shutdown,
        warn:data.warn,
        error:data.error
    }
}

async function setState(service:string, state:boolean):Promise<Res> {
    logger.debug(`Setting state of ${service} to \`${state?"online":"offline"}\``)
    const {data, status} = await axios.post(`${process.env.SRV_ADDR}/state/${service}`,{state:state},{validateStatus: (status) => {
        return status >= 200 && status < 300 || [404, 409].includes(status)
    }})
    switch (status) {
        case 200:
            logger.info(`[${service}] state set to ${state}`)
            return data
        case 404:
            logger.trace(`non existent service (${service}) called in setstate`)
            return {error:`service:\`${service}\` does not exist`}
        case 409:
            logger.trace(`attempted to set state of service to its current state (${service})`)
            return {error:`${service} already ${state?"online":"offline"}`}
        case status>300:
            logger.warn("Received error response in setState, status: " + status)
            logger.warn(JSON.stringify(data))
            return data
        default:
            logger.error(`status ${status} in setState unhandled`)
            return data
    }
}

async function isHostUp():Promise<boolean>{
    logger.info("checking host state")
    try{//if the request takes longer than 1s the server is not online
        await axios.get(process.env.SRV_ADDR,{timeout:1000})
        return true
    } catch (e) {//todo switch this to an icmp request and add icmp event listener to the api
        return false
    }

}

export {
    setState,
    getStatus,
    isHostUp,
    State,
    Res,
    Status
}