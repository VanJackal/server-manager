import {model, Schema, Types} from 'mongoose'

interface IHost {

}

const HostSchema = new Schema<IHost>({

})

const Host = model<IHost>('service', HostSchema)

export {
    Host,
    IHost
}