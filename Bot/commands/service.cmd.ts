import {EmbedBuilder, Interaction, SlashCommandBuilder} from "discord.js";
import {setState} from 'gsm-interface'
import {addEmbed} from "./util";

const COLOR = "#82da82"


export = {
    data: new SlashCommandBuilder()
        .setName("service")
        .setDescription("Controls game servers")
        .addSubcommand( subcommand =>
            subcommand
                .setName("start")
                .setDescription("Start a service")
                .addStringOption( option => option
                    .setName("service")
                    .setDescription("ID of the server you want to start.\nUse /status to the of ids")
                    .setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("stop")
                .setDescription("Stop a service")
                .addStringOption(option => option
                    .setName("service")
                    .setDescription("ID of the server you want to start.\nUse /status to the of ids")
                    .setRequired(true))
        )
        ,
    async execute(interaction) {
        const service = interaction.options.getString("service");
        let embeds = []
        let embed = new EmbedBuilder()
            .setColor(COLOR)
            .setTimestamp()
        let resP;
        const channel = interaction.channel;
        switch (interaction.options.getSubcommand()){
            case "start":
                resP = setState(service, true)
                embed.addFields({name:"/service",value:`started ${service}`})
                interaction.reply({content:`Starting ${service}`,ephemeral:true})
                break;
            case "stop":
                resP = setState(service, false)
                embed.addFields({name:"/service",value:`stopped ${service}`})
                interaction.reply({content:`Stopping ${service}`,ephemeral:true})
                break;
        }
        embed.setFooter({text:`uid: ${interaction.member.id}`})
        await channel.sendTyping();
        const res = await resP
        if (res.warn||res.error) {
            addEmbed(res, embeds);
        } else {
            embeds.push(embed)
        }
        await channel.send({embeds:embeds});
    }
}
