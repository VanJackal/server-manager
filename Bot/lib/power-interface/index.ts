import {logger} from 'logging'
let gpio;
if (process.env.PROD){
    logger.info("Loading Prod power-interface")
    gpio = require("rpi-gpio").promise;
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

const INTERFACE_PIN = 16;// GPIO 23 on RPi (number refers to physical position of the pin)

function init(){
    gpio.setup(INTERFACE_PIN,gpio.DIR_OUT)
}


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
            await gpio.write(INTERFACE_PIN, true).catch((e) => {
                reject(e)
            })
            setTimeout(() => {
                gpio.write(INTERFACE_PIN,false).catch((e) => {
                    reject(e)
                })
                resolve()
            }, duration)
        })
    }
}

if(process.env.PROD) init()

export {
    HostState,
    getState,
    pulsePower,
    holdPower
}

