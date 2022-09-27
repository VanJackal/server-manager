import express = require('express');
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

router.get('/status', (req, res) => {
    res.json({warn:`input query: ${JSON.stringify(req.query)}`})
    res.status(200);
})

router.post('/state/:id', (req, res) => {
    res.json({warn:`input service id: ${req.params.id}`})
})

export {
    router
}