import {EmbedBuilder, SlashCommandBuilder} from "discord.js";
import {getStatus, isHostUp, State} from "gsm-interface";
import {Logs, Status} from "./Colours";
import {logger} from 'logging'
import {addEmbed} from "./util";

function colourFromState(state:State) {
    switch (state) {
        case State.Online:
            return Status.ONLINE
        case State.Offline:
            return Status.OFFLINE
        default:
            return Status.OTHER
    }
}

function dateToTimestamp(date:Date) {
    const time = Math.round(date.getTime() / 1000)
    return `<t:${time}:R>`
}


export = {
    data: new SlashCommandBuilder()
        .setName("status")
        .setDescription("Get the status of the host or a service")
        .addStringOption(option => option
            .setName("service")
            .setDescription("ID of the service to get the status of. Omit this for status of host.")
            .setRequired(false)
        ),
    async execute(interaction) {
        const service = interaction.options.getString('service')
        const hostState = await isHostUp()
        if(service && hostState) {
            let embeds = []
            let status
            try {
                status = await getStatus(service)
            } catch (e) {
                logger.warn("Error in status command execute:\n" + e)
                await interaction.reply({embeds:[new EmbedBuilder()
                        .setColor(Logs.ERROR)
                        .addFields({name:"Error",value:e})
                    ]})
                return
            }

            logger.debug(`Status in execute: ${JSON.stringify(status)}`)

            if (status.serviceId){
                const embed = new EmbedBuilder()
                    .setColor(colourFromState(status.status))
                    .setTitle(status.serviceName || "No Service Title")
                    .setDescription(status.description || "No Description")
                    .addFields(
                        {name:'Status', value:status.info || "Unknown"},
                        {name:"\u200B", value:"\u200B"},
                        {name:"Last Boot", value:status.lastBoot?dateToTimestamp(status.lastBoot):"Never"},
                        {name:"Player Last Seen", value:status.lastPlayer?dateToTimestamp(status.lastPlayer):"Never"},
                    )
                    .setAuthor({name:"ID: " + status.serviceId})
                logger.trace("Status Embed Created")

                if(status.additional){
                    logger.trace("adding additional info")
                    embed.addFields(
                        {name:"Additional Info", value:status.additional}
                    )
                }

                if (status.status === State.Online) {
                    logger.trace("adding online only status info")
                    embed.addFields(
                        {
                            name:"Auto Shutdown",
                            value:status.shutdown? dateToTimestamp(status.shutdown) : "Not Scheduled",
                        },
                        {
                            name:"Players",
                            value:`${status.players}` || "0"
                        }
                    )
                }
                embeds.push(embed)
            }

            addEmbed(status, embeds)
            await interaction.reply({embeds:embeds});
        } else {
            let color = hostState?Status.ONLINE:Status.OFFLINE;
            const embed = new EmbedBuilder()
                .setColor(color)
                .setTitle("Hades")
                .setDescription("Multi Server Host")
                .addFields(
                    {name:"Host Status",value:hostState?"online":"offline"}
                )
            await interaction.reply({embeds:[embed]})
            //TODO add list of services and their statuses in this response
        }
    }
}
