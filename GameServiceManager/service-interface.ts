//should use systemctl is-active [service] to check the state of the service
import {exec} from 'child_process'
import {logger} from 'logging'

/**
 * get the state of the service with the id 'service'
 * @param service
 *
 * @return boolean true iff the service is active
 */
export async function getState(service:string):Promise<boolean> {
    return await getExtendedState(service) === "active"
}
export async function getExtendedState(service:string):Promise<string> {
    logger.info(`Getting state of ${service}`)
    const stdout = (await execAsync(`systemctl --user is-active ${service}`)).trim()
    logger.trace(`got state of ${service}:\n\t"${stdout}"`)
    if(stdout === "failed"){
        logger.warn(`${service} reported failed state`)
    }
    return stdout
}

export async function setState(service:string, state:boolean):Promise<void> {
    logger.info(`Setting state of ${service} to ${state}`)
    const currentState = await getState(service)
    if (currentState == state) throw "Service state conflict exception";
    await execAsync(`systemctl --user ${state?"start":"stop"} ${service}`)
    logger.debug(`Set state of ${service}`)
}

async function execAsync(command:string):Promise<any>{
    return new Promise<any>((resolve, reject) => {
        logger.trace("executing " + command)
        exec(command, (error, stdout, stderr) => {
            if(stdout){
                resolve(stdout)
                return
            } else if (error||stderr){
                reject(error||stderr)
                return
            }
            if (error||stderr) {
                logger.error(JSON.stringify(error))
                logger.error(JSON.stringify(stderr))
            } else {
                resolve(stdout)
            }
        })
    })
}
