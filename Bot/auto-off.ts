import {logger} from 'logging'

const SRV_CHECK_INT = 1000 * 10 // service check interval time in seconds

/**
 * postpone a service from auto off for duration days
 * @param service service to postpone
 * @param duration duration in days to postpone
 */
async function postpone(service:string, duration:number):Promise<Date>{
    logger.info(`Postponing ${service} for ${duration} days`)
    logger.warn("Not Implemented - auto-off.postpone")
    return new Date()
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