import {logger} from 'logging'
let gpio;
let power;
const INTERFACE_PIN = 16;// GPIO 23 on RPi (number refers to physical position of the pin)
if (process.env.PROD){
    logger.info("Loading Prod power-interface")
    gpio = require("onoff").Gpio;
    power = new gpio(INTERFACE_PIN,'out');
} else {
    gpio = null
}

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

async function pressPowerButton(duration):Promise<void>{
    logger.info(`Power pressed for ${duration}s`)
    if(!process.env.PROD){
        logger.warn("PROD env variable not set, no pins fired")
        return
    } else {
        return new Promise(async (resolve, reject) => {
            await power.write(1)
            setTimeout(async () => {
                await power.write(0)
                resolve()
            }, duration)
        })
    }
}

process.on('SIGINT', () => {
    power.unexport();
})

export {
    HostState,
    getState,
    pulsePower,
    holdPower
}

