import {Interaction, SlashCommandBuilder} from "discord.js";
import {setState} from 'gsm-interface'


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
        switch (interaction.options.getSubcommand()){
            case "start":
                await setState(service, true)
                await interaction.reply(`Started ${service}`)
                break;
            case "stop":
                await setState(service, false)
                await interaction.reply(`Stopping ${service}`)
                break;
        }
    }
}
