import {model, Schema} from 'mongoose'

interface IService {
    strId:string,
    name:string,
    description:string,
    additional?:string,
    lastBoot?:Date,
    lastPlayer?:Date,
    shutdown?:Date,
    autoOff:boolean,
    startCmd:string,
    stopCmd:string
}

const ServiceSchema = new Schema<IService>({

})

const Service = model<IService>('service', ServiceSchema)

export {
    Service,
    IService
}