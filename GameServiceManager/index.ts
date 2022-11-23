import express = require('express')
import {logger} from 'logging'
import {router} from './routes'

const app = express()

const port = process.env.PORT || 5000


app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", process.env.ORIGIN);
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
    res.header("Access-Control-Allow-Credentials","true")
    next();
});

app.use(express.json());


app.use('*',(req,res,next) => {
    logger.trace(`request: ${req.method} ${req.originalUrl}`)
    next()
})

app.use('/api/',router)

app.use((err, req, res, next) => {
    logger.error(err);
    res.sendStatus(500);
    //next();
})

app.listen(port, () => {
    logger.info(`Server running on port ${port}`)
})