import {model, Schema, Types} from 'mongoose'

interface IHost {
    hostId:string,
    autoOff:boolean,
    gsmUri:string
}

const HostSchema = new Schema<IHost>({
    hostId:{
        type:String,
        required:true
    },
    autoOff:{
        type:Boolean,
        required:true
    },
    gsmUri:{
        type:String,
        required:true
    }
})

const Host = model<IHost>('service', HostSchema)

export {
    Host,
    IHost
}