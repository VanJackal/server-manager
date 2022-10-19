import {Res} from 'gsm-interface'
import {Logs} from "./Colours"
import {logger} from 'logging'
import {EmbedBuilder} from "discord.js";

function addEmbed(res:Res,embeds:any[]):void{
    if (res.warn) {
        logger.warn(res.warn);
        embeds.push(new EmbedBuilder()
            .setColor(Logs.WARN)
            .addFields({name:"Warning", value:res.warn})
            .setTimestamp()
        )
    }
    if(res.error) {
        logger.error(res.error)
        embeds.push(new EmbedBuilder()
            .setColor(Logs.ERROR)
            .addFields({name:"Error",value:res.error})
            .setTimestamp()
        )
    }
}

export {
    addEmbed
}