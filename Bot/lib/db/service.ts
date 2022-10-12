import {model, Schema} from 'mongoose'

interface IService {
    serviceId:string,
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
    serviceId:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    additional:{
        type:String
    },
    lastBoot:{
        type:Date
    },
    lastPlayer:{
        type:Date
    },
    shutdown:{
        type:Date
    },
    autoOff:{
        type:Boolean,
        required:true
    },
    startCmd:{
        type:String,
        required:true
    },
    stopCmd:{
        type:String,
        required:true
    }

})

const Service = model<IService>('gameService', ServiceSchema)

export {
    Service,
    IService
}