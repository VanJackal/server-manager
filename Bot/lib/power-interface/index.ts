import {logger} from 'logging'
enum HostState {
    ONLINE,
    OFFLINE,
    OTHER
}

type HostStatus = {
    state:HostState,
    info:string
}

async function getState():Promise<HostStatus> {
    logger.warn("Not Implemented - power-interface.getState")
    return {
        state:HostState.ONLINE,
        info:"Host is Online"
    }
}

export {
    HostState,
    getState
}

