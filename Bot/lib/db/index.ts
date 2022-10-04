import {logger} from 'logging'
import * as mongoose from 'mongoose'

function init():void{
    // @ts-ignore
    mongoose.connect(process.env.DB, {useNewUrlParser:true, useFindAndModify:false, useUnifiedTopology:false}, (err) => {
        if (err) {
            logger.fatal("DB failed to connect")
            logger.fatal(err)
        } else {
            logger.info(`DB Connected @ ${process.env.DB}`)
        }
    })
}
init();

export * from './service'
export * from './host'