import {logger} from 'logging'

async function overrideGlobal(active:boolean){
    logger.warn("Not Implemented - auto-off.overrideGlobal")
}

async function overrideService(active:boolean, service:string){
    logger.warn("Not Implemented - auto-off.overrideService")
}

export {
    overrideService,
    overrideGlobal
}