import express = require('express');
import {Service, Host} from 'db'
import {logger} from 'logging'

const router = express.Router()

type GenericRes = {
    warn?:string,
    error?:string
}

type Status = GenericRes & {
    status:number,//0 = offline, 1 = online, 2 = unknown
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
    logger.debug(`Creating new service with:\n\t${JSON.stringify(req.body)}`)
    try {
        const srv = await Service.create(req.body)
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