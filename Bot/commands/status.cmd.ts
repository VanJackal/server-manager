import {EmbedBuilder, SlashCommandBuilder} from "discord.js";
import {getStatus, State} from "gsm-interface";
import {Status,Logs} from "./Colours";
import {logger} from 'logging'
import {HostState, getState} from "power-interface"

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
        if(service) {
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

            const embed = new EmbedBuilder()
                .setColor(colourFromState(status.status))
                .setTitle(status.serviceName || "No Service Title")
                .setDescription(status.description || "No Description")
                .addFields(
                    {name:'Status', value:status.info || "Unknown"},
                    {name:"\u200B", value:"\u200B"},
                    {name:"Last Boot", value:status.boot?dateToTimestamp(status.boot):"Never"},
                    {name:"Player Last Seen", value:status.lastPlayer?dateToTimestamp(status.lastPlayer):"Never"},
                )
                .setAuthor({name:"ID: " + status.serviceID})
            logger.trace("Status Embed Created")

            if (status.status === State.Online) {
                embed.addFields(
                    {
                        name:"Auto Shutdown",
                        value:status.shutdown? dateToTimestamp(status.shutdown) : "Not Scheduled",
                        },
                )
            }
            embeds.push(embed)
            if (status.warn) {
                logger.warn(status.warn)
                embeds.push( new EmbedBuilder()
                    .setColor(Logs.WARN)
                    .addFields({name:"Warning", value:status.warn})
                    .setTimestamp()
                )
            }
            if (status.error) {
                logger.error(status.error)
                embeds.push( new EmbedBuilder()
                    .setColor(Logs.ERROR)
                    .addFields({name:"Error", value:status.error})
                    .setTimestamp()
                )
            }
            await interaction.reply({embeds:embeds});
        } else {
            const hostState = await getState()
            let color;
            switch (hostState.state) {
                case HostState.OFFLINE:
                    color = Status.OFFLINE
                    break
                case HostState.ONLINE:
                    color = Status.ONLINE
                    break
                default:
                    color = Status.OTHER
            }
            const embed = new EmbedBuilder()
                .setColor(color)
                .setTitle("Hades")
                .setDescription("Multi Server Host")
                .addFields(
                    {name:"Host Status",value:hostState.info}
                )
            await interaction.reply({embeds:[embed]})
            //TODO add list of services and their statuses in this response
        }
    }
}
