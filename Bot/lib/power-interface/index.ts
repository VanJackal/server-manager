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

//units should be ms
const DUR_HOLD = 10000;
const DUR_PULSE = 500;

async function getState():Promise<HostStatus> {
    logger.warn("Not Implemented - power-interface.getState")
    return {
        state:HostState.ONLINE,
        info:"Host is Online"
    }
}

async function pulsePower(){
    return pressPowerButton(DUR_PULSE)
}

async function holdPower(){
    return pressPowerButton(DUR_HOLD)
}

async function pressPowerButton(duration){
    logger.warn("Not Implemented = power-interface.pressPowerButton")
}

export {
    HostState,
    getState,
    pulsePower,
    holdPower
}

