import express = require('express');
import {Service, Host} from 'db'
import {logger} from 'logging'

const router = express.Router()

enum State {
    Offline,
    Online,
    Unknown
}

type GenericRes = {
    warn?:string,
    error?:string
}

type Status = GenericRes & {
    status:State,
    message:string
}

/**
 * get the status of a service
 */
router.get('/status', (req, res) => {
    res.json({warn:`input query: ${JSON.stringify(req.query)}`})
    res.status(200);
})

/**
 * send body {state:bool} and sets the service to that state
 * returns 409 if the service is already in that state
 */
router.post('/state/:id', (req, res) => {
    res.json({warn:`input service id: ${req.params.id}`})
})

/**
 * used to determine if the api is online
 */
router.get('/', (req,res) => {
    res.status(200)
    res.send()
})

router.post('/service', async (req,res) => {
    logger.debug(`Attempting service creation with:\n\t${JSON.stringify(req.body)}`)
    if(!req.body.serviceId) {
        logger.warn("POST: /service called without serviceId")
        res.status(400)
        res.send()
        return
    }
    const service = await Service.findOne({serviceId:req.body.serviceId})
    if (service) {
        logger.warn(`Attempted to create a service with duplicate id: ${req.body.serviceId}`)
        res.status(409)
        res.send()
        return
    }

    try {
        const srv = await Service.create(req.body)
        logger.info(`New service created:\n\t${srv}`)
        res.json(srv)
        res.status(201)
    } catch (e) {
        logger.error(JSON.stringify(e))
        res.status(400)
    }
    res.send()
})

router.post('/host', async (req,res) => {
    logger.debug(`Creating new host with:\n\t${JSON.stringify(req.body)}`)
    try {
        const host = await Host.create(req.body)
        res.status(201)
        res.json(host)
    } catch (e) {
        logger.error(JSON.stringify(e))
        res.status(400)
    }
    res.send()
})

export {
    router
}