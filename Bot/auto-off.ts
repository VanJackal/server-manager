import {logger} from 'logging'
import {Service} from 'db'
import {getStatus, setState, State, isHostUp, canShutdown} from "gsm-interface";
import {pulsePower} from "power-interface";

const SRV_CHECK_INT = 1000 * 900 // service check interval time in seconds (1000 * 900 = 15min)
const SHUTDOWN_TIME = 1/24/60 * 30 // time in days for a service with no player to shutdown (30min)

const _interval = setInterval(updateServices, SRV_CHECK_INT)

async function removeShutdown(service:string){
    await Service.findOneAndUpdate({serviceId:service},{shutdown:null})
}

async function updateServices(){
    logger.debug("Running service update")
    if(!await isHostUp()){
        logger.trace("Host Offline no services updated")
        return
    }
    const services = await Service.find({})
    let online = 0;
    for (const service of services){
        let status;
        if(!service.autoOff) continue;
        try {
            status = await getStatus(service.serviceId)
        } catch (e){
            logger.error("failed to get status of service in updateServices")
            logger.error(JSON.stringify(e))
        }
        if(status.status == State.Online){
            online++;
        }
        if(!status.serviceId){
            logger.fatal(`updateService -- how the fuck`)
        } else if (status.status != State.Online) {
            if (status.shutdown){//remove the shutdown time if the service is not online
                logger.trace(`${service.serviceId} - removing shutdown time due to offline service`)
                await removeShutdown(service.serviceId)
                continue
            }
            logger.trace(`${service.serviceId} - no actions taken in update`)
        } else if(status.shutdown && status.shutdown < new Date() && status.players<=0){//shutdown if there are no players and the shutdown time has passed
            logger.trace(`${service.serviceId} - Automatic Shutdown`)
            await setState(service.serviceId,false)
            await removeShutdown(service.serviceId)
            online--
        } else if(status.players <= 0 && !status.shutdown) {//add a shutdown time if there isn't one and there are no players online
            logger.trace(`${service.serviceId} - new shutdown time added due to lack of players`)
            await postpone(service.serviceId, SHUTDOWN_TIME)
        } else if(status.players > 0 && status.shutdown) {//postpone shutdown if there are players online (not only postpones SHUTDOWN_TIME days from current time)
            logger.trace(`${service.serviceId} - shutdown time postponed`)
            await postpone(service.serviceId, SHUTDOWN_TIME)
        } else {
            logger.trace(`${service.serviceId} - no actions taken in update`)
        }
    }
    if(online == 0 && canShutdown()) {//shutdown the host machine if no services are online
        logger.info("Shutting down host machine")
        await pulsePower();
    }
}

/**
 * set a service's shutdown time to duration days from now
 * if the current shutdown time is longer than the postpone period no operation is done
 * @param service service to postpone
 * @param duration duration in days to postpone
 */
async function postpone(service:string, duration:number):Promise<Date>{
    logger.info(`setting shutdown for ${service} to ${duration*24} hours from now`)
    const srvObj = await Service.findOne({serviceId:service},{shutdown:1})
    const shutdown = new Date(Date.now() + duration * 24*3600000);
    if(!srvObj.shutdown || shutdown > srvObj.shutdown){
        await Service.findOneAndUpdate({serviceId:service},{shutdown:shutdown})
        return shutdown
    } else {
        return srvObj.shutdown
    }
}

/**
 * sets the service's shutdown time to duration days from execution time
 * regardless of current shutdown time
 * @param service service to set shutdown time on
 * @param duration time in days to set shutdown to
 */
async function setShutdown(service:string, duration:number):Promise<Date>{
    throw "NotImplemented"
}


async function overrideGlobal(active:boolean){
    logger.warn("Not Implemented - auto-off.overrideGlobal")
}

async function overrideService(active:boolean, service:string){
    logger.warn("Not Implemented - auto-off.overrideService")
}

export {
    overrideService,
    overrideGlobal,
    postpone
}